import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { reactions } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: proofId } = await params
  const { reactionType } = await req.json()
  const userId = session.user.id

  const existing = await db
    .select()
    .from(reactions)
    .where(
      and(
        eq(reactions.proofId, proofId),
        eq(reactions.userId, userId),
        eq(reactions.reactionType, reactionType)
      )
    )
    .limit(1)

  if (existing.length > 0) {
    await db
      .delete(reactions)
      .where(
        and(
          eq(reactions.proofId, proofId),
          eq(reactions.userId, userId),
          eq(reactions.reactionType, reactionType)
        )
      )
    return NextResponse.json({ success: true, action: 'removed' })
  } else {
    const newReactionId = crypto.randomUUID()
    const [newReaction] = await db
      .insert(reactions)
      .values({
        id: newReactionId,
        proofId,
        userId,
        reactionType,
        createdAt: Date.now(),
      })
      .returning()
    
    return NextResponse.json({ success: true, action: 'added', reaction: newReaction })
  }
}
