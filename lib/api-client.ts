import type { InferInsertModel } from 'drizzle-orm'
import { nodes, pulses, proofs } from './db/schema'

type InsertNode = Omit<InferInsertModel<typeof nodes>, 'id' | 'userId' | 'createdAt'>
type InsertPulse = Omit<InferInsertModel<typeof pulses>, 'id' | 'userId' | 'createdAt'>
type InsertProof = Omit<InferInsertModel<typeof proofs>, 'id' | 'userId' | 'createdAt'>

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.')
  }
  return res.json()
}

export const api = {
  nodes: {
    create: async (data: InsertNode) => {
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create node')
      return res.json()
    },
    update: async (id: string, data: Partial<InsertNode>) => {
      const res = await fetch(`/api/nodes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update node')
      return res.json()
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/nodes/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete node')
      return res.json()
    },
    achieve: async (id: string, achieved: boolean) => {
      const res = await fetch(`/api/nodes/${id}/achieve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ achieved }),
      })
      if (!res.ok) throw new Error('Failed to achieve node')
      return res.json()
    },
  },
  pulses: {
    create: async (data: InsertPulse) => {
      const res = await fetch('/api/pulses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create pulse')
      return res.json()
    },
    update: async (id: string, data: Partial<InsertPulse>) => {
      const res = await fetch(`/api/pulses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to update pulse')
      return res.json()
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/pulses/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete pulse')
      return res.json()
    },
  },
  proofs: {
    create: async (data: InsertProof) => {
      const res = await fetch('/api/proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create proof')
      return res.json()
    },
    react: async (id: string, reactionType: string) => {
      const res = await fetch(`/api/proofs/${id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType }),
      })
      if (!res.ok) throw new Error('Failed to react to proof')
      return res.json()
    },
  },
}
