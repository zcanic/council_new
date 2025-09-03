import { pgTable, text, integer, boolean, timestamp, jsonb, serial, primaryKey } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  sessionCookie: text('session_cookie'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const topics = pgTable('topics', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('active'),
  createdBy: text('created_by').notNull(),
  participantCount: integer('participant_count').default(0),
  roundCount: integer('round_count').default(0),
  currentRound: integer('current_round').default(0),
  maxRounds: integer('max_rounds').default(3),
  createdAt: timestamp('created_at').defaultNow(),
})

export const rounds = pgTable('rounds', {
  id: text('id').primaryKey(),
  topicId: text('topic_id').notNull().references(() => topics.id),
  roundNumber: integer('round_number').notNull(),
  status: text('status').notNull().default('active'),
  commentCount: integer('comment_count').default(0),
  maxComments: integer('max_comments').default(10),
  startTime: timestamp('start_time').defaultNow(),
  endTime: timestamp('end_time'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const comments = pgTable('comments', {
  id: text('id').primaryKey(),
  topicId: text('topic_id').notNull().references(() => topics.id),
  roundId: text('round_id').notNull().references(() => rounds.id),
  userId: text('user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  positionType: text('position_type').notNull(),
  isAnonymous: boolean('is_anonymous').default(false),
  likeCount: integer('like_count').default(0),
  replyCount: integer('reply_count').default(0),
  parentId: text('parent_id'),
  status: text('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const summaries = pgTable('summaries', {
  id: text('id').primaryKey(),
  roundId: text('round_id').notNull().references(() => rounds.id),
  content: text('content').notNull(),
  consensus: jsonb('consensus'),
  disagreements: jsonb('disagreements'),
  newQuestions: jsonb('new_questions'),
  referencedComments: jsonb('referenced_comments'),
  sentimentScore: integer('sentiment_score'),
  clarityScore: integer('clarity_score'),
  modelVersion: text('model_version'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Zod schemas for validation
export const insertTopicSchema = createInsertSchema(topics)
export const insertRoundSchema = createInsertSchema(rounds)
export const insertCommentSchema = createInsertSchema(comments)
export const insertSummarySchema = createInsertSchema(summaries)

// Types
export type Topic = typeof topics.$inferSelect
export type Round = typeof rounds.$inferSelect
export type Comment = typeof comments.$inferSelect
export type Summary = typeof summaries.$inferSelect