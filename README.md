# Advantix AI Builders

Autonomous Developer • Designer • Programmer • Architect • Error Fixer • Deployment Engine

Full-stack prototype with Vite React frontend and Express backend.

## Features

- Prompt-to-app God Mode generation through backend API
- Project Memory API
- Plugin toggle API
- Backend-provided file explorer data
- Suggestions to build
- Skills panel
- Plugin Tools panel
- Command Center workspace
- Live Preview, Code, File Explorer, Terminal, and Plugins tabs
- Vite preview host fix with allowedHosts: true

## Run full stack locally

```bash
npm install
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:4000
Health: http://localhost:4000/api/health

## Production build

```bash
npm run build
```

## API endpoints

- GET /api/health
- POST /api/generate
- GET /api/generate/:jobId
- GET /api/project/:projectId/memory
- PATCH /api/project/:projectId/memory
- GET /api/project/:projectId/plugins
- POST /api/project/:projectId/plugins/:pluginId/toggle
- GET /api/project/:projectId/file-tree
