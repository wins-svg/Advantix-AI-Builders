import * as Tabs from '@radix-ui/react-tabs'
import { Bot, CheckCircle2, Code2, FileCode2, FolderTree, PlugZap, ShieldCheck, TerminalSquare } from 'lucide-react'
import type { Plugin, Skill, Suggestion, TabId } from '../types'
import PluginsPanel from './PluginsPanel'

type Props = {
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
  selected: Suggestion
  prompt: string
  skills: Skill[]
  plugins: Plugin[]
  onPluginToggle: (id: string) => void
  isGenerating: boolean
  generationStatus: 'idle' | 'running' | 'success'
  terminalLogs: string[]
  buildVersion: number
  fileTree: string[]
}

const tabs: Array<{ id: TabId; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'preview', label: 'Live Preview', icon: Bot },
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'files', label: 'File Explorer', icon: FolderTree },
  { id: 'console', label: 'Terminal', icon: TerminalSquare },
  { id: 'plugins', label: 'Plugins', icon: PlugZap },
]

function makeCode(selected: Suggestion, skills: Skill[], plugins: Plugin[], generationStatus: Props['generationStatus'], buildVersion: number) {
  const pluginNames = plugins.filter((plugin) => plugin.status === 'connected').map((plugin) => plugin.name)
  return `export default function ${selected.template.replace(/\W/g, '')}() {
  const advantixCore = {
    brand: 'Advantix AI Builders',
    mode: 'GOD_MODE',
    status: '${generationStatus}',
    buildVersion: ${buildVersion},
    template: '${selected.title}',
    pipeline: ['Prompt', 'Think', 'Plan', 'Build', 'Fix', 'Deploy', 'Scale'],
    skills: ${JSON.stringify(skills.map((skill) => skill.name), null, 2)},
    plugins: ${JSON.stringify(pluginNames, null, 2)},
  }

  return (
    <CommandCenter core={advantixCore}>
      <AIChat />
      <BuilderStudio />
      <LivePreview />
      <FileExplorer memory="backend-project-memory" />
      <VisualEditor />
      <Terminal autoFix />
      <DeploymentEngine />
    </CommandCenter>
  )
}`
}

function fallbackFileTree(selected: Suggestion, skills: Skill[], plugins: Plugin[], generationStatus: Props['generationStatus'], buildVersion: number) {
  const connected = plugins.filter((plugin) => plugin.status === 'connected').map((plugin) => plugin.name.toLowerCase().replace(/\W+/g, '-'))
  const skillFiles = skills.map((skill) => `│   │   ├── ${skill.name.toLowerCase().replace(/\W+/g, '-')}.skill.ts`)
  const pluginFiles = connected.map((name) => `│   │   ├── ${name}.plugin.ts`)
  return [
    `advantix-ai-builders/                       # Local fallback memory v${buildVersion}`,
    '├── command-center/',
    '│   ├── ai-chat.tsx',
    '│   ├── builder-studio.tsx',
    '│   ├── live-preview.tsx',
    '│   ├── visual-editor.tsx',
    '│   ├── terminal.tsx',
    '│   └── deployment-engine.tsx',
    '├── generated-app/',
    `│   ├── ${selected.id}-preview.tsx`,
    `│   ├── ${selected.id}-routes.ts`,
    `│   ├── ${selected.id}-api.ts`,
    `│   └── ${selected.id}-schema.sql`,
    '├── ai-core/',
    '│   ├── architect-ai.ts',
    '│   ├── designer-ai.ts',
    '│   ├── programmer-ai.ts',
    '│   ├── error-fixer.ts',
    '│   ├── qa-agent.ts',
    '│   └── devops-agent.ts',
    '├── skills/',
    ...skillFiles,
    '├── plugins/',
    ...(pluginFiles.length ? pluginFiles : ['│   │   └── no-connected-plugins.ts']),
    '├── memory/',
    '│   ├── components.memory.json',
    '│   ├── design.memory.json',
    '│   ├── database.memory.json',
    '│   ├── version-history.json',
    '│   └── restore-points.json',
    '└── advantix.config.ts',
    '',
    `status: ${generationStatus}`,
  ]
}

