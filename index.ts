import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { z } from 'zod'
import {
  createGenerationJob,
  getGenerationJob,
  getProject,
  listGenerationJobs,
  listPlugins,
  togglePlugin,
  updateProject,
} from './db'

dotenv.config()

const app = express()
const port = Number(process.env.API_PORT ?? 4000)

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? true }))
app.use(express.json({ limit: '1mb' }))

const generationSchema = z.object({
  projectId: z.string().optional(),
  prompt: z.string().min(1),
  suggestionId: z.string().min(1),
  title: z.string().min(1),
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'Advantix AI Builders API', mode: 'GOD_MODE' })
})

app.get('/api/project/:projectId/memory', (req, res) => {
  res.json(getProject(req.params.projectId))
})

app.patch('/api/project/:projectId/memory', (req, res) => {
  res.json(updateProject(req.params.projectId, req.body))
})

app.get('/api/project/:projectId/plugins', (req, res) => {
  res.json(listPlugins(req.params.projectId))
})

app.post('/api/project/:projectId/plugins/:pluginId/toggle', (req, res) => {
  res.json(togglePlugin(req.params.projectId, req.params.pluginId))
})

app.post('/api/generate', (req, res) => {
  const parsed = generationSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid generation request', details: parsed.error.flatten() })
    return
  }
  const job = createGenerationJob(parsed.data)
  res.status(201).json(job)
})

app.get('/api/generate/:jobId', (req, res) => {
  const job = getGenerationJob(req.params.jobId)
  if (!job) {
    res.status(404).json({ error: 'Generation job not found' })
    return
  }
  res.json(job)
})

app.get('/api/project/:projectId/generations', (req, res) => {
  res.json(listGenerationJobs(req.params.projectId))
})

app.get('/api/project/:projectId/file-tree', (req, res) => {
  const project = getProject(req.params.projectId)
  res.json({
    projectId: project.id,
    tree: [
      `advantix-ai-builders/ # Project Memory v${project.buildVersion}`,
      '├── command-center/',
      ...project.pages.map((page) => `│   ├── ${page.toLowerCase().replace(/\W+/g, '-')}.tsx`),
      '├── ai-core/',
      '│   ├── architect-ai.ts',
      '│   ├── designer-ai.ts',
      '│   ├── programmer-ai.ts',
      '│   ├── error-fixer.ts',
      '│   ├── qa-agent.ts',
      '│   └── devops-agent.ts',
      '├── database/',
      ...project.database.map((table) => `│   ├── ${table}.schema.ts`),
      '├── plugins/',
      ...Object.entries(project.plugins).map(([id, status]) => `│   ├── ${id}.plugin.ts # ${status}`),
      '└── memory/',
      '    ├── components.memory.json',
      '    ├── design.memory.json',
      '    ├── version-history.json',
      '    └── restore-points.json',
    ],
  })
})

app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(port, '0.0.0.0', () => {
  console.log(`Advantix AI Builders API running on http://localhost:${port}`)
})
