"use client"

import { useState } from "react"
import { LobbyInterface } from "@/components/lobby/lobby-interface"
import { TopicSpace } from "@/components/topic-space/topic-space"
import { CreateTopicModal } from "@/components/modals/create-topic-modal"
import { mockTopics, getTopicWithDetails } from "@/data/mockData"
import type { Topic, DiscussionState } from "@/types"

export default function HomePage() {
  const [discussionState, setDiscussionState] = useState<DiscussionState>({
    viewMode: "lobby",
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [topics, setTopics] = useState<Topic[]>(mockTopics)

  const handleTopicClick = (topic: Topic) => {
    setDiscussionState({
      currentTopic: topic,
      viewMode: "topic",
    })
  }

  const handleBackToLobby = () => {
    setDiscussionState({
      viewMode: "lobby",
    })
  }

  const handleCreateTopic = () => {
    setShowCreateModal(true)
  }

  const handleTopicCreated = (newTopic: Omit<Topic, "id" | "createdAt" | "participantCount" | "roundCount">) => {
    const topic: Topic = {
      ...newTopic,
      id: Date.now().toString(),
      createdAt: new Date(),
      participantCount: 1,
      roundCount: 1,
    }
    setTopics((prev) => [topic, ...prev])
    setShowCreateModal(false)
  }

  const handleAddComment = (roundId: string, position: number) => {
    console.log("Add comment to round:", roundId, "at position:", position)
  }

  if (discussionState.viewMode === "topic" && discussionState.currentTopic) {
    const topicWithDetails = getTopicWithDetails(discussionState.currentTopic.id)
    return (
      <TopicSpace
        topic={discussionState.currentTopic}
        rounds={topicWithDetails?.rounds || []}
        onBack={handleBackToLobby}
        onAddComment={handleAddComment}
      />
    )
  }

  return (
    <>
      <LobbyInterface topics={topics} onTopicClick={handleTopicClick} onCreateTopic={handleCreateTopic} />
      <CreateTopicModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleTopicCreated}
      />
    </>
  )
}
