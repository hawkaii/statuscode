"""
Embedding service for SOP RAG system
Uses sentence-transformers for high-quality text embeddings
"""

import os
import numpy as np
from sentence_transformers import SentenceTransformer
from typing import List, Union
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """
        Initialize embedding service with sentence transformer model
        
        Args:
            model_name: Name of the sentence transformer model to use
                       Default: all-MiniLM-L6-v2 (384 dimensions, good balance of speed/quality)
        """
        self.model_name = model_name
        self.model = None
        self.embedding_dim = None
        self._load_model()
    
    def _load_model(self):
        """Load the sentence transformer model"""
        try:
            logger.info(f"Loading embedding model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            
            # Test embedding to get dimensions
            test_embedding = self.model.encode("test")
            self.embedding_dim = len(test_embedding)
            logger.info(f"Model loaded successfully. Embedding dimension: {self.embedding_dim}")
            
        except Exception as e:
            logger.error(f"Failed to load embedding model: {e}")
            raise
    
    def encode(self, texts: Union[str, List[str]], normalize: bool = True) -> Union[List[float], List[List[float]]]:
        """
        Generate embeddings for text(s)
        
        Args:
            texts: Single text string or list of texts
            normalize: Whether to normalize embeddings (recommended for cosine similarity)
            
        Returns:
            Single embedding (list of floats) or list of embeddings
        """
        if self.model is None:
            raise RuntimeError("Embedding model not loaded")
        
        try:
            # Generate embeddings
            embeddings = self.model.encode(texts, normalize_embeddings=normalize)
            
            # Convert to list format for database storage
            if isinstance(texts, str):
                return embeddings.tolist()
            else:
                return [emb.tolist() for emb in embeddings]
                
        except Exception as e:
            logger.error(f"Failed to generate embeddings: {e}")
            raise
    
    def get_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            
        Returns:
            Cosine similarity score between -1 and 1
        """
        try:
            vec1 = np.array(embedding1)
            vec2 = np.array(embedding2)
            
            # Calculate cosine similarity
            dot_product = np.dot(vec1, vec2)
            norm1 = np.linalg.norm(vec1)
            norm2 = np.linalg.norm(vec2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
                
            similarity = dot_product / (norm1 * norm2)
            return float(similarity)
            
        except Exception as e:
            logger.error(f"Failed to calculate similarity: {e}")
            return 0.0
    
    def get_embedding_dimension(self) -> int:
        """Get the dimension of embeddings produced by this model"""
        return self.embedding_dim
    
    def batch_encode(self, texts: List[str], batch_size: int = 32, normalize: bool = True) -> List[List[float]]:
        """
        Generate embeddings for large batches of texts efficiently
        
        Args:
            texts: List of text strings
            batch_size: Number of texts to process at once
            normalize: Whether to normalize embeddings
            
        Returns:
            List of embeddings
        """
        if self.model is None:
            raise RuntimeError("Embedding model not loaded")
        
        try:
            all_embeddings = []
            
            for i in range(0, len(texts), batch_size):
                batch_texts = texts[i:i + batch_size]
                batch_embeddings = self.model.encode(batch_texts, normalize_embeddings=normalize)
                all_embeddings.extend([emb.tolist() for emb in batch_embeddings])
                
                logger.info(f"Processed batch {i//batch_size + 1}/{(len(texts) + batch_size - 1)//batch_size}")
            
            return all_embeddings
            
        except Exception as e:
            logger.error(f"Failed to generate batch embeddings: {e}")
            raise

# Global embedding service instance
_embedding_service = None

def get_embedding_service() -> EmbeddingService:
    """Get global embedding service instance (singleton pattern)"""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = EmbeddingService()
    return _embedding_service

def get_embedding(text: str) -> List[float]:
    """
    Convenience function to get embedding for a single text
    
    Args:
        text: Input text string
        
    Returns:
        Embedding vector as list of floats
    """
    service = get_embedding_service()
    return service.encode(text)

def get_embeddings(texts: List[str]) -> List[List[float]]:
    """
    Convenience function to get embeddings for multiple texts
    
    Args:
        texts: List of input text strings
        
    Returns:
        List of embedding vectors
    """
    service = get_embedding_service()
    return service.encode(texts)