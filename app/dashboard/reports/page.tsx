import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export default async function ReportsPage() {
  const supabase = await createClient()
  
  const { data: incidents } = await supabase
    .from("incidents")
    .select("*")

  const stats = {
    total: incidents?.length || 0,
    open: incidents?.filter(i => i.status === "open").length || 0,
    inProgress: incidents?.filter(i => i.status === "in_progress").length || 0,
    resolved: incidents?.filter(i => i.status === "resolved").length || 0,
    closed: incidents?.filter(i => i.status === "closed").length || 0,
    critical: incidents?.filter(i => i.priority === "critical").length || 0,
    high: incidents?.filter(i => i.priority === "high").length || 0,
    medium: incidents?.filter(i => i.priority === "medium").length || 0,
    low: incidents?.filter(i => i.priority === "low").length || 0,
  }

  const categoryStats = {
    security: incidents?.filter(i => i.category === "security").length || 0,
    network: incidents?.filter(i => i.category === "network").length || 0,
    hardware: incidents?.filter(i => i.category === "hardware").length || 0,
    software: incidents?.filter(i => i.category === "software").length || 0,
    access: incidents?.filter(i => i.category === "access").length || 0,
    other: incidents?.filter(i => i.category === "other").length || 0,
  }

  const resolvedRate = stats.total > 0 
    ? Math.round(((stats.resolved + stats.closed) / stats.total) * 100) 
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Отчеты</h2>
        <p className="text-muted-foreground">Статистика и аналитика по инцидентам</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего инцидентов</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">За все время</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Решено</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.resolved + stats.closed}</div>
            <p className="text-xs text-muted-foreground">Успешно закрыто</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.open + stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Активных инцидентов</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Показатель решения</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedRate}%</div>
            <p className="text-xs text-muted-foreground">Процент решенных</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>По приоритету</CardTitle>
            <CardDescription>Распределение инцидентов по приоритету</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Критический</span>
                </div>
                <span className="font-medium">{stats.critical}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500" />
                  <span className="text-sm">Высокий</span>
                </div>
                <span className="font-medium">{stats.high}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span className="text-sm">Средний</span>
                </div>
                <span className="font-medium">{stats.medium}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="text-sm">Низкий</span>
                </div>
                <span className="font-medium">{stats.low}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>По категории</CardTitle>
            <CardDescription>Распределение инцидентов по категории</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Безопасность</span>
                <span className="font-medium">{categoryStats.security}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Сеть</span>
                <span className="font-medium">{categoryStats.network}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Оборудование</span>
                <span className="font-medium">{categoryStats.hardware}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">ПО</span>
                <span className="font-medium">{categoryStats.software}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Доступ</span>
                <span className="font-medium">{categoryStats.access}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Другое</span>
                <span className="font-medium">{categoryStats.other}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>По статусу</CardTitle>
            <CardDescription>Текущее состояние инцидентов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Открытые</span>
                </div>
                <span className="font-medium">{stats.open}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">В работе</span>
                </div>
                <span className="font-medium">{stats.inProgress}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Решенные</span>
                </div>
                <span className="font-medium">{stats.resolved}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Закрытые</span>
                </div>
                <span className="font-medium">{stats.closed}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
