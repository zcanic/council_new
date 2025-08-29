import { Topic, DiscussionRound, Comment, User } from '@/types'

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'tech_enthusiast',
    email: 'tech@example.com',
    avatar: '/placeholder-user.jpg',
    status: 'active',
    lastSeen: new Date('2024-01-28T10:30:00')
  },
  {
    id: '2', 
    username: 'creative_mind',
    email: 'creative@example.com',
    avatar: '/placeholder-user.jpg',
    status: 'active',
    lastSeen: new Date('2024-01-28T09:15:00')
  },
  {
    id: '3',
    username: 'urban_planner',
    email: 'urban@example.com',
    avatar: '/placeholder-user.jpg',
    status: 'active',
    lastSeen: new Date('2024-01-27T16:45:00')
  },
  {
    id: '4',
    username: 'remote_worker',
    email: 'remote@example.com',
    avatar: '/placeholder-user.jpg',
    status: 'active',
    lastSeen: new Date('2024-01-28T11:20:00')
  },
  {
    id: '5',
    username: 'finance_expert',
    email: 'finance@example.com',
    avatar: '/placeholder-user.jpg',
    status: 'active',
    lastSeen: new Date('2024-01-26T14:30:00')
  },
  {
    id: '6',
    username: 'edu_innovator',
    email: 'edu@example.com',
    avatar: '/placeholder-user.jpg',
    status: 'active',
    lastSeen: new Date('2024-01-28T08:00:00')
  }
]

// 模拟话题数据
export const mockTopics: Topic[] = [
  {
    id: '1',
    title: '猫的光学构造',
    description: '本议题旨在探讨并展望猫娘搭载型摄影系统的技术迭代路径、潜在应用场景以及其可能面临的伦理挑战。',
    createdAt: new Date('2024-01-15'),
    participantCount: 12,
    roundCount: 2,
    status: 'active',
    createdBy: 'tech_enthusiast',
    creatorId: '1',
    currentRound: 2,
    maxRounds: 3
  },
  {
    id: '2',
    title: 'AI与创意产业的未来',
    description: '探讨人工智能技术对创意产业的影响，包括机遇与挑战，以及创作者如何适应新时代。',
    createdAt: new Date('2024-01-14'),
    participantCount: 18,
    roundCount: 3,
    status: 'active',
    createdBy: 'creative_mind',
    creatorId: '2',
    currentRound: 3,
    maxRounds: 4
  },
  {
    id: '3',
    title: '可持续发展的城市规划',
    description: '讨论如何在城市发展中平衡经济增长与环境保护，探索绿色城市的可能性。',
    createdAt: new Date('2024-01-13'),
    participantCount: 7,
    roundCount: 1,
    status: 'active',
    createdBy: 'urban_planner',
    creatorId: '3',
    currentRound: 1,
    maxRounds: 3
  },
  {
    id: '4',
    title: '远程工作的社会影响',
    description: '分析远程工作模式对社会结构、经济发展和个人生活的深远影响。',
    createdAt: new Date('2024-01-12'),
    participantCount: 23,
    roundCount: 4,
    status: 'active',
    createdBy: 'remote_worker',
    creatorId: '4',
    currentRound: 4,
    maxRounds: 5
  },
  {
    id: '5',
    title: '数字货币的监管挑战',
    description: '探讨数字货币在全球范围内面临的监管问题和政策制定的复杂性。',
    createdAt: new Date('2024-01-11'),
    participantCount: 5,
    roundCount: 1,
    status: 'locked',
    createdBy: 'finance_expert',
    creatorId: '5',
    currentRound: 1,
    maxRounds: 3
  },
  {
    id: '6',
    title: '教育技术的革新',
    description: '讨论新兴技术如何改变传统教育模式，提升学习效果和教育公平性。',
    createdAt: new Date('2024-01-10'),
    participantCount: 14,
    roundCount: 2,
    status: 'active',
    createdBy: 'edu_innovator',
    creatorId: '6',
    currentRound: 2,
    maxRounds: 4
  }
]

