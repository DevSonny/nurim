import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { proofs, nodes } from '@/lib/db/schema'
import { desc, eq, and } from 'drizzle-orm'

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const allProofs = await db.select().from(proofs).where(eq(proofs.userId, session.user.id)).orderBy(desc(proofs.createdAt))

  return NextResponse.json(allProofs)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { nodeId, body: content } = body

  if (nodeId) {
    const parentNode = await db.query.nodes.findFirst({
      where: and(eq(nodes.id, nodeId), eq(nodes.userId, session.user.id))
    })
    if (!parentNode) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }
  }

  const id = crypto.randomUUID()
  
  const [newProof] = await db.insert(proofs).values({
    nodeId,
    body: content,
    id,
    userId: session.user.id,
    createdAt: Date.now(),
  }).returning()

  return NextResponse.json(newProof)
}
