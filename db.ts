import { nanoid } from 'nanoid'

export type GenerationStatus = 'queued' | 'running' | 'success' | 'failed'

export type GenerationJob = {
  id: string
  projectId: string
  prompt: string
  suggestionId: string
  status: GenerationStatus
  logs: string[]
  previewState: {
    title: string
    summary: string
    version: number
  }
  createdAt: string
  updatedAt: string
}

export type ProjectMemory = {
  id: string
  name: string
  brand: string
  currentSuggestionId: string
  prompt: string
  buildVersion: number
  components: string[]
  pages: string[]
  database: string[]
  plugins: Record<string, 'connected' | 'available' | 'disabled'>
  history: string[]
  updatedAt: string
}

const now = () => new Date().toISOString()

const defaultProject: ProjectMemory = {
  id: 'default',
  name: 'Advantix AI Builders Workspace',
  brand: 'Advantix AI Builders',
  currentSuggestionId: 'crm',
  prompt: 'Build a CRM dashboard with pipeline stages, lead scoring, revenue forecasts, and team activity.',
  buildVersion: 1,
  components: ['CommandCenter', 'AIChat', 'BuilderStudio', 'LivePreview', 'FileExplorer', 'Terminal', 'DeploymentEngine'],
  pages: ['Dashboard', 'AI Chat', 'Builder Studio', 'Live Preview', 'Analytics', 'Deployment'],
  database: ['projects', 'generation_jobs', 'project_memory', 'plugins', 'deployments', 'audit_logs'],
  plugins: {
    supabase: 'connected',
    stripe: 'available',
    clerk: 'available',
    openai: 'connected',
    resend: 'available',
    github: 'connected',
    vercel: 'available',
    analytics: 'available',
    database: 'disabled',
    storage: 'available',
  },
  history: ['Workspace initialized', 'God Mode command center created'],
  updatedAt: now(),
}

const projects = new Map<string, ProjectMemory>([[defaultProject.id, defaultProject]])
const jobs = new Map<string, GenerationJob>()

export function getProject(projectId = 'default') {
  return projects.get(projectId) ?? defaultProject
}

export function updateProject(projectId: string, patch: Partial<ProjectMemory>) {
  const existing = getProject(projectId)
  const updated: ProjectMemory = {
    ...existing,
    ...patch,
    updatedAt: now(),
  }
  projects.set(projectId, updated)
  return updated
}

export function listPlugins(projectId = 'default') {
  return getProject(projectId).plugins
}

export function togglePlugin(projectId: string, pluginId: string) {
  const project = getProject(projectId)
  const current = project.plugins[pluginId]
  if (!current || current === 'disabled') return project
  const next = current === 'connected' ? 'available' : 'connected'
  return updateProject(projectId, {
    plugins: { ...project.plugins, [pluginId]: next },
    history: [`Plugin ${pluginId} changed to ${next}`, ...project.history].slice(0, 25),
  })
}

export function createGenerationJob(input: { projectId?: string; prompt: string; suggestionId: string; title: string }) {
  const projectId = input.projectId ?? 'default'
  const project = getProject(projectId)
  const version = project.buildVersion + 1
  const logs = [
    '$ advantix build --mode god --target production',
    `[Prompt] ${input.prompt}`,
    '[Prompt Router] Request received and classified as full app generation',
    '[Architect AI] Creating system blueprint, data model, API map, and scaling plan',
    '[Designer AI] Generating design system, typography, responsive layout, and dark mode',
    '[Programmer AI] Building routes, components, state flows, services, and mock APIs',
    '[Error Fixer] Running dependency repair, TypeScript checks, accessibility scan, and rollback plan',
    '[QA Agent] Validating preview, file explorer, terminal logs, and plugin configuration',
    '[Deployment Engine] Preparing export bundle, preview environment, and production checklist',
    '[God Mode] Success: prototype generated and ready to preview, optimize, deploy, and scale',
  ]

  const job: GenerationJob = {
    id: nanoid(),
    projectId,
    prompt: input.prompt,
    suggestionId: input.suggestionId,
    status: 'success',
    logs,
    previewState: {
      title: `${input.title} ready`,
      summary: 'Preview, code, file memory, terminal logs, and deployment checklist updated by God Mode.',
      version,
    },
    createdAt: now(),
    updatedAt: now(),
  }
  jobs.set(job.id, job)

  updateProject(projectId, {
    currentSuggestionId: input.suggestionId,
    prompt: input.prompt,
    buildVersion: version,
    history: [`Generated ${input.title} as build v${version}`, ...project.history].slice(0, 25),
  })

  return job
}

export function getGenerationJob(jobId: string) {
  return jobs.get(jobId)
}

export function listGenerationJobs(projectId = 'default') {
  return [...jobs.values()].filter((job) => job.projectId === projectId)
}
