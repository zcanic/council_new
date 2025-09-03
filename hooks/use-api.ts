import { useState, useCallback } from 'react'
import { topicApi, roundApi, commentApi, summaryApi } from '@/lib/api'
import type { Topic, Comment, CreateTopicData, CreateCommentData } from '@/types'

export function useApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleError = useCallback((err: any) => {
    const message = err.message || 'An error occurred'
    setError(message)
    console.error('API Error:', err)
    return message
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // 话题操作
  const getTopics = useCallback(async (sortBy?: string) => {
    setLoading(true)
    clearError()
    try {
      return await topicApi.getTopics(sortBy)
    } catch (err) {
      throw new Error(handleError(err))
    } finally {
      setLoading(false)
    }
  }, [handleError, clearError])

  const createTopic = useCallback(async (data: CreateTopicData & { createdBy: string }) => {
    setLoading(true)
    clearError()
    try {
      return await topicApi.createTopic(data)
    } catch (err) {
      throw new Error(handleError(err))
    } finally {
      setLoading(false)
    }
  }, [handleError, clearError])

  const getTopic = useCallback(async (id: string) => {
    setLoading(true)
    clearError()
    try {
      return await topicApi.getTopic(id)
    } catch (err) {
      throw new Error(handleError(err))
    } finally {
      setLoading(false)
    }
  }, [handleError, clearError])

  // 轮次操作
  const manageRound = useCallback(async (topicId: string, action: 'start' | 'lock' | 'next') => {
    setLoading(true)
    clearError()
    try {
      return await roundApi.manageRound(topicId, action)
    } catch (err) {
      throw new Error(handleError(err))
    } finally {
      setLoading(false)
    }
  }, [handleError, clearError])

  // 评论操作
  const createComment = useCallback(async (data: CreateCommentData & {
    topicId: string
    username: string
    roundId?: string
  }) => {
    setLoading(true)
    clearError()
    try {
      return await commentApi.createComment(data)
    } catch (err) {
      throw new Error(handleError(err))
    } finally {
      setLoading(false)
    }
  }, [handleError, clearError])

  // AI总结操作
  const generateSummary = useCallback(async (roundId: string) => {
    setLoading(true)
    clearError()
    try {
      return await summaryApi.generateSummary(roundId)
    } catch (err) {
      throw new Error(handleError(err))
    } finally {
      setLoading(false)
    }
  }, [handleError, clearError])

  return {
    // 状态
    loading,
    error,
    clearError,
    
    // 话题方法
    getTopics,
    createTopic,
    getTopic,
    
    // 轮次方法
    manageRound,
    
    // 评论方法
    createComment,
    
    // AI方法
    generateSummary
  }
}