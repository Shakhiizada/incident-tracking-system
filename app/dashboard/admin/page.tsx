import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, AlertTriangle, Shield, Database, Activity } from "lucide-react"

export default async function AdminPage() {
  const supabase = await createClient()
  
  const { data: incidents } = await supabase.from("incidents").select("*")
  const { data: teamMembers } = await supabase.from("team_members").select("*")

  const stats = {
    totalIncidents: incidents?.length || 0,
    openIncidents: incidents?.filter(i => i.status === "open").length || 0,
    criticalIncidents: incidents?.filter(i => i.priority === "critical").length || 0,
    totalUsers: teamMembers?.length || 0,
    activeUsers: teamMembers?.filter(m => m.is_active).length || 0,
    admins: teamMembers?.filter(m => m.role === "admin").length || 0,
  }

  const recentIncidents = incidents
    ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5) || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Администрирование</h2>
        <p className="text-muted-foreground">Панель управления системой</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего инцидентов</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.openIncidents} открытых
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Критических</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.criticalIncidents}</div>
            <p className="text-xs text-muted-foreground">Требуют внимания</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeUsers} активных
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Администраторов</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
            <p className="text-xs text-muted-foreground">С полным доступом</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              <CardTitle>Системная активность</CardTitle>
            </div>
            <CardDescription>Последние действия в системе</CardDescription>
          </CardHeader>
          <CardContent>
            {recentIncidents.length > 0 ? (
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{incident.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(incident.created_at).toLocaleString("ru-RU")}
                      </p>
                    </div>
                    <Badge 
                      variant={
                        incident.priority === "critical" ? "destructive" : 
                        incident.priority === "high" ? "default" : "secondary"
                      }
                    >
                      {incident.priority === "critical" && "Критический"}
                      {incident.priority === "high" && "Высокий"}
                      {incident.priority === "medium" && "Средний"}
                      {incident.priority === "low" && "Низкий"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Нет активности</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>Статус системы</CardTitle>
            </div>
            <CardDescription>Состояние компонентов системы</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">База данных</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">Работает</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Аутентификация</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">Работает</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">API</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">Работает</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-sm">Уведомления</span>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">Работает</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
