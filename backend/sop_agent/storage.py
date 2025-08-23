from models import SOPHistory, SOPEmbedding, SessionLocal
import uuid
from datetime import datetime
import json
import numpy as np
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class Storage:
    def __init__(self):
        self.db = SessionLocal()

    def save_history(self, user_id, draft, feedback, cues):
        entry = SOPHistory(
            id=str(uuid.uuid4()),
            user_id=user_id,
            draft=draft,
            feedback='\n'.join(feedback),
            cues='\n'.join(cues),
            timestamp=datetime.utcnow()
        )
        self.db.add(entry)
        self.db.commit()
        return entry

    def get_history(self, user_id):
        return self.db.query(SOPHistory).filter_by(user_id=user_id).order_by(SOPHistory.timestamp.desc()).all()

    def save_embedding(self, content: str, content_type: str, embedding: List[float]):
        """Save content and its embedding for semantic search"""
        entry = SOPEmbedding(
            content=content,
            content_type=content_type,
            embedding=embedding,
            timestamp=datetime.utcnow()
        )
        self.db.add(entry)
        self.db.commit()
        return entry

    def search_similar(self, query_embedding: List[float], content_type: str = None, limit: int = 5, 
                      similarity_threshold: float = 0.3) -> List[Dict[str, Any]]:
        """
        Search for similar content using vector similarity with enhanced scoring
        
        Args:
            query_embedding: Query vector for similarity search
            content_type: Filter by content type (optional)
            limit: Maximum number of results
            similarity_threshold: Minimum similarity score (0-1)
        
        Returns:
            List of similar content with metadata and similarity scores
        """
        try:
            # Build query with similarity filtering
            query = self.db.query(SOPEmbedding).filter(
                SOPEmbedding.embedding.cosine_distance(query_embedding) < (1 - similarity_threshold)
            )

            if content_type:
                query = query.filter(SOPEmbedding.content_type == content_type)

            results = query.order_by(
                SOPEmbedding.embedding.cosine_distance(query_embedding)
            ).limit(limit).all()

            # Calculate actual similarity scores and add metadata
            similar_items = []
            for result in results:
                distance = float(result.embedding.cosine_distance(query_embedding))
                similarity = 1 - distance  # Convert distance to similarity
                
                # Only include results above threshold
                if similarity >= similarity_threshold:
                    similar_items.append({
                        'content': result.content,
                        'content_type': result.content_type,
                        'similarity': similarity,
                        'timestamp': result.timestamp,
                        'id': result.id,
                        'relevance_score': self._calculate_relevance_score(similarity, result.timestamp)
                    })

            # Sort by relevance score (combines similarity and recency)
            similar_items.sort(key=lambda x: x['relevance_score'], reverse=True)
            
            logger.info(f"Found {len(similar_items)} similar items for {content_type or 'any'} content type")
            return similar_items
            
        except Exception as e:
            logger.error(f"Error in similarity search: {e}")
            return []
    
    def _calculate_relevance_score(self, similarity: float, timestamp: datetime) -> float:
        """
        Calculate relevance score combining similarity and recency
        
        Args:
            similarity: Cosine similarity score (0-1)
            timestamp: When the content was created
            
        Returns:
            Combined relevance score
        """
        # Calculate recency factor (newer content gets higher score)
        now = datetime.utcnow()
        days_old = (now - timestamp).days
        recency_factor = max(0.1, 1 - (days_old / 365))  # Decay over a year, minimum 0.1
        
        # Combine similarity (70%) and recency (30%)
        relevance = (similarity * 0.7) + (recency_factor * 0.3)
        return relevance

    def get_similar_examples(self, draft: str, embedding_func, limit: int = 3, 
                            similarity_threshold: float = 0.4) -> List[str]:
        """
        Get similar SOP examples for RAG context with enhanced filtering
        
        Args:
            draft: Input SOP draft text
            embedding_func: Function to generate embeddings
            limit: Maximum number of examples
            similarity_threshold: Minimum similarity threshold
            
        Returns:
            List of similar example texts
        """
        try:
            # Generate embedding for the draft
            query_embedding = embedding_func(draft)

            # Search for similar examples
            similar = self.search_similar(
                query_embedding=query_embedding,
                content_type='example',
                limit=limit,
                similarity_threshold=similarity_threshold
            )

            # Extract content and log relevance
            examples = []
            for item in similar:
                examples.append(item['content'])
                logger.debug(f"Similar example (similarity: {item['similarity']:.3f}, relevance: {item['relevance_score']:.3f})")

            logger.info(f"Retrieved {len(examples)} similar examples for RAG context")
            return examples
            
        except Exception as e:
            logger.error(f"Error getting similar examples: {e}")
            return []

    def get_similar_feedback(self, draft: str, embedding_func, limit: int = 2, 
                            similarity_threshold: float = 0.3) -> List[str]:
        """
        Get similar feedback patterns for RAG context with enhanced filtering
        
        Args:
            draft: Input SOP draft text
            embedding_func: Function to generate embeddings
            limit: Maximum number of feedback patterns
            similarity_threshold: Minimum similarity threshold
            
        Returns:
            List of similar feedback texts
        """
        try:
            # Generate embedding for the draft
            query_embedding = embedding_func(draft)

            # Search for similar feedback
            similar = self.search_similar(
                query_embedding=query_embedding,
                content_type='feedback',
                limit=limit,
                similarity_threshold=similarity_threshold
            )

            # Extract content and log relevance
            feedback = []
            for item in similar:
                feedback.append(item['content'])
                logger.debug(f"Similar feedback (similarity: {item['similarity']:.3f}, relevance: {item['relevance_score']:.3f})")

            logger.info(f"Retrieved {len(feedback)} similar feedback patterns for RAG context")
            return feedback
            
        except Exception as e:
            logger.error(f"Error getting similar feedback: {e}")
            return []
    
    def get_context_quality_score(self, draft: str, embedding_func) -> Dict[str, float]:
        """
        Calculate quality metrics for RAG context retrieval
        
        Args:
            draft: Input SOP draft text
            embedding_func: Function to generate embeddings
            
        Returns:
            Dictionary with quality metrics
        """
        try:
            query_embedding = embedding_func(draft)
            
            # Get all similar content
            all_similar = self.search_similar(
                query_embedding=query_embedding,
                limit=10,
                similarity_threshold=0.1
            )
            
            if not all_similar:
                return {'coverage': 0.0, 'avg_similarity': 0.0, 'diversity': 0.0}
            
            # Calculate metrics
            similarities = [item['similarity'] for item in all_similar]
            avg_similarity = np.mean(similarities)
            max_similarity = max(similarities)
            
            # Diversity: how spread out the similarities are
            similarity_std = np.std(similarities) if len(similarities) > 1 else 0.0
            diversity = min(1.0, similarity_std * 2)  # Normalize to 0-1
            
            # Coverage: how well we can find relevant content
            coverage = min(1.0, len([s for s in similarities if s > 0.3]) / 5)
            
            return {
                'coverage': coverage,
                'avg_similarity': avg_similarity,
                'max_similarity': max_similarity,
                'diversity': diversity,
                'total_candidates': len(all_similar)
            }
            
        except Exception as e:
            logger.error(f"Error calculating context quality: {e}")
            return {'coverage': 0.0, 'avg_similarity': 0.0, 'diversity': 0.0}
