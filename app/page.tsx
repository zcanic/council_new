"use client"

import { useState } from "react"
import { LobbyInterface } from "@/components/lobby/lobby-interface"
import { TopicSpace } from "@/components/topic-space/topic-space"
import { CreateTopicModal } from "@/components/modals/create-topic-modal"
import type { Topic, DiscussionState } from "@/lib/types"

const mockTopics: Topic[] = [
  {
    id: "1",
    title: "猫的光学构造",
    description: "本议题旨在探讨并展望猫娘搭载型摄影系统的技术迭代路径、潜在应用场景以及其可能面临的伦理挑战。",
    createdAt: new Date("2024-01-15"),
    participantCount: 12,
    roundCount: 2,
    status: "active",
    createdBy: "user1",
  },
  {
    id: "2",
    title: "AI与创意产业的未来",
    description: "探讨人工智能技术对创意产业的影响，包括机遇与挑战，以及创作者如何适应新时代。",
    createdAt: new Date("2024-01-14"),
    participantCount: 18,
    roundCount: 3,
    status: "active",
    createdBy: "user2",
  },
  {
    id: "3",
    title: "可持续发展的城市规划",
    description: "讨论如何在城市发展中平衡经济增长与环境保护，探索绿色城市的可能性。",
    createdAt: new Date("2024-01-13"),
    participantCount: 7,
    roundCount: 1,
    status: "active",
    createdBy: "user3",
  },
  {
    id: "4",
    title: "远程工作的社会影响",
    description: "分析远程工作模式对社会结构、经济发展和个人生活的深远影响。",
    createdAt: new Date("2024-01-12"),
    participantCount: 23,
    roundCount: 4,
    status: "active",
    createdBy: "user4",
  },
  {
    id: "5",
    title: "数字货币的监管挑战",
    description: "探讨数字货币在全球范围内面临的监管问题和政策制定的复杂性。",
    createdAt: new Date("2024-01-11"),
    participantCount: 5,
    roundCount: 1,
    status: "locked",
    createdBy: "user5",
  },
  {
    id: "6",
    title: "教育技术的革新",
    description: "讨论新兴技术如何改变传统教育模式，提升学习效果和教育公平性。",
    createdAt: new Date("2024-01-10"),
    participantCount: 14,
    roundCount: 2,
    status: "active",
    createdBy: "user6",
  },
]

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
    return (
      <TopicSpace
        topic={discussionState.currentTopic}
        rounds={[]} // Will be populated with real data
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
