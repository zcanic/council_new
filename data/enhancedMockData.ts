import { Topic, DiscussionRound, Comment, User, AISummary } from '@/types'
import { mockUsers, mockTopics, mockRounds, mockComments } from './mockData'

// 扩展的AI总结数据 - 展示多轮总结功能
export const enhancedAISummaries: AISummary[] = [
  // 话题1 - 猫的光学构造 (3轮讨论)
  {
    id: 'summary-1-1',
    topicId: '1',
    roundId: '1-1',
    content: '第一轮讨论主要围绕猫眼的基本光学原理展开。参与者普遍认为猫眼的夜视能力源于其特殊的视网膜结构和瞳孔调节机制。关键共识包括：1) 猫眼拥有更多的视杆细胞，2) 瞳孔可大幅扩张增加进光量，3) 反光膜(tapetum lucidum)增强光线利用。主要分歧在于这种结构是否适合直接应用于摄影系统。',
    consensus: [
      '猫眼夜视能力主要依赖视网膜结构和瞳孔调节',
      '视杆细胞数量和反光膜是关键技术因素',
      '瞳孔扩张机制对低光环境适应性至关重要'
    ],
    disagreements: [
      '光学结构直接移植到摄影系统的可行性',
      '生物结构与机械系统的兼容性程度'
    ],
    newQuestions: [
      '如何平衡光学性能与系统体积？',
      '生物仿生学在工程应用中的限制有哪些？'
    ],
    sentimentScore: 0.8,
    clarityScore: 0.9,
    generatedAt: new Date('2024-01-15T14:30:00'),
    modelVersion: 'gpt-4-turbo'
  },
  {
    id: 'summary-1-2',
    topicId: '1',
    roundId: '1-2',
    content: '第二轮讨论深入探讨了技术实现路径。共识集中在分层仿生设计：表层光学模仿猫眼结构，中层图像处理算法，底层硬件优化。参与者认同需要多学科协作，但在商业化时间线上存在分歧。伦理方面开始浮现关于生物技术应用的担忧。',
    consensus: [
      '需要分层设计 approach: 光学+算法+硬件',
      '多学科协作是成功关键',
      '渐进式开发比一步到位更可行'
    ],
    disagreements: [
      '商业化时间线: 3年 vs 8年',
      '技术优先还是伦理考量优先'
    ],
    newQuestions: [
      '如何建立跨学科协作机制？',
      '伦理审查标准应该如何制定？'
    ],
    sentimentScore: 0.7,
    clarityScore: 0.85,
    generatedAt: new Date('2024-01-16T11:15:00'),
    modelVersion: 'gpt-4-turbo'
  },
  
  // 话题2 - AI与创意产业 (4轮讨论)
  {
    id: 'summary-2-1',
    topicId: '2',
    roundId: '2-1',
    content: '第一轮讨论呈现明显两极分化。技术乐观派认为AI将解放创作者，提供无限灵感；传统派担忧艺术灵魂的丧失。共识是AI工具已经不可逆转地改变了创作生态，但对其最终影响程度存在深刻分歧。',
    consensus: [
      'AI工具已成为创作生态的一部分',
      '技术发展不可逆转，需要适应而非抵制',
      '不同艺术形式受AI影响程度不同'
    ],
    disagreements: [
      'AI创作是否具有真正的艺术价值',
      '人类创作者的核心竞争力是否会丧失'
    ],
    newQuestions: [
      '如何定义AI时代的艺术原创性？',
      '创作者需要哪些新技能来保持竞争力？'
    ],
    sentimentScore: 0.6,
    clarityScore: 0.88,
    generatedAt: new Date('2024-01-14T15:45:00'),
    modelVersion: 'gpt-4-turbo'
  },
  {
    id: 'summary-2-2',
    topicId: '2',
    roundId: '2-2',
    content: '第二轮讨论开始探索中间道路。参与者认同AI作为协作工具的价值，而非替代品。共识包括：1) AI擅长模式生成和效率提升，2) 人类负责情感表达和概念创新，3) 需要新的版权和认证体系。分歧在于具体实施路径和监管程度。',
    consensus: [
      '人机协作是未来主流模式',
      'AI处理重复性工作，人类专注创造性决策',
      '需要建立新的知识产权框架'
    ],
    disagreements: [
      '监管力度: 严格限制 vs 自由发展',
      '教育体系应该如何适应这种变化'
    ],
    newQuestions: [
      '如何培养AI时代的创意人才？',
      '协作工具的标准和接口应该如何设计？'
    ],
    sentimentScore: 0.75,
    clarityScore: 0.92,
    generatedAt: new Date('2024-01-15T10:30:00'),
    modelVersion: 'gpt-4-turbo'
  },
  {
    id: 'summary-2-3',
    topicId: '2',
    roundId: '2-3',
    content: '第三轮讨论达成突破性共识：AI不是创作的终点，而是新的起点。参与者一致认为最价值的方向是开发增强人类创造力的工具，而非完全自主的创作系统。伦理框架和透明度成为共同关注点。',
    consensus: [
      '增强型工具比自主系统更有价值',
      '透明度和可解释性至关重要',
      '需要行业自律和标准制定'
    ],
    disagreements: [
      '商业化模式: 订阅制 vs 一次性购买',
      '开源与专有技术的平衡'
    ],
    newQuestions: [
      '如何衡量AI工具的创造力增强效果？',
      '跨国界的伦理标准如何协调？'
    ],
    sentimentScore: 0.85,
    clarityScore: 0.95,
    generatedAt: new Date('2024-01-16T16:20:00'),
    modelVersion: 'gpt-4-turbo'
  },

  // 话题3 - 可持续发展城市规划 (2轮讨论)
  {
    id: 'summary-3-1',
    topicId: '3',
    roundId: '3-1',
    content: '第一轮讨论识别了城市可持续发展的关键挑战：交通拥堵、能源消耗、绿地减少。共识包括需要系统性思维和多利益相关方参与。技术解决方案得到广泛认可，但实施路径存在分歧。',
    consensus: [
      '系统性思维是解决复杂城市问题的关键',
      '技术创新在节能和交通优化中作用重大',
      '社区参与是长期成功的基础'
    ],
    disagreements: [
      '优先投资领域: 交通 vs 能源 vs 绿地',
      '政府主导还是市场驱动'
    ],
    newQuestions: [
      '如何量化可持续发展项目的综合效益？',
      '不同规模城市的适用策略有何差异？'
    ],
    sentimentScore: 0.78,
    clarityScore: 0.87,
    generatedAt: new Date('2024-01-13T17:30:00'),
    modelVersion: 'gpt-4-turbo'
  }
]

