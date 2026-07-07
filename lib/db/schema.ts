import {
  sqliteTable,
  text,
  integer,
  real,
  unique,
} from 'drizzle-orm/sqlite-core'

// ── Auth.js (Drizzle Adapter 표준) ────────────────────────────────────────────

export const users = sqliteTable('users', {
  id:            text('id').primaryKey(),
  name:          text('name'),
  email:         text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'timestamp_ms' }),
  image:         text('image'),
})

export const accounts = sqliteTable('accounts', {
  userId:            text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type:              text('type').notNull(),
  provider:          text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token:     text('refresh_token'),
  access_token:      text('access_token'),
  expires_at:        integer('expires_at'),
  token_type:        text('token_type'),
  scope:             text('scope'),
  id_token:          text('id_token'),
  session_state:     text('session_state'),
}, (t) => ({
  pk: unique().on(t.provider, t.providerAccountId),
}))

export const sessions = sqliteTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId:       text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires:      integer('expires', { mode: 'timestamp_ms' }).notNull(),
})

export const verificationTokens = sqliteTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token:      text('token').notNull(),
  expires:    integer('expires', { mode: 'timestamp_ms' }).notNull(),
}, (t) => ({
  pk: unique().on(t.identifier, t.token),
}))

// ── App Tables ────────────────────────────────────────────────────────────────

export const nodes = sqliteTable('nodes', {
  id:         text('id').primaryKey(),
  userId:     text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type:       text('type').notNull(),         // 'core' | 'orbit' | 'sub'
  label:      text('label').notNull(),
  orbitIdx:   integer('orbit_idx').notNull(), // 색상 일관성 유지용
  parentId:   text('parent_id'),              // nullable, self-ref
  goalType:   text('goal_type'),              // 'accumulation' | 'repetition'
  target:     real('target'),
  unit:       text('unit'),
  period:     text('period'),                 // 'day' | 'week' | 'month'
  achievedAt: integer('achieved_at'),         // unix ms, nullable
  createdAt:  integer('created_at').notNull(),
})

export const pulses = sqliteTable('pulses', {
  id:        text('id').primaryKey(),
  nodeId:    text('node_id').notNull().references(() => nodes.id, { onDelete: 'cascade' }),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  date:      text('date').notNull(),   // YYYY-MM-DD
  value:     real('value').notNull(),  // 음수 허용 (money 지출)
  kind:      text('kind'),             // 'score'|'time'|'check'|'money'|'progress'
  memo:      text('memo'),
  createdAt: integer('created_at').notNull(),
})

export const proofs = sqliteTable('proofs', {
  id:        text('id').primaryKey(),
  userId:    text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  nodeId:    text('node_id').references(() => nodes.id, { onDelete: 'set null' }),
  body:      text('body').notNull(),
  createdAt: integer('created_at').notNull(),
})

export const reactions = sqliteTable('reactions', {
  id:           text('id').primaryKey(),
  proofId:      text('proof_id').notNull().references(() => proofs.id, { onDelete: 'cascade' }),
  userId:       text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  reactionType: text('reaction_type').notNull(), // 'fire'|'flex'|'star'|'heart'|'check'
  createdAt:    integer('created_at').notNull(),
}, (t) => ({
  uniq: unique().on(t.proofId, t.userId, t.reactionType),
}))
