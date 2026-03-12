"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Incident {
  id: string
  status: string
  title: string
  description: string
  priority: string
  category: string
  user_id: string
}

export function IncidentActions({ incident }: { incident: Incident }) {
  const router = useRouter()
  const [status, setStatus] = useState(incident.status)
  const [comment, setComment] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("incidents")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", incident.id)

      if (error) throw error
      setStatus(newStatus)
      router.refresh()
    } catch (err) {
      console.error("Error updating status:", err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return
    setIsCommenting(true)
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Не авторизован")

      const { error } = await supabase
        .from("incident_comments")
        .insert({
          incident_id: incident.id,
          content: comment,
          user_id: user.id,
        })

      if (error) throw error
      setComment("")
      router.refresh()
    } catch (err) {
      console.error("Error adding comment:", err)
    } finally {
      setIsCommenting(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Действия</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Изменить статус</p>
            <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Открыт</SelectItem>
                <SelectItem value="in_progress">В работе</SelectItem>
                <SelectItem value="resolved">Решен</SelectItem>
                <SelectItem value="closed">Закрыт</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Добавить комментарий</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Напишите комментарий..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <Button 
            onClick={handleAddComment} 
            disabled={isCommenting || !comment.trim()}
            className="w-full"
          >
            {isCommenting ? "Отправка..." : "Отправить"}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
