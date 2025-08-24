#!/usr/bin/env python3

import argparse
import json
import os
import sys
from typing import Any, Dict, List, Tuple


# pip install groq
from groq import Groq


MODEL = "openai/gpt-oss-20b"
MAX_P_INCREASE = 0.20
MIN_P_INCREASE = 0.00


SYSTEM_PROMPT = """You are an academic evaluation assistant.

You will be given two structured inputs:
1) University Recommendation API: a list of items with keys:
   - univName: string
   - p_admit: float in [0.0, 1.0]
2) Resume Analyzer API: a detailed structured analysis of the candidate’s resume.

Task:
For each university in the given order, estimate a p_increase value.
p_increase is the delta to add to p_admit after considering the candidate’s profile.
Return only JSON. No commentary. No markdown. No trailing text.

Evaluation rules for p_increase:
- Consider the following dimensions from the resume:
  Research strength (venues such as Springer, Elsevier, IEEE, top-tier conferences; citations; relevance to the university),
  Projects and implementations (depth, originality, reproducibility, real-world impact, open-source),
  Academic achievements (GPA, rank, awards, scholarships, competitive exams),
  Internships and work experience (role, impact, relevance),
  Extracurriculars and leadership (competitions, hackathons, community, positions of responsibility),
  Skills and certifications (fit to intended program),
  Distinguishing factors (patents, strong recommendations, international exposure).
- If the resume strongly matches what a highly selective university values, use a higher p_increase.
- If the resume adds little signal, use a small or zero p_increase.

Constraints:
- p_increase must be a float in [0.0, 0.2].
- Keep the same order and the same univName values as the input.
- Do not change p_admit.
- Do not invent universities.
- Return a JSON array only, where each element has:
  { "univName": string, "p_admit": float, "p_increase": float }

Be concise and deterministic. If uncertain, choose conservative p_increase values."""

USER_PROMPT_TEMPLATE = """UNIVERSITY_RECOMMENDATIONS_JSON:
{univ_json}

RESUME_ANALYZER_JSON:
{resume_json}

Produce the enriched JSON array as specified. No preface. No explanation.
"""


def _load_json_file(path: str) -> Any:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def _assert_univ_input(univs: Any) -> List[Dict[str, Any]]:
    if not isinstance(univs, list) or not univs:
        raise ValueError("University input must be a non-empty JSON list.")
    cleaned = []
    for i, item in enumerate(univs):
        if not isinstance(item, dict):
            raise ValueError(f"Item {i} is not an object.")
        if "univName" not in item or "p_admit" not in item:
            raise ValueError(f"Item {i} missing required keys 'univName' or 'p_admit'.")
        name = item["univName"]
        p = item["p_admit"]
        if not isinstance(name, str) or not name.strip():
            raise ValueError(f"Item {i} has invalid 'univName'.")
        if not isinstance(p, (int, float)) or p < 0.0 or p > 1.0:
            raise ValueError(f"Item {i} has invalid 'p_admit' (must be float in [0,1]).")
        cleaned.append({"univName": name.strip(), "p_admit": float(p)})
    return cleaned


def _call_groq(system_prompt: str, user_prompt: str, temperature: float = 0.2) -> str:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is not set.")
    client = Groq(api_key=api_key)
    resp = client.chat.completions.create(
        model=MODEL,
        temperature=temperature,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={"type": "json_object"},  # The model will respond with JSON, but we want an array.
    )
    # Some models wrap arrays in an object when response_format is json_object.
    # We will handle both a raw array and an object containing an array.
    return resp.choices[0].message.content


