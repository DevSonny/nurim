import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pulses } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resolvedParams = await params
  const { id } = resolvedParams
  const body = await req.json()

  const [updatedPulse] = await db.update(pulses)
    .set(body)
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
