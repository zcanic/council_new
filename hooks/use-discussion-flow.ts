"use client"

import { useState, useCallback, useEffect } from "react"
import { useAIIntegration } from "./use-ai-integration"
import type { Topic, Round, Comment, DiscussionState } from "@/lib/types"

export function useDiscussionFlow(initialTopic: Topic) {
  const [discussionState, setDiscussionState] = useState<DiscussionState>({
    currentTopic: initialTopic,
    rounds: [],
    activeRoundId: null,
    participantCount: 0,
    totalComments: 0,
  })

  const { generateSummary, isGeneratingSummary } = useAIIntegration()

  // Initialize first round
  useEffect(() => {
    if (discussionState.rounds.length === 0) {
      const firstRound: Round = {
        id: `round-${Date.now()}`,
        topicId: initialTopic.id,
        roundNumber: 1,
        comments: [],
        status: "active",
        createdAt: new Date(),
      }
      setDiscussionState((prev) => ({
        ...prev,
        rounds: [firstRound],
        activeRoundId: firstRound.id,
      }))
    }
  }, [initialTopic.id, discussionState.rounds.length])

  const addComment = useCallback(
    (content: string, authorName: string, position: number) => {
      const newComment: Comment = {
        id: `comment-${Date.now()}`,
        topicId: discussionState.currentTopic.id,
        roundId: discussionState.activeRoundId!,
        content,
        authorId: `user-${Date.now()}`,
        authorName,
        createdAt: new Date(),
        position,
      }

      setDiscussionState((prev) => {
        const updatedRounds = prev.rounds.map((round) => {
          if (round.id === prev.activeRoundId) {
            const updatedComments = [...round.comments, newComment]
            return {
              ...round,
              comments: updatedComments,
            }
          }
          return round
        })

        return {
          ...prev,
          rounds: updatedRounds,
          totalComments: prev.totalComments + 1,
        }
      })

      return newComment
    },
    [discussionState.currentTopic.id, discussionState.activeRoundId],
  )

  const triggerWisdomDistillation = useCallback(async () => {
    const activeRound = discussionState.rounds.find((r) => r.id === discussionState.activeRoundId)
    if (!activeRound || activeRound.comments.length < 10) {
      return null
    }

    // Generate AI summary
    const summary = await generateSummary(
      activeRound.comments,
      discussionState.currentTopic.title,
      activeRound.roundNumber,
    )

    if (!summary) return null

    // Lock current round
    const lockedRound: Round = {
      ...activeRound,
      status: "locked",
      summary,
    }

    // Create new round based on summary
    const newRound: Round = {
      id: `round-${Date.now()}`,
      topicId: discussionState.currentTopic.id,
      roundNumber: activeRound.roundNumber + 1,
      comments: [],
      status: "active",
      createdAt: new Date(),
      parentSummary: summary,
    }

    setDiscussionState((prev) => ({
      ...prev,
      rounds: prev.rounds.map((r) => (r.id === activeRound.id ? lockedRound : r)).concat(newRound),
      activeRoundId: newRound.id,
    }))

    return { summary, newRound }
  }, [discussionState, generateSummary])

  const switchToRound = useCallback((roundId: string) => {
    setDiscussionState((prev) => ({
      ...prev,
      activeRoundId: roundId,
    }))
  }, [])

  const getCurrentRound = useCallback(() => {
    return discussionState.rounds.find((r) => r.id === discussionState.activeRoundId)
  }, [discussionState.rounds, discussionState.activeRoundId])

  const canTriggerDistillation = useCallback(() => {
    const currentRound = getCurrentRound()
    return currentRound && currentRound.comments.length >= 10 && currentRound.status === "active"
  }, [getCurrentRound])

  return {
    discussionState,
    addComment,
    triggerWisdomDistillation,
    switchToRound,
    getCurrentRound,
    canTriggerDistillation,
    isGeneratingSummary,
  }
}
