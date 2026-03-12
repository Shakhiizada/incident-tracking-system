"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Incident {
  id: string
  title: string
  description: string
  status: string
  priority: string
  category: string
  created_at: string
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Incident[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsSearching(true)
    setHasSearched(true)
    const supabase = createClient()

    try {
      const { data } = await supabase
        .from("incidents")
        .select("*")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order("created_at", { ascending: false })

      setResults(data || [])
    } catch (err) {
      console.error("Search error:", err)
    } finally {
      setIsSearching(false)
    }
  }

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
      case "open": return "bg-red-100 text-red-800"
      case "in_progress": return "bg-yellow-100 text-yellow-800"
      case "resolved": return "bg-green-100 text-green-800"
      case "closed": return "bg-gray-100 text-gray-800"
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
      <div>
        <h2 className="text-2xl font-bold">Поиск</h2>
        <p className="text-muted-foreground">Поиск по инцидентам</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Поиск инцидентов</CardTitle>
          <CardDescription>Введите ключевые слова для поиска</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="Поиск по названию или описанию..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isSearching}>
              <Search className="mr-2 h-4 w-4" />
              {isSearching ? "Поиск..." : "Найти"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {hasSearched && (
        <Card>
          <CardHeader>
            <CardTitle>Результаты поиска</CardTitle>
            <CardDescription>
              Найдено {results.length} инцидентов по запросу "{query}"
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((incident) => (
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
                        <p className="mt-2 text-xs text-muted-foreground">
                          {new Date(incident.created_at).toLocaleDateString("ru-RU")}
                        </p>
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
                <h3 className="text-lg font-semibold">Ничего не найдено</h3>
                <p className="text-muted-foreground">Попробуйте изменить поисковый запрос</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
