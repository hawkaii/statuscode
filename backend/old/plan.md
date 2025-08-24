Project Plan: UniCompass AI Suite

1. Vision & Elevator Pitch

    Project Name: UniCompass AI Suite

    Vision: The Collaborative Admissions Counsellor
    To create an end-to-end platform that leverages a suite of collaborating AI agents to demystify and streamline the foreign university application process for students.

    Elevator Pitch: "Applying to foreign universities is a complex and fragmented process. UniCompass is a smart, multi-agent platform that acts as a personal AI counselor, orchestrating specialized agents for university prediction, resume optimization, essay crafting, and deadline tracking to provide students with a centralized, streamlined, and intelligent application assistant."

2. Team Roles & Responsibilities

    You (Project Lead & Orchestrator):

        Project: The main OrchestratorAgent application (Flask Server @ Port 5000).

        Responsibilities:
            - Build the user-facing web interface.
            - Implement the SOPCraftingAgent using the Google Gemini API (MCP).
            - Integrate all specialist agents by making API calls to your teammates' services (A2A).
            - Lead the final presentation and demo.
            - Implement the important dates tracker and dashboard integration.

    Teammate A (ResumeAgent):

        Project: ResumeAgent Microservice (Flask Server @ Port 5001).

        Responsibilities:
            - Develop the logic for parsing resumes, providing feedback, and calculating an ATS score.
            - Expose this functionality via a simple Flask API endpoint.

    Teammate B (PredictionAgent):

        Project: PredictionAgent Microservice (Flask Server @ Port 5002).

        Responsibilities:
            - Implement the machine learning model that predicts university suitability based on student scores.
            - Wrap the model in a Flask API that accepts scores and returns predictions.

3. Core Architectural Overview

We will build a distributed multi-agent system where three separate Flask applications communicate over local HTTP. This simulates a real-world microservice architecture.

    ADK Principle: Each project will have a core logic class (e.g., ResumeAnalyzer, PredictionModel) representing the "agent's brain."
    A2A Protocol: Simple REST API calls between your Orchestrator and your teammates' services.
    MCP Protocol: A dedicated module in your Orchestrator project for making external calls to the Google Gemini API.

+------------------+      (User Interaction)
|   Browser / UI   |
+------------------+
         |
         v
