'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Shield, AlertCircle, CheckCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const supabase = createClient()
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (signInError) {
        // Handle specific error messages in Russian
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Неверный email или пароль. Проверьте данные и попробуйте снова.')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Email не подтвержден. Проверьте вашу почту для подтверждения.')
        } else if (signInError.message.includes('rate limit')) {
          setError('Слишком много попыток входа. Подождите несколько минут.')
        } else if (signInError.message.includes('User not found')) {
          setError('Пользователь не найден. Проверьте email или зарегистрируйтесь.')
        } else {
          setError(signInError.message)
        }
        return
      }

      if (data?.session) {
        setSuccess('Вход выполнен успешно! Перенаправление...')
        
        // Force refresh to update auth state
        router.refresh()
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 500)
      }
    } catch (err) {
      setError('Произошла неожиданная ошибка. Попробуйте позже.')
      console.error('[v0] Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/50 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">IncidentTracker</span>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Вход в систему</CardTitle>
              <CardDescription>
                Введите email и пароль для входа
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@email.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Введите пароль"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      autoComplete="current-password"
                    />
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  {success && (
                    <div className="flex items-center gap-2 rounded-md bg-green-500/10 p-3 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>{success}</span>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Вход...' : 'Войти'}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Нет аккаунта?{' '}
                  <Link
                    href="/auth/sign-up"
                    className="underline underline-offset-4"
                  >
                    Зарегистрироваться
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:underline">
              Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
