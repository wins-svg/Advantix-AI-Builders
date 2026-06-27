import { PlugZap, Check, Lock, Database, CreditCard, KeyRound, Brain, Mail, Github, Rocket, BarChart3, HardDrive } from 'lucide-react'
import type { Plugin } from '../types'

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  supabase: Database,
  stripe: CreditCard,
  clerk: KeyRound,
  openai: Brain,
  resend: Mail,
  github: Github,
  vercel: Rocket,
  analytics: BarChart3,
  database: Database,
  storage: HardDrive,
}

type Props = {
  plugins: Plugin[]
  onToggle: (id: string) => void
}

export default function PluginsPanel({ plugins, onToggle }: Props) {
  return (
    <section className="glass panel side-panel">
      <div className="section-heading compact">
        <div>
          <span>Plugin Tools</span>
          <h2>Integration engine</h2>
        </div>
        <PlugZap className="glow-icon" size={22} />
      </div>

      <div className="plugin-grid compact-grid">
        {plugins.map((plugin) => {
          const Icon = iconMap[plugin.id] ?? PlugZap
          const connected = plugin.status === 'connected'
          const disabled = plugin.status === 'disabled'
          return (
            <article key={plugin.id} className={`plugin-card ${connected ? 'connected' : ''} ${disabled ? 'disabled' : ''}`}>
              <div className="plugin-topline">
                <Icon size={20} />
                <span>{connected ? <Check size={15} /> : disabled ? <Lock size={15} /> : '○'}</span>
              </div>
              <strong>{plugin.name}</strong>
              <p>{plugin.description}</p>
              <button disabled={disabled} onClick={() => onToggle(plugin.id)}>
                {connected ? 'Enabled' : disabled ? 'Locked' : 'Connect'}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
