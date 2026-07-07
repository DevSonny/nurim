import useSWR from 'swr'
import { fetcher } from './api-client'
import type { InferSelectModel } from 'drizzle-orm'
import type { nodes, pulses, proofs } from './db/schema'

export type Node = InferSelectModel<typeof nodes>
export type Pulse = InferSelectModel<typeof pulses>
export type Proof = InferSelectModel<typeof proofs>

export function useGraph() {
  const { data, error, isLoading, mutate } = useSWR<{ nodes: Node[]; pulses: Pulse[] }>('/api/graph', fetcher)

  return {
    nodes: data?.nodes ?? [],
    pulses: data?.pulses ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function useProofs() {
  const { data, error, isLoading, mutate } = useSWR<Proof[]>('/api/proofs', fetcher)

  return {
    proofs: data ?? [],
    isLoading,
    isError: error,
    mutate,
  }
}
