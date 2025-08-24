# UniCompass AI Suite

UniCompass is a smart, multi-agent platform that acts as a personal AI counselor for students applying to foreign universities. It orchestrates specialized agents for university prediction, resume optimization, essay crafting, and deadline tracking to provide a centralized and intelligent application assistant.

This project was built for a hackathon, following the detailed project plan in `plan.md`.

## System Architecture

The system follows a microservice-based, multi-agent architecture. The `OrchestratorAgent` serves the user interface and communicates with the specialized agents via REST APIs.

```
+------------------+      (User Interaction)
|   Browser / UI   |
+------------------+
         |
         v
+------------------+      (Main Server @ port 5000)
| OrchestratorAgent|
|  (Flask App)     |
+------------------+
         |
         |---- A2A Protocol ----> +-------------------+ (Microservice @ port 5002)
         |                       |  PredictionAgent  |
         |                       +-------------------+
         |
         |---- A2A Protocol ----> +-------------------+ (Microservice @ port 5001)
         |                       |    ResumeAgent    |
         |                       +-------------------+
         |
         |---- MCP Protocol ------> +-------------------+ (External Tool)
                                 |    Gemini API     |
                                 +-------------------+
```

## Persistent History, User Dashboard & Deadline Tracker

UniCompass now supports persistent storage of agent results (resume analysis, SOP drafts, conversations) and personalized tracking of application deadlines and important dates. Users can revisit previous outcomes and stay on top of upcoming deadlines via their dashboard. All data is securely stored and access-controlled using JWT authentication.

### Database Schema
- `users`: id, email, name, created_at
- `agent_results`: id, user_id, agent_type, result_type, result_data (JSONB), created_at
- `conversations`: id, user_id, agent_id, messages (JSONB), created_at
- `sop_drafts`: id, user_id, draft_text, status, created_at, updated_at
- `important_dates`: id, user_id, university_name, program_name, date_type, date, notes, reminder_sent, created_at

### API Endpoints
- `POST /api/results` (save new agent result)
- `GET /api/results?user_id=...` (list previous results)
- `GET /api/conversations?user_id=...` (list previous conversations)
- `POST /api/sop_drafts` (save new SOP draft)
- `GET /api/sop_drafts?user_id=...` (list previous SOP drafts)
- `POST /api/important_dates` (add a new important date)
- `GET /api/important_dates?user_id=...` (list all dates for a user)
- `GET /api/important_dates/upcoming?user_id=...` (list only upcoming dates)
- `DELETE /api/important_dates/:id` (remove a date)
- `POST /api/important_dates/remind` (trigger/send reminders)

All endpoints require JWT Bearer authentication. Users only access their own data.

## How to Run

This project requires Python and Flask. It is designed to be run locally with each agent running in a separate terminal. You will also need a PostgreSQL database for persistent history and deadline tracking.

### 1. Install Dependencies

Install the required Python libraries for all agents:

```bash
pip install Flask requests google-generativeai psycopg2-binary
```

*(Note: The Gemini API is mocked in this version, so the `google-generativeai` library is not strictly required to run the demo.)*

### 2. Set Up the Database

Install PostgreSQL and create a database named `unicompass`.

```bash
# On Ubuntu
sudo apt-get install postgresql
sudo -u postgres createdb unicompass
```

Set the following environment variables in a `.env` file:

```
DATABASE_URL=postgresql://username:password@localhost/unicompass
JWT_SECRET=your_jwt_secret
```

### 3. Run the Agents

Open three separate terminal windows.

**Terminal 1: Run the ResumeAgent**

```bash
cd resume_agent
python app.py
```
*This will start the ResumeAgent on `http://localhost:5001`.*

**Terminal 2: Run the PredictionAgent**

```bash
cd prediction_agent
python app.py
```
*This will start the PredictionAgent on `http://localhost:5002`.*

**Terminal 3: Run the OrchestratorAgent**

```bash
cd orchestrator
python app.py
```
*This will start the main application on `http://localhost:5000`.*

### 4. Access the Application

Open your web browser and navigate to:

**http://localhost:5000**

You can now use the UniCompass AI Suite to predict universities, analyze your resume, craft a Statement of Purpose, revisit previous results, and track all your important application deadlines in your dashboard.

## API Contracts

The agents communicate using the following simple REST API contracts.

### A. PredictionAgent

*   **Endpoint:** `POST /predict_universities`
*   **Request Body:**
    ```json
    {
        "gre": 325,
        "toefl": 112,
        "gpa": 3.8
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
        "universities": [
            "University Name 1",
            "University Name 2"
        ]
    }
    ```

### B. ResumeAgent

*   **Endpoint:** `POST /analyze_resume`
*   **Request Body:**
    ```json
    {
        "resume_text": "Full text of the resume..."
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
        "ats_score": 92,
        "feedback": [
            "Actionable feedback point 1.",
            "Actionable feedback point 2."
        ]
    }
    ```

### C. Important Dates Tracker

*   **Endpoint:** `POST /api/important_dates`
*   **Request Body:**
    ```json
    {
        "university_name": "MIT",
        "program_name": "MS Computer Science",
        "date_type": "application_deadline",
        "date": "2025-12-01T23:59:00Z",
        "notes": "Early action deadline"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
        "id": 1,
        "user_id": 123,
        "university_name": "MIT",
        "program_name": "MS Computer Science",
        "date_type": "application_deadline",
        "date": "2025-12-01T23:59:00Z",
        "notes": "Early action deadline",
        "reminder_sent": false,
        "created_at": "2025-08-22T10:00:00Z"
    }
    ```

## Authentication

All API endpoints require JWT Bearer authentication. See `architecture.md` for details on how JWTs are issued and validated.
