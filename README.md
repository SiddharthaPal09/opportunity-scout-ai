# Opportunity Scout

Opportunity intelligence platform that helps students and professionals discover hackathons, internships, scholarships, workshops, conferences, competitions, and fellowships.

## Multi-Agent Architecture

1. **Discovery Agent** — Retrieves opportunities from local dataset
2. **Profile Analysis Agent** — Analyzes skills, interests, career goals
3. **Matching Agent** — Computes compatibility scores (0-100)
4. **Recommendation Agent** — Ranks opportunities with Gemini AI insights
5. **Notification Agent** — Generates deadline alerts and daily summaries

## Setup

```bash
npm install
cp .env.example .env
# Add your Gemini API key to .env
npm run dev
```

## Environment Variables

```
VITE_GEMINI_API_KEY=YOUR_KEY
```

The platform works with local fallbacks when no API key is configured.

## Deploy to Vercel

```bash
npm run build
```

Set `VITE_GEMINI_API_KEY` in Vercel environment variables.

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Router
- Google Generative AI (`@google/generative-ai`)
