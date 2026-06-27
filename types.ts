export type TabId = 'preview' | 'code' | 'files' | 'console' | 'plugins'

export type Suggestion = {
  id: string
  title: string
  prompt: string
  template: string
  accent: string
}

export type Skill = {
  id: string
  name: string
  description: string
  enabled: boolean
}

export type Plugin = {
  id: string
  name: string
  description: string
  status: 'connected' | 'available' | 'disabled'
}
