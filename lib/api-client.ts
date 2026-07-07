export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.')
  }
  return res.json()
}

export const api = {
  nodes: {
    create: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/nodes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create node')
      return res.json()
    },
    update: async (id: string, data: Record<string, unknown>) => {
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
  },
  pulses: {
    create: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/pulses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create pulse')
      return res.json()
    },
    update: async (id: string, data: Record<string, unknown>) => {
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
    create: async (data: Record<string, unknown>) => {
      const res = await fetch('/api/proofs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Failed to create proof')
      return res.json()
    },
    delete: async (id: string) => {
      const res = await fetch(`/api/proofs/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete proof')
      return res.json()
    },
  },
}
