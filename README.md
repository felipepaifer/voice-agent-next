# Aloware Admin UI (Next.js)

Frontend repository for configuring and testing the voice agent experience.

## Setup (Under 5 Minutes)

1. Create env file:
   ```bash
   cp .env.example .env
   ```
2. Fill backend URL and admin API key:
   - `NEXT_PUBLIC_BACKEND_API_BASE_URL`
   - `NEXT_PUBLIC_ADMIN_API_KEY`
3. Run:
   ```bash
   npm install
   npm run dev
   ```

UI runs at `http://localhost:3000`.

## Local Auth Note

This project is intentionally local-first and single-user for the take-home.  
`NEXT_PUBLIC_ADMIN_API_KEY` is sent from the browser as a convenience gate for local development only. It is **not** production-grade authentication.

## What This UI Does

- Start/stop voice sessions with the backend agent
- Edit agent instructions/system prompt
- Edit persona (name, greeting)
- Manage available tools
- Connect/disconnect Google Calendar for the current local user

## Tool Management Behavior

The UI supports grouped tool orchestration:

- `Schedule Viewing` is the parent tool
- Scheduling sub-tools are shown only when enabled:
  - `Check Availability`
  - `Create Google Calendar Event`
  - `Send SMS Confirmation`

When `Schedule Viewing` is turned off, sub-tools are automatically disabled.

## Voice UX Features

- Reactive speaking orb based on remote active speaker events
- Start/end call sound cues
- Session-safe unique room/identity generation

## Notes

- This repo is intentionally single-user and local-first for the engineering test.
- Backend repository contains the Python LiveKit agent and service logic.
