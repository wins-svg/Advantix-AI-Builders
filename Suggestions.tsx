import { LayoutDashboard, MessageSquare, ShoppingBag, CalendarDays, Bot, ClipboardList, BarChart3, PanelsTopLeft } from 'lucide-react'
import type { Suggestion } from '../types'

const icons = [LayoutDashboard, PanelsTopLeft, ClipboardList, ShoppingBag, BarChart3, CalendarDays, LayoutDashboard, Bot, MessageSquare]

type Props = {
  suggestions: Suggestion[]
  selectedId: string
  onSelect: (suggestion: Suggestion) => void
}

export default function Suggestions({ suggestions, selectedId, onSelect }: Props) {
  return (
    <section className="glass panel">
      <div className="section-heading">
        <div>
          <span>Suggestions to build</span>
          <h2>Start from a high-signal idea</h2>
        </div>
      </div>
      <div className="suggestion-grid">
        {suggestions.map((suggestion, index) => {
          const Icon = icons[index] ?? PanelsTopLeft
          const active = suggestion.id === selectedId
          return (
            <button
              key={suggestion.id}
              className={`suggestion-card ${active ? 'active' : ''}`}
              style={{ '--accent': suggestion.accent } as React.CSSProperties}
              onClick={() => onSelect(suggestion)}
            >
              <Icon size={20} />
              <strong>{suggestion.title}</strong>
              <small>{suggestion.template}</small>
            </button>
          )
        })}
      </div>
    </section>
  )
}
