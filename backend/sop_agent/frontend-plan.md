# Frontend Development Plan for UniCompass SOP Agent

## Overview
A Next.js frontend for the UniCompass SOP Agent, designed for modularity, user-centric design, and agentic workflow support. Communicates with the backend via REST API.

## Technology Stack
- **Framework:** Next.js (App Router)
- **UI Components:** Shadcn/UI
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Data Fetching:** React Query or SWR

## Project Structure
See `frontend/` directory for Next.js app layout and components.

## Key Features
- **Authentication:** JWT-based login/signup, token stored in browser
- **SOP Submission:** Form for SOP draft, POST to `/review` endpoint
- **Feedback Display:** Shows feedback and cues for each review
- **History & Examples:** Pages for user history and static examples

## Development Roadmap
1. Project setup: Next.js, Tailwind, Shadcn/UI
2. Authentication flow
3. Core features: SOP submission, feedback, history, examples
4. Styling and UI polish
5. Deployment (Vercel/Netlify)

## Next Steps
- Initialize Next.js project in `frontend/`
- Implement authentication and UI components
- Connect to backend API
