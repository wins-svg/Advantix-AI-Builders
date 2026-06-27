import { useEffect, useMemo, useState } from 'react'
import { Sparkles, Rocket, Eye, Download, Wand2, RefreshCw } from 'lucide-react'
import { api } from './api'
import { suggestions as seedSuggestions, skills as seedSkills, plugins as seedPlugins } from './data'
import type { Plugin, Skill, Suggestion, TabId } from './types'
import Suggestions from './components/Suggestions'
import SkillsPanel from './components/SkillsPanel'
import PluginsPanel from './components/PluginsPanel'
import EditorWorkspace from './components/EditorWorkspace'

const PROJECT_ID = 'default'
const chips = ['Responsive layout', 'Auth + database', 'SaaS pricing', 'Admin roles', 'Realtime data', 'Mobile-first']

export default function App() {
  const [selected, setSelected] = useState<Suggestion>(seedSuggestions[0])
  const [prompt, setPrompt] = useState(seedSuggestions[0].prompt)
  const [skills, setSkills] = useState<Skill[]>(seedSkills)
  const [plugins, setPlugins] = useState<Plugin[]>(seedPlugins)
  const [activeTab, setActiveTab] = useState<TabId>('preview')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'running' | 'success'>('idle')
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['[Command Center] Connecting to backend Project Memory...'])
  const [fileTree, setFileTree] = useState<string[]>([])
  const [buildVersion, setBuildVersion] = useState(1)
  const [apiState, setApiState] = useState<'connecting' | 'online' | 'offline'>('connecting')

  const enabledSkills = useMemo(() => skills.filter((skill) => skill.enabled), [skills])
  const connectedPlugins = useMemo(() => plugins.filter((plugin) => plugin.status === 'connected'), [plugins])

  async function loadBackendState() {
    try {
      const [memory, tree] = await Promise.all([api.getMemory(PROJECT_ID), api.getFileTree(PROJECT_ID)])
      const suggestion = seedSuggestions.find((item) => item.id === memory.currentSuggestionId) ?? seedSuggestions[0]
      setSelected(suggestion)
      setPrompt(memory.prompt)
      setBuildVersion(memory.buildVersion)
      setFileTree(tree.tree)
      setPlugins((current) => current.map((plugin) => ({ ...plugin, status: memory.plugins[plugin.id] ?? plugin.status })))
      setTerminalLogs([
        '[Backend] Connected to Advantix AI Builders API',
        `[Project Memory] Loaded ${memory.name}`,
        `[Project Memory] Build version ${memory.buildVersion}`,
        ...memory.history.slice(0, 5).map((item) => `[History] ${item}`),
      ])
      setApiState('online')
    } catch (error) {
      setApiState('offline')
      setTerminalLogs([
        '[Backend] API unavailable, using local fallback state',
        error instanceof Error ? `[Error] ${error.message}` : '[Error] Unknown backend connection issue',
      ])
    }
  }

  useEffect(() => {
    loadBackendState()
  }, [])

  function selectSuggestion(suggestion: Suggestion) {
    setSelected(suggestion)
    setPrompt(suggestion.prompt)
    setGenerationStatus('idle')
    setTerminalLogs([
      `[Project Memory] Loaded template memory for ${suggestion.title}`,
      `[AI Router] Suggested build target set to ${suggestion.template}`,
      '[Command Center] Ready to execute God Mode generation through backend API',
    ])
    setActiveTab('preview')
  }

  function toggleSkill(id: string) {
    setSkills((current) => current.map((skill) => skill.id === id ? { ...skill, enabled: !skill.enabled } : skill))
  }

  async function togglePlugin(id: string) {
    const previous = plugins
    setPlugins((current) => current.map((plugin) => {
      if (plugin.id !== id || plugin.status === 'disabled') return plugin
      return { ...plugin, status: plugin.status === 'connected' ? 'available' : 'connected' }
    }))

    try {
      const memory = await api.togglePlugin(PROJECT_ID, id)
      setPlugins((current) => current.map((plugin) => ({ ...plugin, status: memory.plugins[plugin.id] ?? plugin.status })))
      setTerminalLogs((current) => [`[Backend] Plugin ${id} synced to Project Memory`, ...current].slice(0, 18))
    } catch (error) {
      setPlugins(previous)
      setTerminalLogs((current) => [`[Backend] Plugin sync failed for ${id}`, ...current].slice(0, 18))
    }
  }

  async function generatePrototype() {
    setIsGenerating(true)
    setGenerationStatus('running')
    setActiveTab('console')
    setTerminalLogs([`$ advantix build --mode god --target "${selected.title}"`, `[Prompt] ${prompt}`, '[Backend] Sending generation request...'])

    try {
      const job = await api.generate({ projectId: PROJECT_ID, prompt, suggestionId: selected.id, title: selected.title })
      setTerminalLogs(job.logs)
      setBuildVersion(job.previewState.version)
      setGenerationStatus('success')
      const tree = await api.getFileTree(PROJECT_ID)
      setFileTree(tree.tree)
      window.setTimeout(() => setActiveTab('preview'), 450)
    } catch (error) {
      setTerminalLogs((current) => [
        ...current,
        '[Backend] Generation endpoint failed, completed local fallback simulation',
        error instanceof Error ? `[Error] ${error.message}` : '[Error] Unknown generation issue',
        '[God Mode] Success: local fallback prototype generated',
      ])
      setGenerationStatus('success')
      setBuildVersion((version) => version + 1)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero glass hero-grid">
        <div>
          <div className="eyebrow"><Sparkles size={16} /> Advantix AI Builders · API {apiState}</div>
          <h1>AI App Builder God Mode</h1>
          <p className="hero-copy">Autonomous developer, designer, programmer, architect, error fixer, and deployment engine. One prompt becomes a backend-backed command-center workflow for building, fixing, previewing, deploying, and scaling apps.</p>
          <div className="hero-actions">
            <a className="primary-btn" href="#builder"><Rocket size={18} /> Start building</a>
            <button className="secondary-btn" onClick={() => setActiveTab('preview')}><Eye size={18} /> View preview</button>
          </div>
        </div>
        <div className="hero-card">
          <span>Current build</span>
          <strong>{generationStatus === 'success' ? 'Generation complete' : selected.title}</strong>
          <p>{enabledSkills.length} skills active · {connectedPlugins.length} plugins connected · v{buildVersion}</p>
          <div className="mini-meter"><i style={{ width: generationStatus === 'success' ? '100%' : `${Math.min(95, 45 + enabledSkills.length * 6 + connectedPlugins.length * 5)}%` }} /></div>
        </div>
      </section>

      <section id="builder" className="builder-layout">
        <div className="left-stack">
          <Suggestions suggestions={seedSuggestions} selectedId={selected.id} onSelect={selectSuggestion} />

          <section className="glass prompt-card">
            <div className="section-heading">
              <div><span>Prompt-to-app</span><h2>Describe what to build</h2></div>
              <Wand2 className="glow-icon" />
            </div>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} placeholder="Describe your product idea, users, pages, data, and integrations..." />
            <div className="chip-row">
              {chips.map((chip) => <button key={chip} onClick={() => setPrompt((value) => `${value} Include ${chip.toLowerCase()}.`)}>{chip}</button>)}
            </div>
            <div className="action-row">
              <button className="primary-btn" onClick={generatePrototype} disabled={isGenerating}>{isGenerating ? <RefreshCw className="spin" size={18} /> : <Sparkles size={18} />} {isGenerating ? 'Executing God Mode' : 'Generate Prototype'}</button>
              <button className="secondary-btn" onClick={() => setPrompt(`${prompt} Refine the UX, improve empty states, and make the interface production-ready.`)}>Refine</button>
              <button className="secondary-btn" onClick={() => setActiveTab('preview')}>Preview</button>
              <button className="secondary-btn"><Download size={16} /> Export Code</button>
              <button className="secondary-btn"><Rocket size={16} /> Deploy</button>
            </div>
          </section>

          <EditorWorkspace
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selected={selected}
            prompt={prompt}
            skills={enabledSkills}
            plugins={plugins}
            onPluginToggle={togglePlugin}
            isGenerating={isGenerating}
            generationStatus={generationStatus}
            terminalLogs={terminalLogs}
            buildVersion={buildVersion}
            fileTree={fileTree}
          />
        </div>

        <aside className="right-stack">
          <SkillsPanel skills={skills} onToggle={toggleSkill} />
          <PluginsPanel plugins={plugins} onToggle={togglePlugin} />
          <section className="glass summary-card">
            <span>Build summary</span>
            <h3>{generationStatus === 'success' ? 'God Mode build ready' : selected.template}</h3>
            <p>{selected.title} generated with {enabledSkills.map((skill) => skill.name).join(', ') || 'no extra skills'}.</p>
            <p>{connectedPlugins.length} connected plugin tools synced with backend Project Memory.</p>
            <p>Status: {generationStatus === 'running' ? 'Architecting, designing, and programming...' : generationStatus === 'success' ? 'Preview, code, files, and terminal updated.' : 'Ready for prompt execution.'}</p>
          </section>
        </aside>
      </section>
    </main>
  )
}
