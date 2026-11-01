# GitGhost AI

**Your Spooky Smart Open-Source Contribution Companion**

GitGhost AI turns an open-source GitHub issue into an approachable explanation, a learning-oriented implementation roadmap, useful Git commands, and a proposed pull request draft. The React app keeps recent analysis and checklist progress in your browser; the Express server keeps your Gemini API key private.

## Requirements

- Node.js 20.19 or newer (or 22.12 or newer) and npm
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)
- Optional: a GitHub personal access token to increase GitHub API rate limits

## Setup

1. Configure and start the API:

   ```powershell
   cd gitghost-ai/server
   Copy-Item .env.example .env
   # Add your Gemini API key to server/.env
   npm install
   npm start
   ```

2. In another terminal, start the frontend:

   ```powershell
   cd gitghost-ai/client
   npm install
   npm run dev
   ```

3. Open [http://localhost:5173](http://localhost:5173).

The Vite development server proxies `/api` requests to `http://localhost:5000`. To use another API origin, set `VITE_API_URL` in `client/.env` (for example, `VITE_API_URL=https://api.example.com/api`).

## Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | For AI analysis | — | Secret Google AI Studio API key. Keep it in `server/.env`. |
| `GEMINI_MODEL` | No | `gemini-1.5-flash` | Gemini model used for issue analysis. |
| `GITHUB_TOKEN` | No | — | GitHub token for higher REST API rate limits. |
| `PORT` | No | `5000` | Express server port. |

## Features

- Analyze a GitHub issue URL or a pasted issue description.
- Ask the AI mentor follow-up questions about the issue and its roadmap in English or Hinglish.
- Choose English or Hinglish explanations.
- Learn Git fundamentals with twelve short lessons and a contribution workflow.
- Track roadmap checklists in browser localStorage.
- Copy suggested commands and a Markdown pull request draft.
- Try the included demo issue without a GitHub account or Gemini key.

## API

- `GET /api/health` — server health and timestamp.
- `GET /api/github/issue?url=<issue-url>` — fetches public issue details from GitHub.
- `POST /api/analyze` — creates a structured analysis using Gemini.
- `POST /api/chat` — answers bounded, issue-aware mentor chat messages using Gemini.

## Build

```powershell
cd gitghost-ai/client
npm run build
```

## Tests and checks

```powershell
cd gitghost-ai/server
npm test

cd ..\client
npm run lint
npm run build
```

GitGhost AI's guidance is a starting point, not a substitute for reading the issue, implementing the change, and running the repository's tests yourself.
