import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Shield } from "lucide-react"
import { AddTeamMember } from "@/components/dashboard/add-team-member"

export default async function TeamPage() {
  const supabase = await createClient()
  
  const { data: teamMembers } = await supabase
    .from("team_members")
    .select("*")
    .order("created_at", { ascending: false })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin": return "destructive"
      case "manager": return "default"
      case "member": return "secondary"
      default: return "outline"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin": return "Администратор"
      case "manager": return "Менеджер"
      case "member": return "Участник"
      default: return role
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Команда</h2>
          <p className="text-muted-foreground">Управление участниками команды</p>
        </div>
        <AddTeamMember />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего участников</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamMembers?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Администраторы</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers?.filter(m => m.role === "admin").length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активные</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamMembers?.filter(m => m.status === "active").length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Участники команды</CardTitle>
          <CardDescription>Список всех участников вашей команды</CardDescription>
        </CardHeader>
        <CardContent>
          {teamMembers && teamMembers.length > 0 ? (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {member.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getRoleBadge(member.role) as "destructive" | "default" | "secondary" | "outline"}>
                      {getRoleLabel(member.role)}
                    </Badge>
                    <Badge variant={member.status === "active" ? "default" : "secondary"}>
                      {member.status === "active" ? "Активен" : "Неактивен"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="text-lg font-semibold">Команда пуста</h3>
              <p className="mb-4 text-muted-foreground">Добавьте первого участника команды</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
