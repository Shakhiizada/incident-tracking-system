"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Bell, Globe, Shield, Moon } from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newIncident: true,
    statusChange: true,
    comments: false,
  })

  const [language, setLanguage] = useState("ru")
  const [theme, setTheme] = useState("system")
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Имитация сохранения
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Настройки</h2>
        <p className="text-muted-foreground">Управление настройками приложения</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Уведомления</CardTitle>
            </div>
            <CardDescription>Настройте способы получения уведомлений</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email-уведомления</Label>
                <p className="text-sm text-muted-foreground">Получать уведомления на email</p>
              </div>
              <Switch
                id="email-notifications"
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="push-notifications">Push-уведомления</Label>
                <p className="text-sm text-muted-foreground">Получать push-уведомления в браузере</p>
              </div>
              <Switch
                id="push-notifications"
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-incident">Новые инциденты</Label>
                <p className="text-sm text-muted-foreground">Уведомлять о новых инцидентах</p>
              </div>
              <Switch
                id="new-incident"
                checked={notifications.newIncident}
                onCheckedChange={(checked) => setNotifications({ ...notifications, newIncident: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="status-change">Изменение статуса</Label>
                <p className="text-sm text-muted-foreground">Уведомлять об изменении статуса инцидентов</p>
              </div>
              <Switch
                id="status-change"
                checked={notifications.statusChange}
                onCheckedChange={(checked) => setNotifications({ ...notifications, statusChange: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="comments">Комментарии</Label>
                <p className="text-sm text-muted-foreground">Уведомлять о новых комментариях</p>
              </div>
              <Switch
                id="comments"
                checked={notifications.comments}
                onCheckedChange={(checked) => setNotifications({ ...notifications, comments: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <CardTitle>Язык и регион</CardTitle>
            </div>
            <CardDescription>Настройки языка интерфейса</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Язык интерфейса</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ru">Русский</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="kk">Қазақша</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              <CardTitle>Внешний вид</CardTitle>
            </div>
            <CardDescription>Настройки темы приложения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Тема</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-full max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Светлая</SelectItem>
                  <SelectItem value="dark">Темная</SelectItem>
                  <SelectItem value="system">Системная</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Безопасность</CardTitle>
            </div>
            <CardDescription>Настройки безопасности аккаунта</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">Изменить пароль</Button>
            <p className="text-sm text-muted-foreground">
              Рекомендуем менять пароль каждые 90 дней
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center gap-4">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Сохранение..." : "Сохранить настройки"}
          </Button>
          {saved && <span className="text-sm text-green-600">Настройки сохранены</span>}
        </div>
      </div>
    </div>
  )
}
