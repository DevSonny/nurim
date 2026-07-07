import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { nodes, pulses } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = session.user.id

  const [userNodes, userPulses] = await Promise.all([
    db.select().from(nodes).where(eq(nodes.userId, userId)),
    db.select().from(pulses).where(eq(pulses.userId, userId)),
  ])

  return NextResponse.json({ nodes: userNodes, pulses: userPulses })
}
