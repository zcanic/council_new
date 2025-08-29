"use client"

import { useState } from "react"
import { LobbyInterface } from "@/components/lobby/lobby-interface"
import { TopicSpace } from "@/components/topic-space/topic-space"
import { CreateTopicModal } from "@/components/modals/create-topic-modal"
import { mockTopics } from "@/data/mockData"
import { getAllEnhancedTopicsWithDetails, getEnhancedTopicWithDetails } from "@/data/enhancedMockData"
import type { Topic, DiscussionState } from "@/types"

export default function DemoPage() {
  const [discussionState, setDiscussionState] = useState<DiscussionState>({
    viewMode: "lobby",
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [topics, setTopics] = useState<Topic[]>(mockTopics)

  const handleTopicClick = (topic: Topic) => {
    const enhancedTopic = getEnhancedTopicWithDetails(topic.id)
    if (enhancedTopic) {
      setDiscussionState({
        currentTopic: enhancedTopic,
        viewMode: "topic",
      })
    }
  }

  const handleBackToLobby = () => {
    setDiscussionState({ viewMode: "lobby" })
  }

  const handleCreateTopic = () => {
    setShowCreateModal(true)
  }

  const handleAddComment = (roundId: string, position: number) => {
    console.log("Adding comment to round:", roundId, "at position:", position)
  }

  // 获取所有增强的话题数据用于演示
  const enhancedTopics = getAllEnhancedTopicsWithDetails()

  return (
    <>
      {discussionState.viewMode === "lobby" && (
        <LobbyInterface
          topics={topics}
          onTopicClick={handleTopicClick}
          onCreateTopic={handleCreateTopic}
        />
      )}

      {discussionState.viewMode === "topic" && discussionState.currentTopic && (
        <TopicSpace
          topic={discussionState.currentTopic}
          rounds={discussionState.currentTopic.rounds || []}
          onBack={handleBackToLobby}
          onAddComment={handleAddComment}
        />
      )}

      <CreateTopicModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={(topicData) => {
          const newTopic: Topic = {
            id: Date.now().toString(),
            ...topicData,
            createdAt: new Date(),
            participantCount: 0,
            roundCount: 0,
            status: "active",
            createdBy: "current_user",
            creatorId: "current_user_id",
            currentRound: 0,
            maxRounds: 3,
          }
          setTopics([...topics, newTopic])
          setShowCreateModal(false)
        }}
      />

      {/* 演示控制面板 */}
      <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg z-50">
        <h3 className="text-sm font-semibold mb-2">🎯 演示模式</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>• 包含多轮讨论历史</div>
          <div>• 完整的AI总结示例</div>
          <div>• 丰富的评论数据</div>
          <div>• 点击议题查看详情</div>
        </div>
      </div>
    </>
  )
}