+------------------+      (Your Project: Main Server @ port 5000)
| OrchestratorAgent|
|  (Flask App)     |
+------------------+
         |
         |---- A2A Protocol ----> +-------------------+ (Teammate B's Project @ port 5002)
         |                       |  PredictionAgent  |
         |                       |  (Microservice)   |
         |                       +-------------------+
         |
         |---- A2A Protocol ----> +-------------------+ (Teammate A's Project @ port 5001)
         |                       |    ResumeAgent    |
         |                       |   (Microservice)  |
         |                       +-------------------+
         |
         |---- MCP Protocol ------> +-------------------+ (External Tool)
                                 |    Gemini API     |
                                 +-------------------+

4. Technology Stack

    Backend: Python, Flask (for all three agents).
    ADK Principle: Each agent has a core logic class (e.g., ResumeAnalyzer, PredictionModel).
    Frontend: HTML, Tailwind CSS, JavaScript (served by your Orchestrator).
    Communication: HTTP REST APIs (JSON), A2A protocol for agent-to-agent calls, MCP protocol for external Gemini API calls.
    AI Model: Gemini API (for the SOP Crafter).
    Deployment (for hackathon): Run locally on specified ports. For a more advanced setup, consider using ngrok to expose local servers to the internet for easy integration.
    Version Control: Git & GitHub.

5. Phase 1: Setup & API Contracts (First 2-3 Hours)

Goal: Establish a solid foundation to enable parallel work. This is the most critical phase.

    [ALL] Task 1: Create a GitHub repository. Everyone clones the repo.

    [YOU] Task 2: Create the basic folder structure (/orchestrator, /resume_agent, /prediction_agent). You will commit the initial orchestrator_app.py you already have.

    [ALL] Task 3: Finalize API Contracts. This is non-negotiable. Agree on the exact JSON structure for requests and responses.

CRITICAL: The API Contract (To Be Finalized in Hour 1)
All team members must agree on these exact request/response formats.

Service         Port   Endpoint         Request Body (JSON)                                 Response Body (JSON)
---------------------------------------------------------------------------------------------------------------
PredictionAgent 5001   POST /predict    {"gre": 320, "gpa": 3.8, "toefl": 110}             {"predictions": [{"name": "...", "chance": "Target"}, ...]}
ResumeAgent     5002   POST /analyze    {"resume_text": "..."}                              {"ats_score": 92, "feedback": ["...", "..."]}

(For reference, previous contract:)
A. PredictionAgent
    Endpoint: POST /predict_universities
    Request Body:
    {
        "gre": 325,
        "toefl": 112,
        "gpa": 3.8
    }
    Success Response (200 OK):
    {
        "universities": [
            "University Name 1",
            "University Name 2",
            "University Name 3"
        ]
    }
B. ResumeAgent
    Endpoint: POST /analyze_resume
    Request Body:
    {
        "resume_text": "Full text of the resume..."
    }
    Success Response (200 OK):
    {
        "ats_score": 92,
        "feedback": [
            "Actionable feedback point 1.",
            "Actionable feedback point 2."
        ]
    }

Note: Use context7 for up-to-date documentation and best practices for ADK, A2A, and MCP protocols.

6. Phase 2: Core Logic Development (Next 10-12 Hours)

Goal: Each team member builds the core functionality of their assigned agent. Work in parallel.

    [YOU] OrchestratorAgent:

        Keep the mocked agent responses in your code for now.

        Refine the UI. Make it look polished and intuitive.

        Perfect the logic for calling the Gemini API for the SOP Crafter. Add robust error handling.

        Implement the important dates tracker logic and dashboard integration.

    [Teammate A] ResumeAgent:

        Set up a basic Flask server on port 5001.

        Create the /analyze_resume endpoint that accepts the defined JSON.

        Hackathon Logic: The "ATS score" can be heuristic-based. For example:

            Score based on length.

            Score based on the presence of keywords (Python, Java, Project Management).

            Score based on the use of action verbs (Led, Developed, Managed).

        Return the response in the exact format defined in the contract.

    [Teammate B] PredictionAgent:

        Set up a basic Flask server on port 5002.

        Create the /predict_universities endpoint.

        Hackathon Logic: Use a simple rule-based system.

            if gre > 320 and gpa > 3.7: return top-tier universities.

            if gre > 310 and gpa > 3.5: return mid-tier universities.

            Create a predefined list of universities for each tier.

        Return the response in the exact format defined in the contract.

7. Phase 3: Integration & Testing (Next 6-8 Hours)

Goal: Connect the agents and make the system work end-to-end.

    [Teammates A & B] Task 1: Ensure your microservices are running and accessible on your local network.

    [YOU] Task 2: In your orchestrator_app.py, replace the mocked responses with actual requests.post() calls to http://localhost:5001/analyze_resume and http://localhost:5002/predict_universities.

    [ALL] Task 3: Debug together. This is where the API contracts pay off. If an error occurs, you'll know exactly where the communication is failing. Test various inputs and edge cases.

    [YOU] Task 4: Implement user-friendly error handling in the UI. If an agent is offline or returns an error, display a helpful message instead of crashing.

8. Phase 4: Final Polish & Pitch Prep (Last 4-6 Hours)

Goal: Prepare for the final presentation and add finishing touches.

    [YOU] Task 1: Do a final review of the UI. Check for typos, alignment issues, and responsiveness on different screen sizes.

    [ALL] Task 2: Create the presentation slides.

        Slide 1: Title & Team

        Slide 2: The Problem (University admissions are hard).

        Slide 3: Our Solution - UniCompass (A multi-agent system).

        Slide 4: Architecture Diagram (Showcase the technical complexity).

        Slide 5: Live Demo

        Slide 6: Future Work (e.g., adding a ScholarshipAgent, fine-tuning models).

    [ALL] Task 3: Practice the demo flow. The user journey should be smooth:

        Start with the University Predictor.

        Move to the Resume Analyzer.

        Finish with the SOP Crafter.

        Show the deadline tracker and how it helps students stay on top of important dates.

        Explain how the agents are working together behind the scenes.

9. Phase 5: Persistent History, User Dashboard & Deadline Tracker

Goal: Enable users to revisit previous agent results, conversations, and track important dates via a persistent dashboard.

    [ALL] Task 1: Design and implement the database schema for users, agent_results, conversations, sop_drafts, important_dates.

    [ALL] Task 2: Update agent/service APIs to save and query results, drafts, conversations, and important dates.

    [YOU] Task 3: Update the dashboard UI to show user history, upcoming deadlines, and allow managing important dates.

    [ALL] Task 4: Integrate JWT authentication for all endpoints and restrict data access to the authenticated user.

    [ALL] Task 5: Test persistence, access control, and dashboard features.

10. Final Deliverables

    A working, integrated web application.

    A public GitHub repository with clean code and a README.md explaining how to run the project.

    A compelling 3-5 minute presentation and live demo.

    Persistent user history, results, and personalized deadline tracking accessible via the dashboard.
