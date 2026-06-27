import type { Plugin, Skill, Suggestion } from './types'

export const suggestions: Suggestion[] = [
  { id: 'crm', title: 'CRM dashboard', template: 'Sales OS', accent: '#8b5cf6', prompt: 'Build a CRM dashboard with pipeline stages, lead scoring, revenue forecasts, and team activity.' },
  { id: 'landing', title: 'AI landing page', template: 'Growth Page', accent: '#ec4899', prompt: 'Create an AI product landing page with hero copy, pricing, testimonials, and conversion-focused CTAs.' },
  { id: 'tasks', title: 'Task manager', template: 'Productivity App', accent: '#06b6d4', prompt: 'Generate a task manager with kanban boards, priorities, due dates, and team collaboration.' },
  { id: 'commerce', title: 'Ecommerce storefront', template: 'Commerce Kit', accent: '#22c55e', prompt: 'Create an ecommerce storefront with product cards, cart flow, checkout summary, and analytics.' },
  { id: 'analytics', title: 'Analytics dashboard', template: 'Metrics Hub', accent: '#f59e0b', prompt: 'Build an analytics dashboard with KPI cards, charts, funnels, cohorts, and export controls.' },
  { id: 'booking', title: 'Booking app', template: 'Scheduler', accent: '#14b8a6', prompt: 'Create a booking app with calendar availability, service selection, reminders, and payments.' },
  { id: 'admin', title: 'Internal admin panel', template: 'Ops Console', accent: '#6366f1', prompt: 'Build an internal admin panel with user management, audit logs, roles, and operational workflows.' },
  { id: 'chatbot', title: 'AI chatbot UI', template: 'Assistant Studio', accent: '#a855f7', prompt: 'Create an AI chatbot interface with conversation history, prompt templates, tools, and memory.' },
]

export const skills: Skill[] = [
  { id: 'ui', name: 'UI Design', description: 'Premium layouts, responsive systems, and accessibility polish.', enabled: true },
  { id: 'fullstack', name: 'Full-stack App', description: 'App architecture, routes, components, and service boundaries.', enabled: true },
  { id: 'database', name: 'Database Schema', description: 'Tables, relationships, seed data, and migrations.', enabled: false },
  { id: 'auth', name: 'Auth Flow', description: 'Login, onboarding, sessions, and role-based access.', enabled: false },
  { id: 'api', name: 'API Integration', description: 'REST endpoints, SDK clients, webhooks, and typed contracts.', enabled: true },
  { id: 'automation', name: 'Automation', description: 'Background jobs, notifications, and workflow triggers.', enabled: false },
  { id: 'analytics', name: 'Analytics', description: 'Events, funnels, reporting, and product insights.', enabled: true },
  { id: 'seo', name: 'SEO', description: 'Metadata, content structure, schema, and performance basics.', enabled: false },
  { id: 'deploy', name: 'Deployment', description: 'Build configuration, hosting, environment setup, and releases.', enabled: true },
]

export const plugins: Plugin[] = [
  { id: 'supabase', name: 'Supabase', description: 'Database, auth, storage, and realtime APIs.', status: 'connected' },
  { id: 'stripe', name: 'Stripe', description: 'Payments, billing, subscriptions, and checkout.', status: 'available' },
  { id: 'clerk', name: 'Clerk/Auth', description: 'Authentication, user profiles, and organizations.', status: 'available' },
  { id: 'openai', name: 'OpenAI', description: 'LLM generation, embeddings, and assistant workflows.', status: 'connected' },
  { id: 'resend', name: 'Resend Email', description: 'Transactional email and notification delivery.', status: 'available' },
  { id: 'github', name: 'GitHub', description: 'Repository sync, pull requests, and version control.', status: 'connected' },
  { id: 'vercel', name: 'Vercel', description: 'Instant preview deployments and production hosting.', status: 'available' },
  { id: 'analytics', name: 'Analytics', description: 'Event tracking, dashboards, and conversion metrics.', status: 'available' },
  { id: 'database', name: 'Database', description: 'Schema generation, seed data, and query builders.', status: 'disabled' },
  { id: 'storage', name: 'Storage', description: 'File uploads, media handling, and CDN delivery.', status: 'available' },
]
