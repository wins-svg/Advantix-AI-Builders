import type { Plugin } from './types'

export type GenerationJob = {
  id: string
  projectId: string
  prompt: string
  suggestionId: string
  status: 'queued' | 'running' | 'success' | 'failed'
  logs: string[]
  previewState: {
    title: string
    summary: string
    version: number
  }
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
  plugins: Record<string, Plugin['status']>
  history: string[]
  updatedAt: string
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers ?? {}) },
    ...options,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `Request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const api = {
  getMemory(projectId = 'default') {
    return request<ProjectMemory>(`/api/project/${projectId}/memory`)
  },
  generate(input: { projectId?: string; prompt: string; suggestionId: string; title: string }) {
    return request<GenerationJob>('/api/generate', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  },
  togglePlugin(projectId: string, pluginId: string) {
    return request<ProjectMemory>(`/api/project/${projectId}/plugins/${pluginId}/toggle`, {
      method: 'POST',
      body: JSON.stringify({}),
    })
  },
  getFileTree(projectId = 'default') {
    return request<{ projectId: string; tree: string[] }>(`/api/project/${projectId}/file-tree`)
  },
}
