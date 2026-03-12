import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: incidents } = await supabase
    .from("incidents")
    .select("*")
    .order("created_at", { ascending: false })

  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("*")

  const stats = {
    total: incidents?.length || 0,
    open: incidents?.filter(i => i.status === "open").length || 0,
    inProgress: incidents?.filter(i => i.status === "in_progress").length || 0,
    resolved: incidents?.filter(i => i.status === "resolved").length || 0,
    teamSize: teamMembers?.length || 0,
  }

  const recentIncidents = incidents?.slice(0, 5) || []

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-500"
      case "high": return "text-orange-500"
      case "medium": return "text-yellow-500"
      case "low": return "text-green-500"
      default: return "text-muted-foreground"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800"
      case "in_progress": return "bg-yellow-100 text-yellow-800"
      case "resolved": return "bg-green-100 text-green-800"
      case "closed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Дашборд</h2>
          <p className="text-muted-foreground">Обзор состояния системы</p>
        </div>
        <Link href="/dashboard/incidents/new">
          <Button>Новый инцидент</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего инцидентов</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">За все время</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Открытые</CardTitle>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.open}</div>
            <p className="text-xs text-muted-foreground">Требуют внимания</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">В процессе решения</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Решенные</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Успешно закрыты</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Последние инциденты</CardTitle>
            <CardDescription>Недавно созданные инциденты</CardDescription>
          </CardHeader>
          <CardContent>
            {recentIncidents.length > 0 ? (
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <Link
                    key={incident.id}
                    href={`/dashboard/incidents/${incident.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-muted"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{incident.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(incident.created_at).toLocaleDateString("ru-RU")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getPriorityColor(incident.priority)}`}>
                        {incident.priority === "critical" && "Критический"}
                        {incident.priority === "high" && "Высокий"}
                        {incident.priority === "medium" && "Средний"}
                        {incident.priority === "low" && "Низкий"}
                      </span>
                      <span className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(incident.status)}`}>
                        {getStatusLabel(incident.status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="mb-2 h-10 w-10 text-muted-foreground" />
                <p className="text-muted-foreground">Инцидентов пока нет</p>
                <Link href="/dashboard/incidents/new">
                  <Button variant="link">Создать первый инцидент</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Команда</CardTitle>
            <CardDescription>Участники вашей команды</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.teamSize}</p>
                <p className="text-sm text-muted-foreground">Участников в команде</p>
              </div>
            </div>
            <div className="mt-4">
              <Link href="/dashboard/team">
                <Button variant="outline" className="w-full">Управление командой</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
