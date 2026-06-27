import * as Switch from '@radix-ui/react-switch'
import { BrainCircuit, CheckCircle2 } from 'lucide-react'
import type { Skill } from '../types'

type Props = {
  skills: Skill[]
  onToggle: (id: string) => void
}

export default function SkillsPanel({ skills, onToggle }: Props) {
  return (
    <section className="glass panel side-panel">
      <div className="section-heading compact">
        <div>
          <span>Skills</span>
          <h2>Builder intelligence</h2>
        </div>
        <BrainCircuit className="glow-icon" size={22} />
      </div>

      <div className="skill-list">
        {skills.map((skill) => (
          <article key={skill.id} className={`skill-card ${skill.enabled ? 'enabled' : ''}`}>
            <div>
              <div className="skill-title">
                {skill.enabled && <CheckCircle2 size={15} />}
                <strong>{skill.name}</strong>
              </div>
              <p>{skill.description}</p>
            </div>
            <Switch.Root
              className="switch-root"
              checked={skill.enabled}
              onCheckedChange={() => onToggle(skill.id)}
              aria-label={`Toggle ${skill.name}`}
            >
              <Switch.Thumb className="switch-thumb" />
            </Switch.Root>
          </article>
        ))}
      </div>
    </section>
  )
}
