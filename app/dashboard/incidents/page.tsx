import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, AlertTriangle } from "lucide-react"

export default async function IncidentsPage() {
  const supabase = await createClient()
  
  const { data: incidents } = await supabase
    .from("incidents")
    .select("*")
    .order("created_at", { ascending: false })

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
      case "open": return "bg-red-100 text-red-800 hover:bg-red-100"
      case "in_progress": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "resolved": return "bg-green-100 text-green-800 hover:bg-green-100"
      case "closed": return "bg-gray-100 text-gray-800 hover:bg-gray-100"
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Инциденты</h2>
          <p className="text-muted-foreground">Управление инцидентами</p>
        </div>
        <Link href="/dashboard/incidents/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Новый инцидент
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Все инциденты</CardTitle>
          <CardDescription>Список всех зарегистрированных инцидентов</CardDescription>
        </CardHeader>
        <CardContent>
          {incidents && incidents.length > 0 ? (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <Link
                  key={incident.id}
                  href={`/dashboard/incidents/${incident.id}`}
                  className="block rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold">{incident.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {incident.description || "Нет описания"}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Создан: {new Date(incident.created_at).toLocaleDateString("ru-RU")}</span>
                        {incident.category && (
                          <>
                            <span>•</span>
                            <span>{incident.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant={getPriorityBadge(incident.priority) as "destructive" | "default" | "secondary" | "outline"}>
                        {getPriorityLabel(incident.priority)}
                      </Badge>
                      <Badge className={getStatusBadge(incident.status)}>
                        {getStatusLabel(incident.status)}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Инцидентов нет</h3>
              <p className="mb-4 text-muted-foreground">Создайте первый инцидент для начала работы</p>
              <Link href="/dashboard/incidents/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Создать инцидент
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
