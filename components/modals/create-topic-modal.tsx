"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import type { Topic } from "@/types"

interface CreateTopicModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (topic: Omit<Topic, "id" | "createdAt" | "participantCount" | "roundCount">) => void
}

export function CreateTopicModal({ open, onClose, onSubmit }: CreateTopicModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !description.trim()) return

    setIsSubmitting(true)

    try {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        status: "active",
        createdBy: "current-user",
        creatorId: "current-user-id",
        currentRound: 1,
        maxRounds: 3
      })

      // Reset form
      setTitle("")
      setDescription("")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发起新议题</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">议题标题</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="输入议题标题..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">议题描述</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="详细描述这个议题的背景和讨论方向..."
              rows={4}
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !description.trim()}>
              {isSubmitting ? "创建中..." : "发起议题"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
