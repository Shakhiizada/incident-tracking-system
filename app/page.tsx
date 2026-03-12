import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, AlertTriangle, Users, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">IncidentTracker</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Войти</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Регистрация</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
              Система управления инцидентами
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
              Отслеживайте, управляйте и решайте инциденты эффективно. 
              Полный контроль над безопасностью вашей организации.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/sign-up">
                <Button size="lg" className="min-w-[200px]">
                  Начать бесплатно
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="min-w-[200px]">
                  Войти в систему
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-muted/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Возможности системы
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <AlertTriangle className="mb-4 h-10 w-10 text-destructive" />
                <h3 className="mb-2 text-lg font-semibold">Управление инцидентами</h3>
                <p className="text-sm text-muted-foreground">
                  Создавайте, отслеживайте и решайте инциденты в реальном времени
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <Users className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">Командная работа</h3>
                <p className="text-sm text-muted-foreground">
                  Назначайте задачи и координируйте действия команды
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <BarChart3 className="mb-4 h-10 w-10 text-chart-1" />
                <h3 className="mb-2 text-lg font-semibold">Отчеты и аналитика</h3>
                <p className="text-sm text-muted-foreground">
                  Получайте детальную статистику и отчеты по инцидентам
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-6">
                <Shield className="mb-4 h-10 w-10 text-chart-2" />
                <h3 className="mb-2 text-lg font-semibold">Безопасность</h3>
                <p className="text-sm text-muted-foreground">
                  Полная защита данных и контроль доступа
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>2025 IncidentTracker. Система управления инцидентами.</p>
        </div>
      </footer>
    </div>
  )
}
