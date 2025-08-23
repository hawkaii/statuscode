#!/usr/bin/env python3
"""
Simple test script to verify Gemini API key works
"""
import os
import google.generativeai as genai

# Load API key from .env
api_key = "AIzaSyCsiK17FBgViXEmf16SE8B6jwZLze34GdA"

print(f"Testing API key: {api_key[:10]}...")

try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel('gemini-pro')
    
    response = model.generate_content("Hello, can you say hi back?")
    print("SUCCESS: Key works!")
    print(f"Response: {response.text}")
    
except Exception as e:
    print(f"ERROR: Key failed - {e}")
    print("This confirms the key is invalid or has restrictions")