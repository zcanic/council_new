"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, MessageSquare, Users, Sparkles, Clock } from "lucide-react"
import type { RealtimeEvent } from "@/lib/realtime-service"

interface ActivityFeedProps {
  events: RealtimeEvent[]
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  const getEventIcon = (type: RealtimeEvent["type"]) => {
    switch (type) {
      case "comment_added":
        return <MessageSquare className="w-3 h-3" />
      case "user_joined":
      case "user_left":
        return <Users className="w-3 h-3" />
      case "summary_generated":
        return <Sparkles className="w-3 h-3" />
      default:
        return <Activity className="w-3 h-3" />
    }
  }

  const getEventText = (event: RealtimeEvent) => {
    switch (event.type) {
      case "comment_added":
        return "添加了新评论"
      case "user_joined":
        return `${event.data.userName} 加入了讨论`
      case "user_left":
        return `${event.data.userName} 离开了讨论`
      case "typing_start":
        return `${event.data.userName} 开始输入`
      case "typing_stop":
        return `${event.data.userName} 停止输入`
      case "round_completed":
        return `第 ${event.data.roundNumber} 轮讨论完成`
      case "summary_generated":
        return "生成了智慧蒸馏摘要"
      default:
        return "未知活动"
    }
  }

  const getEventColor = (type: RealtimeEvent["type"]) => {
    switch (type) {
      case "comment_added":
        return "bg-blue-100 text-blue-800"
      case "user_joined":
        return "bg-green-100 text-green-800"
      case "user_left":
        return "bg-gray-100 text-gray-800"
      case "summary_generated":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-council-mint/20 text-council-sage"
    }
  }

  if (events.length === 0) {
    return (
      <Card className="border-council-sage/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-council-charcoal">
            <Activity className="w-4 h-4" />
            实时动态
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-council-sage/60 text-center py-4">暂无活动</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-council-sage/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm text-council-charcoal">
          <Activity className="w-4 h-4" />
          实时动态
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {events.map((event, index) => (
              <div key={`${event.timestamp.getTime()}-${index}`} className="flex items-center gap-2 text-xs">
                <Badge className={`${getEventColor(event.type)} px-1.5 py-0.5`}>{getEventIcon(event.type)}</Badge>

                <span className="flex-1 text-council-sage/80">{getEventText(event)}</span>

                <div className="flex items-center gap-1 text-council-sage/50">
                  <Clock className="w-3 h-3" />
                  {event.timestamp.toLocaleTimeString("zh-CN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
