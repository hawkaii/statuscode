#!/usr/bin/env python3
"""
Initialize embeddings for RAG system
Run this script to populate the database with example SOP content and feedback
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from storage import Storage
from models import init_db

def main():
    # Initialize database
    init_db()

    storage = Storage()

    # Example SOP content for embeddings
    example_sops = [
        "During my undergraduate studies, I led a team of five in developing a mobile app for campus safety. This experience taught me valuable leadership skills and project management.",
        "My passion for research was ignited when I joined the AI lab and contributed to a published paper on natural language processing. This work sparked my interest in machine learning.",
        "As president of the student council, I organized multiple events and managed budgets. This role developed my organizational and communication skills significantly.",
        "Working as a teaching assistant for computer science courses helped me develop strong mentoring abilities and deep understanding of complex technical concepts."
    ]

    example_feedback = [
        "Your leadership experience is strong, but consider adding specific metrics about the impact of your mobile app project.",
        "The research experience is compelling, but you should elaborate on your specific contributions to the published paper.",
        "Student council experience shows good organizational skills, but add details about challenges overcome and lessons learned.",
        "Teaching assistant role demonstrates mentoring ability, but quantify the number of students helped and their outcomes."
    ]

    # Add example SOPs
    for i, sop in enumerate(example_sops):
        # Generate embedding (using the same function as main.py)
        import hashlib
        import struct
        import json

        hash_obj = hashlib.md5(sop.encode())
        hash_bytes = hash_obj.digest()

        embedding = []
        for j in range(0, 16, 4):
            chunk = hash_bytes[j:j+4]
            if len(chunk) < 4:
                chunk += b'\x00' * (4 - len(chunk))
            value = struct.unpack('f', chunk)[0] % 1.0
            embedding.append(value)

        embedding.extend([0.0] * (768 - len(embedding)))

        storage.save_embedding(sop, 'example', embedding)
        print(f"Added example SOP {i+1}")

    # Add example feedback
    for i, feedback in enumerate(example_feedback):
        # Generate embedding
        import hashlib
        import struct
        import json

        hash_obj = hashlib.md5(feedback.encode())
        hash_bytes = hash_obj.digest()

        embedding = []
        for j in range(0, 16, 4):
            chunk = hash_bytes[j:j+4]
            if len(chunk) < 4:
                chunk += b'\x00' * (4 - len(chunk))
            value = struct.unpack('f', chunk)[0] % 1.0
            embedding.append(value)

        embedding.extend([0.0] * (768 - len(embedding)))

        storage.save_embedding(feedback, 'feedback', embedding)
        print(f"Added example feedback {i+1}")

    print("Embeddings initialized successfully!")

if __name__ == "__main__":
    main()