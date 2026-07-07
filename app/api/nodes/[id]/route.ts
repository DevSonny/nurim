import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { nodes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resolvedParams = await params
  const { id } = resolvedParams
  const body = await req.json()
  const { label, type, parentId, orbitIdx, target, unit, period, goalType, achievedAt } = body

  const [updatedNode] = await db.update(nodes)
    .set({ label, type, parentId, orbitIdx, target, unit, period, goalType, achievedAt })
    .where(and(eq(nodes.id, id), eq(nodes.userId, session.user.id)))
    .returning()

  if (!updatedNode) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  return NextResponse.json(updatedNode)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resolvedParams = await params
  const { id } = resolvedParams

  const [deletedNode] = await db.delete(nodes)
    .where(and(eq(nodes.id, id), eq(nodes.userId, session.user.id)))
    .returning()

  if (!deletedNode) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  return NextResponse.json(deletedNode)
}
