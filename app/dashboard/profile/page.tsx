"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Calendar } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export default function ProfilePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setFullName(user.user_metadata?.full_name || "")
      }
    }
    loadUser()
  }, [])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      })

      if (error) throw error
      setMessage({ type: "success", text: "Профиль успешно обновлен" })
    } catch (err) {
      setMessage({ 
        type: "error", 
        text: err instanceof Error ? err.message : "Произошла ошибка" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Профиль</h2>
        <p className="text-muted-foreground">Управление вашим профилем</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Аватар</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <p className="mt-4 font-medium">{user.user_metadata?.full_name || "Пользователь"}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Информация профиля</CardTitle>
            <CardDescription>Обновите данные вашего профиля</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Полное имя</Label>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ваше имя"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input value={user.email || ""} disabled className="bg-muted" />
                </div>
                <p className="text-xs text-muted-foreground">Email нельзя изменить</p>
              </div>

              <div className="space-y-2">
                <Label>Дата регистрации</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    value={new Date(user.created_at).toLocaleDateString("ru-RU")} 
                    disabled 
                    className="bg-muted" 
                  />
                </div>
              </div>

              {message && (
                <p className={`text-sm ${message.type === "success" ? "text-green-600" : "text-destructive"}`}>
                  {message.text}
                </p>
              )}

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
