# GitHub Repository Health Dashboard

Health Score is a derived metric that summarizes repository activity, maintenance quality, and community engagement using GitHub API signals.

It is not an official GitHub metric. It is a heuristic-based decision score designed to help developers quickly evaluate whether a repository appears actively maintained and safe to depend on.

## Setup

1. Clone the repository:

```bash
git clone <repo-url>
cd echorepo
```

2. Install dependencies:

```bash
npm install
```

## Run

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Features

- Search by `owner/repo`
- Fetch GitHub repo metadata, contributors, and recent commits
- Display repository health score with star/fork/issue summary
- Loading and error states for API requests
- User-friendly error handling for invalid input, missing repos, rate limits, and network failures

## Tech Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- Axios for GitHub API integration

## Notes

- The health score is deterministic and based on recent activity, contributor diversity, and issue backlog.
- The app currently uses client-side fetching and local state for the repository analysis flow.