// 扩展的讨论轮次数据
export const enhancedRounds: DiscussionRound[] = [
  ...mockRounds,
  // 为话题1添加第三轮
  {
    id: '1-3',
    topicId: '1',
    roundNumber: 3,
    title: '伦理框架与实施路线图',
    description: '在前两轮技术讨论基础上，制定具体的实施计划和伦理准则',
    status: 'active',
    createdAt: new Date('2024-01-17T09:00:00'),
    commentCount: 8,
    participantCount: 10,
    isCurrent: true
  },
  // 为话题2添加第四轮
  {
    id: '2-4',
    topicId: '2',
    roundNumber: 4,
    title: '行动计划与合作伙伴',
    description: '将共识转化为具体行动计划，识别关键合作伙伴和资源需求',
    status: 'active',
    createdAt: new Date('2024-01-17T10:30:00'),
    commentCount: 6,
    participantCount: 12,
    isCurrent: true
  },
  // 为话题3添加第二轮
  {
    id: '3-2',
    topicId: '3',
    roundNumber: 2,
    title: '具体实施方案',
    description: '基于第一轮共识，制定具体的城市更新和技术实施计划',
    status: 'active',
    createdAt: new Date('2024-01-14T14:00:00'),
    commentCount: 9,
    participantCount: 8,
    isCurrent: true
  }
]

// 扩展的评论数据
export const enhancedComments: Comment[] = [
  ...mockComments,
  // 话题1第三轮评论
  {
    id: '1-3-1',
    topicId: '1',
    roundId: '1-3',
    userId: '1',
    user: mockUsers[0],
    content: '建议成立跨学科伦理委员会，包括生物学家、工程师、伦理学家和社会学家',
    positionType: 'support',
    isAnonymous: false,
    sentimentScore: 0.9,
    qualityScore: 0.95,
    likeCount: 12,
    replyCount: 3,
    status: 'active',
    createdAt: new Date('2024-01-17T09:15:00')
  },
  {
    id: '1-3-2',
    topicId: '1',
    roundId: '1-3',
    userId: '3',
    user: mockUsers[2],
    content: '应该分阶段推进：1-2年基础研究，3-5年原型开发，5-8年商业化试点',
    positionType: 'support',
    isAnonymous: false,
    sentimentScore: 0.85,
    qualityScore: 0.9,
    likeCount: 8,
    replyCount: 2,
    status: 'active',
    createdAt: new Date('2024-01-17T09:30:00')
  },

  // 话题2第四轮评论
  {
    id: '2-4-1',
    topicId: '2',
    roundId: '2-4',
    userId: '2',
    user: mockUsers[1],
    content: '建议与艺术院校合作开发AI创作课程，培养新一代数字艺术家',
    positionType: 'support',
    isAnonymous: false,
    sentimentScore: 0.92,
    qualityScore: 0.88,
    likeCount: 15,
    replyCount: 4,
    status: 'active',
    createdAt: new Date('2024-01-17T10:45:00')
  },
  {
    id: '2-4-2',
    topicId: '2',
    roundId: '2-4',
    userId: '5',
    user: mockUsers[4],
    content: '需要建立行业标准认证，确保AI工具的质量和伦理合规性',
    positionType: 'support',
    isAnonymous: false,
    sentimentScore: 0.88,
    qualityScore: 0.93,
    likeCount: 9,
    replyCount: 3,
    status: 'active',
    createdAt: new Date('2024-01-17T11:00:00')
  }
]

// 增强的获取话题详情函数
export const getEnhancedTopicWithDetails = (topicId: string) => {
  const topic = mockTopics.find(t => t.id === topicId)
  if (!topic) return null
  
  const rounds = enhancedRounds.filter(r => r.topicId === topicId)
  const comments = enhancedComments.filter(c => c.topicId === topicId)
  const summaries = enhancedAISummaries.filter(s => s.topicId === topicId)

  return {
    ...topic,
    rounds: rounds.map(round => ({
      ...round,
      comments: comments.filter(c => c.roundId === round.id),
      summary: summaries.find(s => s.roundId === round.id)
    })),
    summaries
  }
}

// 获取所有增强话题数据
export const getAllEnhancedTopicsWithDetails = () => {
  return mockTopics.map(topic => getEnhancedTopicWithDetails(topic.id)!)
}

// 获取特定轮次的AI总结
export const getRoundSummary = (roundId: string) => {
  return enhancedAISummaries.find(summary => summary.roundId === roundId)
}

// 获取话题的所有AI总结历史
export const getTopicSummaryHistory = (topicId: string) => {
  return enhancedAISummaries
    .filter(summary => summary.topicId === topicId)
    .sort((a, b) => new Date(a.generatedAt!).getTime() - new Date(b.generatedAt!).getTime())
}