def _try_parse_json_array(text: str) -> Any:
    """
    Accepts either:
      - a raw JSON array
      - an object with a single key mapping to the array
    Returns the array if found.
    """
    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        # Attempt a fallback extraction if the model returned surrounding text.
        # Try to find the first '[' and last ']' to parse as an array.
        start = text.find("[")
        end = text.rfind("]")
        if start != -1 and end != -1 and end > start:
            try:
                data = json.loads(text[start:end + 1])
            except Exception as _:
                raise
        else:
            raise

    if isinstance(data, list):
        return data
    if isinstance(data, dict):
        # Find the first list value
        for v in data.values():
            if isinstance(v, list):
                return v
    raise ValueError("Could not locate a JSON array in the model output.")


def _validate_and_align(
    univs: List[Dict[str, Any]],
    enriched: List[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    """
    Ensures the result matches the input order and names, clamps p_increase, and
    preserves p_admit as-is.
    """
    if len(enriched) != len(univs):
        raise ValueError("Model returned a list of different length.")

    # Map expected names to index
    expected_names = [u["univName"] for u in univs]
    name_to_index = {name: i for i, name in enumerate(expected_names)}

    aligned: List[Dict[str, Any]] = [None] * len(univs)  # type: ignore

    for item in enriched:
        if not isinstance(item, dict):
            raise ValueError("Model returned a non-object item.")
        name = item.get("univName")
        p_admit_model = item.get("p_admit")
        p_inc = item.get("p_increase")

        if not isinstance(name, str) or name not in name_to_index:
            raise ValueError(f"Unexpected or missing univName in model output: {name}")

        idx = name_to_index[name]
        original = univs[idx]

        # p_admit must match original (or at least not contradict)
        if not isinstance(p_admit_model, (int, float)):
            raise ValueError(f"Item for {name} has invalid p_admit.")
        if abs(float(p_admit_model) - float(original["p_admit"])) > 1e-6:
            # Keep original as source of truth
            p_admit_final = float(original["p_admit"])
        else:
            p_admit_final = float(p_admit_model)

        # Validate and clamp p_increase
        if not isinstance(p_inc, (int, float)):
            raise ValueError(f"Item for {name} missing or invalid p_increase.")
        p_inc = float(p_inc)
        if p_inc < MIN_P_INCREASE:
            p_inc = MIN_P_INCREASE
        if p_inc > MAX_P_INCREASE:
            p_inc = MAX_P_INCREASE

        aligned[idx] = {
            "univName": name,
            "p_admit": p_admit_final,
            "p_increase": p_inc,
        }

    # mypy safety
    return [x for x in aligned if x is not None]


def build_user_prompt(univ_payload: List[Dict[str, Any]], resume_payload: Any) -> str:
    univ_json = json.dumps(univ_payload, ensure_ascii=False)
    resume_json = json.dumps(resume_payload, ensure_ascii=False)
    return USER_PROMPT_TEMPLATE.format(univ_json=univ_json, resume_json=resume_json)


def compute_adjusted_recommendations(
    univ_payload: List[Dict[str, Any]],
    resume_payload: Any,
    temperature: float = 0.2,
) -> List[Dict[str, Any]]:
    user_prompt = build_user_prompt(univ_payload, resume_payload)
    raw = _call_groq(SYSTEM_PROMPT, user_prompt, temperature=temperature)
    parsed = _try_parse_json_array(raw)
    result = _validate_and_align(univ_payload, parsed)
    return result


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(description="Compute p_increase for universities using Groq LLM.")
    parser.add_argument("--univ", required=True, help="Path to Top-10 University API JSON file.")
    parser.add_argument("--resume", required=True, help="Path to Resume Analyzer API JSON file.")
    parser.add_argument("--temperature", type=float, default=0.2, help="Sampling temperature.")
    args = parser.parse_args(argv)

    try:
        univ_payload = _assert_univ_input(_load_json_file(args.univ))
        resume_payload = _load_json_file(args.resume)
        enriched = compute_adjusted_recommendations(univ_payload, resume_payload, temperature=args.temperature)
        json.dump(enriched, sys.stdout, ensure_ascii=False, indent=2)
        print()
        return 0
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
