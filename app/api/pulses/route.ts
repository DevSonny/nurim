import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { pulses } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await db.select().from(pulses).where(eq(pulses.userId, session.user.id))

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const id = crypto.randomUUID()
  
  const [newPulse] = await db.insert(pulses).values({
    ...body,
    id,
    userId: session.user.id,
    createdAt: Date.now(),
  }).returning()

  return NextResponse.json(newPulse)
}