function PreviewPanel({ selected, skills, plugins, generationStatus, buildVersion }: Pick<Props, 'selected' | 'skills' | 'plugins' | 'generationStatus' | 'buildVersion'>) {
  const connected = plugins.filter((plugin) => plugin.status === 'connected')
  return (
    <div className="preview-stage">
      <div className="mock-app-shell">
        <div className="mock-sidebar">
          <strong>Advantix</strong>
          {['Dashboard', 'AI Chat', 'Builder Studio', 'Live Preview', 'File Explorer', 'Terminal', 'Deploy'].map((item) => <span key={item}>{item}</span>)}
        </div>
        <div className="mock-main">
          <div className="mock-topbar">
            <div>
              <small>AI APP BUILDER : GOD MODE</small>
              <h3>{generationStatus === 'success' ? `${selected.title} ready` : selected.title}</h3>
            </div>
            <span className="status-pill">{generationStatus === 'running' ? 'Executing' : generationStatus === 'success' ? 'Success' : 'Autonomous'}</span>
          </div>
          <div className="god-flow">
            {['Prompt', 'Think', 'Plan', 'Build', 'Fix', 'Deploy', 'Scale'].map((step) => <b key={step}>{step}</b>)}
          </div>
          <div className="mock-grid">
            <article><ShieldCheck /><span>Architect AI</span><strong>{generationStatus === 'success' ? 'Blueprint complete' : 'System blueprint ready'}</strong></article>
            <article><Bot /><span>Programmer AI</span><strong>{generationStatus === 'running' ? 'Writing modules...' : 'Frontend + backend pipeline'}</strong></article>
            <article><FileCode2 /><span>Error Fixer</span><strong>{generationStatus === 'success' ? 'Retest passed' : 'Auto repair enabled'}</strong></article>
          </div>
          {generationStatus === 'success' && (
            <div className="success-banner"><CheckCircle2 size={18} /> Build v{buildVersion} generated successfully. Backend Project Memory updated.</div>
          )}
          <div className="tag-cloud">
            {skills.map((skill) => <span key={skill.id}>{skill.name}</span>)}
            {connected.map((plugin) => <span key={plugin.id}>{plugin.name}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EditorWorkspace(props: Props) {
  const { activeTab, setActiveTab, selected, prompt, skills, plugins, onPluginToggle, isGenerating, generationStatus, terminalLogs, buildVersion, fileTree } = props
  const visibleFileTree = fileTree.length ? fileTree : fallbackFileTree(selected, skills, plugins, generationStatus, buildVersion)

  return (
    <section className="glass editor-card">
      <div className="section-heading">
        <div>
          <span>Command Center</span>
          <h2>Prompt → Think → Plan → Build → Fix → Deploy → Scale</h2>
        </div>
        <span className="mode-badge">{isGenerating ? 'EXECUTING' : 'GOD MODE'}</span>
      </div>

      <Tabs.Root value={activeTab} onValueChange={(value) => setActiveTab(value as TabId)}>
        <Tabs.List className="tab-list" aria-label="Advantix AI Builder workspace tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Tabs.Trigger key={tab.id} value={tab.id} className="tab-trigger">
                <Icon size={16} /> {tab.label}
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>

        <Tabs.Content value="preview" className="tab-content">
          <PreviewPanel selected={selected} skills={skills} plugins={plugins} generationStatus={generationStatus} buildVersion={buildVersion} />
        </Tabs.Content>
        <Tabs.Content value="code" className="tab-content">
          <pre className="code-block">{makeCode(selected, skills, plugins, generationStatus, buildVersion)}</pre>
        </Tabs.Content>
        <Tabs.Content value="files" className="tab-content">
          <pre className="code-block tree">{visibleFileTree.join('\n')}</pre>
        </Tabs.Content>
        <Tabs.Content value="console" className="tab-content">
          <div className="console-block">
            {terminalLogs.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
            <p className="prompt-line">Current prompt: {prompt}</p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="plugins" className="tab-content"><PluginsPanel plugins={plugins} onToggle={onPluginToggle} /></Tabs.Content>
      </Tabs.Root>
    </section>
  )
}
