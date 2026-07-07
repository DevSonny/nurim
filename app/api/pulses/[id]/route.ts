import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pulses, nodes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resolvedParams = await params
  const { id } = resolvedParams
  const body = await req.json()
  const { nodeId, date, value, kind, memo } = body

  if (nodeId) {
    const parentNode = await db.query.nodes.findFirst({
      where: and(eq(nodes.id, nodeId), eq(nodes.userId, session.user.id))
    })
    if (!parentNode) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
  }

  const [updatedPulse] = await db.update(pulses)
    .set({ nodeId, date, value, kind, memo })
    .where(and(eq(pulses.id, id), eq(pulses.userId, session.user.id)))
    .returning()

  if (!updatedPulse) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  return NextResponse.json(updatedPulse)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resolvedParams = await params
  const { id } = resolvedParams

  const [deletedPulse] = await db.delete(pulses)
    .where(and(eq(pulses.id, id), eq(pulses.userId, session.user.id)))
    .returning()

  if (!deletedPulse) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 })
  }

  return NextResponse.json(deletedPulse)
}
