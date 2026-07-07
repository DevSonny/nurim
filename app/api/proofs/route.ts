import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { proofs } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allProofs = await db.select().from(proofs).orderBy(desc(proofs.createdAt))

  return NextResponse.json(allProofs)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const id = crypto.randomUUID()
  
  const [newProof] = await db.insert(proofs).values({
    ...body,
    id,
    userId: session.user.id,
    createdAt: Date.now(),
  }).returning()

  return NextResponse.json(newProof)
}
