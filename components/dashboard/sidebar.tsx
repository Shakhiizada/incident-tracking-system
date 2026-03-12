"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  BarChart3,
  Search,
  PlusCircle,
  User,
  Settings,
  ShieldCheck,
  Shield,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface DashboardSidebarProps {
  user: User
}

const menuItems = [
  {
    title: "Главное",
    items: [
      { name: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
      { name: "Инциденты", href: "/dashboard/incidents", icon: AlertTriangle },
      { name: "Команда", href: "/dashboard/team", icon: Users },
      { name: "Отчеты", href: "/dashboard/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Действия",
    items: [
      { name: "Поиск", href: "/dashboard/search", icon: Search },
      { name: "Новый инцидент", href: "/dashboard/incidents/new", icon: PlusCircle },
    ],
  },
  {
    title: "Настройки",
    items: [
      { name: "Профиль", href: "/dashboard/profile", icon: User },
      { name: "Настройки", href: "/dashboard/settings", icon: Settings },
      { name: "Администрирование", href: "/dashboard/admin", icon: ShieldCheck },
    ],
  },
]

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold">IncidentTracker</span>
        </div>

        <nav className="flex-1 space-y-6 p-4">
          {menuItems.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">{user.user_metadata?.full_name || "Пользователь"}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
