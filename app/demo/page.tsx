"use client"

import { useState, useEffect } from "react"
import { LobbyInterface } from "@/components/lobby/lobby-interface"
import { TopicSpace } from "@/components/topic-space/topic-space"
import { CreateTopicModal } from "@/components/modals/create-topic-modal"
import { Button } from "@/components/ui/button"
import { useApi } from "@/hooks/use-api"
import { setMockMode } from "@/lib/api"
import type { Topic, DiscussionState } from "@/types"

export default function DemoPage() {
  const { getTopics, createTopic, getTopic, loading, error } = useApi()
  const [discussionState, setDiscussionState] = useState<DiscussionState>({
    viewMode: "lobby",
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [topics, setTopics] = useState<Topic[]>([])
  const [isMockMode, setIsMockMode] = useState(false)

  useEffect(() => {
    loadTopics()
  }, [])

  const loadTopics = async () => {
    try {
      const topicsData = await getTopics()
      setTopics(topicsData)
    } catch (err) {
      console.error('Failed to load topics:', err)
    }
  }

  const handleTopicClick = async (topic: Topic) => {
    try {
      const topicWithDetails = await getTopic(topic.id)
      setDiscussionState({
        currentTopic: topicWithDetails,
        viewMode: "topic",
      })
    } catch (err) {
      console.error('Failed to load topic details:', err)
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

  const toggleMockMode = () => {
    const newMockMode = !isMockMode
    setIsMockMode(newMockMode)
    setMockMode(newMockMode)
    
    // 重新加载数据
    loadTopics()
    
    // 如果当前在话题详情页，刷新话题数据
    if (discussionState.viewMode === 'topic' && discussionState.currentTopic) {
      handleTopicClick(discussionState.currentTopic)
    }
  }

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
        onSubmit={async (topicData) => {
          try {
            const newTopic = await createTopic({
              ...topicData,
              createdBy: "current_user"
            })
            setTopics([...topics, newTopic])
            setShowCreateModal(false)
          } catch (err) {
            console.error('Failed to create topic:', err)
          }
        }}
      />

      {/* 状态指示器 */}
      <div className="fixed bottom-4 right-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-4 shadow-lg z-50">
        <h3 className="text-sm font-semibold mb-2">🎯 实时模式</h3>
        <div className="space-y-1 text-xs text-muted-foreground">
          <div>• 实时数据库连接</div>
          <div>• 动态AI总结生成</div>
          <div>• 真实用户互动</div>
          {loading && <div className="text-blue-500">• 加载中...</div>}
          {error && <div className="text-red-500">• 错误: {error}</div>}
        </div>
        
        {/* Mock 模式切换按钮 */}
        <div className="mt-3 pt-3 border-t border-border/50">
          <Button
            variant={isMockMode ? "default" : "outline"}
            size="sm"
            onClick={toggleMockMode}
            className="w-full text-xs"
          >
            {isMockMode ? '✅ Mock模式' : 'Mock数据'}
          </Button>
        </div>
      </div>
    </>
  )
}