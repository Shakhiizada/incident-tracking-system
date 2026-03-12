import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Clock, User, Calendar } from "lucide-react"
import { IncidentActions } from "@/components/dashboard/incident-actions"

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: incident } = await supabase
    .from("incidents")
    .select("*")
    .eq("id", id)
    .single()

  if (!incident) {
    notFound()
  }

  const { data: comments } = await supabase
    .from("incident_comments")
    .select("*")
    .eq("incident_id", id)
    .order("created_at", { ascending: true })

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical": return "destructive"
      case "high": return "default"
      case "medium": return "secondary"
      case "low": return "outline"
      default: return "outline"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "critical": return "Критический"
      case "high": return "Высокий"
      case "medium": return "Средний"
      case "low": return "Низкий"
      default: return priority
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800"
      case "in_progress": return "bg-yellow-100 text-yellow-800"
      case "resolved": return "bg-green-100 text-green-800"
      case "closed": return "bg-gray-100 text-gray-800"
      default: return ""
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open": return "Открыт"
      case "in_progress": return "В работе"
      case "resolved": return "Решен"
      case "closed": return "Закрыт"
      default: return status
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "security": return "Безопасность"
      case "network": return "Сеть"
      case "hardware": return "Оборудование"
      case "software": return "ПО"
      case "access": return "Доступ"
      case "other": return "Другое"
      default: return category
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/incidents">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{incident.title}</h2>
          <p className="text-muted-foreground">Инцидент #{incident.id.slice(0, 8)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={getPriorityBadge(incident.priority) as "destructive" | "default" | "secondary" | "outline"}>
            {getPriorityLabel(incident.priority)}
          </Badge>
          <Badge className={getStatusBadge(incident.status)}>
            {getStatusLabel(incident.status)}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Описание</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">
                {incident.description || "Нет описания"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Комментарии</CardTitle>
              <CardDescription>История обсуждения инцидента</CardDescription>
            </CardHeader>
            <CardContent>
              {comments && comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg border border-border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Комментарий</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleString("ru-RU")}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Комментариев пока нет</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Детали</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Создан</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(incident.created_at).toLocaleString("ru-RU")}
                  </p>
                </div>
              </div>
              {incident.updated_at && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Обновлен</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(incident.updated_at).toLocaleString("ru-RU")}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Категория</p>
                  <p className="text-sm text-muted-foreground">
                    {getCategoryLabel(incident.category)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <IncidentActions incident={incident} />
        </div>
      </div>
    </div>
  )
}
