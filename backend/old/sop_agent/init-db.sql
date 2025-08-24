-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the database if it doesn't exist
-- (This is handled by POSTGRES_DB environment variable, but we can add additional setup here)

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE sop_agent TO sop_user;

-- Drop old table if exists
DROP TABLE IF EXISTS sop_embeddings;

-- Create new table with PGVector column
CREATE TABLE sop_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    content_type TEXT NOT NULL,
    embedding vector(768) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