// 模拟讨论轮次数据
export const mockRounds: DiscussionRound[] = [
  // 话题1的轮次
  {
    id: '1-1',
    topicId: '1',
    roundNumber: 1,
    status: 'completed',
    startTime: new Date('2024-01-15T10:00:00'),
    endTime: new Date('2024-01-15T12:00:00'),
    commentCount: 8,
    maxComments: 10,
    aiSummary: '第一轮讨论主要围绕猫娘摄影系统的技术可行性展开，参与者对光学传感器的小型化和能耗问题进行了深入探讨。',
    convergenceScore: 0.75
  },
  {
    id: '1-2',
    topicId: '1',
    roundNumber: 2,
    status: 'active',
    startTime: new Date('2024-01-20T14:00:00'),
    commentCount: 4,
    maxComments: 10,
    convergenceScore: 0.62
  },
  
  // 话题2的轮次
  {
    id: '2-1',
    topicId: '2',
    roundNumber: 1,
    status: 'completed',
    startTime: new Date('2024-01-14T09:00:00'),
    endTime: new Date('2024-01-14T11:30:00'),
    commentCount: 12,
    maxComments: 15,
    aiSummary: '首轮讨论聚焦AI在艺术创作中的应用，参与者分享了使用AI工具的经验和创作成果。',
    convergenceScore: 0.68
  },
  {
    id: '2-2',
    topicId: '2',
    roundNumber: 2,
    status: 'completed',
    startTime: new Date('2024-01-17T15:00:00'),
    endTime: new Date('2024-01-17T17:30:00'),
    commentCount: 10,
    maxComments: 15,
    aiSummary: '第二轮讨论了AI对创意产业就业市场的影响，观点呈现多元化趋势。',
    convergenceScore: 0.55
  },
  {
    id: '2-3',
    topicId: '2',
    roundNumber: 3,
    status: 'active',
    startTime: new Date('2024-01-25T13:00:00'),
    commentCount: 6,
    maxComments: 15,
    convergenceScore: 0.71
  }
]

// 模拟评论数据
export const mockComments: Comment[] = [
  // 话题1第1轮的评论
  {
    id: '1-1-1',
    topicId: '1',
    roundId: '1-1',
    userId: '1',
    user: mockUsers[0],
    content: '我认为猫娘摄影系统的核心挑战在于如何在有限的空间内集成高质量的光学元件。现有的微型摄像头技术可能无法满足要求。',
    positionType: 'neutral',
    isAnonymous: false,
    sentimentScore: 0.6,
    qualityScore: 0.8,
    likeCount: 5,
    replyCount: 2,
    status: 'active',
    createdAt: new Date('2024-01-15T10:15:00')
  },
  {
    id: '1-1-2',
    topicId: '1',
    roundId: '1-1',
    userId: '2',
    user: mockUsers[1],
    content: '从艺术角度来说，猫娘的形象设计应该注重美感和个性化，而不仅仅是技术参数的堆砌。',
    positionType: 'support',
    isAnonymous: false,
    sentimentScore: 0.7,
    qualityScore: 0.7,
    likeCount: 8,
    replyCount: 1,
    status: 'active',
    createdAt: new Date('2024-01-15T10:30:00')
  },
  
  // 话题2第1轮的评论
  {
    id: '2-1-1',
    topicId: '2',
    roundId: '2-1',
    userId: '2',
    user: mockUsers[1],
    content: 'AI绘画工具让我能够快速实现创意想法，大大提高了创作效率。但有时候缺乏那种"手工制作"的独特感。',
    positionType: 'support',
    isAnonymous: false,
    sentimentScore: 0.8,
    qualityScore: 0.9,
    likeCount: 12,
    replyCount: 3,
    status: 'active',
    createdAt: new Date('2024-01-14T09:20:00')
  },
  {
    id: '2-1-2',
    topicId: '2',
    roundId: '2-1',
    userId: '4',
    user: mockUsers[3],
    content: '作为传统画家，我认为AI创作缺乏灵魂和情感深度。它只是模式的重复，而不是真正的艺术创作。',
    positionType: 'oppose',
    isAnonymous: false,
    sentimentScore: 0.4,
    qualityScore: 0.8,
    likeCount: 7,
    replyCount: 5,
    status: 'active',
    createdAt: new Date('2024-01-14T09:45:00')
  }
]

// 获取话题的完整数据（包括轮次和评论）
export const getTopicWithDetails = (topicId: string) => {
  const topic = mockTopics.find(t => t.id === topicId)
  if (!topic) return null
  
  const rounds = mockRounds.filter(r => r.topicId === topicId)
  const comments = mockComments.filter(c => c.topicId === topicId)
  
  return {
    ...topic,
    rounds: rounds.map(round => ({
      ...round,
      comments: comments.filter(c => c.roundId === round.id)
    }))
  }
}

// 获取所有话题的完整数据
export const getAllTopicsWithDetails = () => {
  return mockTopics.map(topic => getTopicWithDetails(topic.id)!)
}