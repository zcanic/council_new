"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, MessageCircle, Sparkles, Clock, Users } from "lucide-react"
import type { Round } from "@/lib/types"

interface RoundHistoryViewProps {
  rounds: Round[]
  onRoundSelect: (roundId: string) => void
  onClose: () => void
}

export function RoundHistoryView({ rounds, onRoundSelect, onClose }: RoundHistoryViewProps) {
  const [selectedRound, setSelectedRound] = useState<Round | null>(null)

  const handleRoundClick = (round: Round) => {
    setSelectedRound(round)
    onRoundSelect(round.id)
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-council-forest">讨论历史</h2>
            <p className="text-muted-foreground mt-1">查看所有轮次的讨论内容和AI总结</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rounds List */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-semibold text-council-forest mb-4">讨论轮次</h3>
            {rounds.map((round) => (
              <Card
                key={round.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedRound?.id === round.id
                    ? "ring-2 ring-council-sage bg-council-sage/5"
                    : "hover:bg-council-cream/30"
                }`}
                onClick={() => handleRoundClick(round)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">第 {round.roundNumber} 轮</CardTitle>
                    <Badge
                      variant={
                        round.status === "completed" ? "default" : round.status === "active" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {round.status === "completed" ? "已完成" : round.status === "active" ? "进行中" : "已锁定"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-3 h-3" />
                      <span>{round.comments.length} 条评论</span>
                    </div>
                    {round.aiSummary && (
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        <span>AI总结已生成</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(round.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Round Details */}
          <div className="lg:col-span-2">
            {selectedRound ? (
              <div className="space-y-6">
                {/* Round Header */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      第 {selectedRound.roundNumber} 轮讨论
                      <Badge variant="outline">{selectedRound.comments.length}/10 评论</Badge>
                    </CardTitle>
                  </CardHeader>
                </Card>

                {/* AI Summary */}
                {selectedRound.aiSummary && (
                  <Card className="bg-gradient-to-r from-council-sage/5 to-council-mint/5 border-council-sage/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-council-forest">
                        <Sparkles className="w-5 h-5" />
                        AI智慧总结
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-council-forest mb-2">核心共识</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {selectedRound.aiSummary.consensus.map((point, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-council-sage rounded-full mt-2 flex-shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-council-forest mb-2">主要分歧</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {selectedRound.aiSummary.disagreements.map((point, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-council-mint rounded-full mt-2 flex-shrink-0" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-council-forest mb-2">新提出的问题</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {selectedRound.aiSummary.newQuestions.map((question, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="w-1 h-1 bg-council-forest rounded-full mt-2 flex-shrink-0" />
                                {question}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Comments */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-council-forest">讨论内容</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRound.comments.map((comment) => (
                      <Card key={comment.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-council-sage/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-council-sage" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-sm text-council-forest">{comment.authorId}</span>
                                <Badge variant="outline" className="text-xs">
                                  #{comment.position}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">{comment.content}</p>
                              <div className="text-xs text-muted-foreground mt-2">
                                {new Date(comment.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Card className="h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>选择一个讨论轮次查看详细内容</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
