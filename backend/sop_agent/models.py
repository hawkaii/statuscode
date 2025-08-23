from datetime import datetime
from sqlalchemy import Column, String, DateTime, Integer, Text, create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from pgvector.sqlalchemy import Vector
import os

Base = declarative_base()

class SOPHistory(Base):
    __tablename__ = 'sop_history'
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=False)
    draft = Column(Text, nullable=False)
    feedback = Column(Text)
    cues = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

class SOPEmbedding(Base):
    __tablename__ = 'sop_embeddings'
    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(Text, nullable=False)
    content_type = Column(String, nullable=False)  # 'draft', 'feedback', 'example'
    embedding = Column(Vector(384), nullable=False)  # Store as pgvector (all-MiniLM-L6-v2 dimensions)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://user:password@localhost/sop_agent')

# For pgvector support, we'll use raw SQL for vector operations
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

def init_db():
    """Initialize database and enable pgvector extension"""
    Base.metadata.create_all(bind=engine)

    # Enable pgvector extension if using PostgreSQL
    if 'postgresql' in DATABASE_URL:
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
            conn.commit()
