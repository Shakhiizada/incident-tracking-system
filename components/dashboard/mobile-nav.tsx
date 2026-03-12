"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
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
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface MobileNavProps {
  open: boolean
  onClose: () => void
  user: SupabaseUser
}

const menuItems = [
  { name: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
  { name: "Инциденты", href: "/dashboard/incidents", icon: AlertTriangle },
  { name: "Команда", href: "/dashboard/team", icon: Users },
  { name: "Отчеты", href: "/dashboard/reports", icon: BarChart3 },
  { name: "Поиск", href: "/dashboard/search", icon: Search },
  { name: "Новый инцидент", href: "/dashboard/incidents/new", icon: PlusCircle },
  { name: "Профиль", href: "/dashboard/profile", icon: User },
  { name: "Настройки", href: "/dashboard/settings", icon: Settings },
  { name: "Администрирование", href: "/dashboard/admin", icon: ShieldCheck },
]

export function MobileNav({ open, onClose, user }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            IncidentTracker
          </SheetTitle>
        </SheetHeader>
        <nav className="p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/dashboard" && pathname.startsWith(item.href))
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={onClose}
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
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
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
      </SheetContent>
    </Sheet>
  )
}
