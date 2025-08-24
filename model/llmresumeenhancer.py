import json
import os
from groq import Groq

# Initialize Groq client (fetch API key from environment variable GROQ_API_KEY)
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def enhance_resume(raw_resume_api: dict, resume_analyser_api: dict) -> dict:
    """
    Takes Raw Resume API output and Resume Analyzer API output (with llm_insights),
    then returns an enhanced resume JSON of 700–800 words using Groq LLM.
    """

    # Extract fields
    raw_resume_text = raw_resume_api.get("resume_text", "")
    llm_insights = resume_analyser_api.get("llm_insights", "")

    # Build the compact prompt
    prompt = f"""
    Use the following inputs:

    Raw Resume API:
    {{
      "filename": "{raw_resume_api.get("filename", "document.pdf")}",
      "resume_text": "{raw_resume_text}"
    }}

    Resume Analyser API (llm_insights):
    {llm_insights}

    Task: Enhance the raw resume using the improvement guidelines in llm_insights.
    The final resume must:
    - Be professional and polished.
    - Expand and refine descriptions while staying truthful to the original.
    - Be clear, concise, well-structured.
    - Word length: 700–800 words.
    - Dont Include Dashes, Stars or any MD file Structures. Keep it Simple.

    Return only this JSON:
    {{
      "resume_text": "<enhanced resume text here, 700–800 words>"
    }}
    """

    # Call Groq LLM
    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",  # You can switch to llama3-70b or other available models
        messages=[
            {"role": "system", "content": "You are a professional resume writer."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    # Extract response text
    output_text = response.choices[0].message.content.strip()

    # Try parsing JSON
    try:
        enhanced_resume = json.loads(output_text)
    except json.JSONDecodeError:
        enhanced_resume = {"resume_text": output_text}

    return enhanced_resume


# ----------------- Example Usage -----------------

if __name__ == "__main__":
    
    with open("LLMEnhancer/raw_resume.json", "r") as f:
        raw_resume_api = json.load(f)

    with open("LLMEnhancer/resume.json", "r") as f:
        resume_analyser_api = json.load(f)

    result = enhance_resume(raw_resume_api, resume_analyser_api)
    result["resume_text"] = result["resume_text"].lower()
    print(json.dumps(result, indent=2))
    with open("LLMEnhancer/enhanced_resume.json", "w") as out_f:
        json.dump(result, out_f, indent=2)
