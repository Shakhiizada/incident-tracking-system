'use client'

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
import { useState, useTransition } from 'react'
import { Shield, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { signIn } from '../actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setError(null)

    startTransition(async () => {
      const result = await signIn(formData)

      if (result?.error) {
        // Translate common errors to Russian
        if (result.error.includes('Invalid login credentials')) {
          setError('Неверный email или пароль. Проверьте данные и попробуйте снова.')
        } else if (result.error.includes('Email not confirmed')) {
          setError('Email не подтвержден. Проверьте вашу почту для подтверждения.')
        } else if (result.error.includes('rate limit')) {
          setError('Слишком много попыток входа. Подождите несколько минут.')
        } else if (result.error.includes('User not found')) {
          setError('Пользователь не найден. Проверьте email или зарегистрируйтесь.')
        } else if (result.error.includes('fetch') || result.error.includes('ENOTFOUND') || result.error.includes('подключения')) {
          setError('Ошибка подключения к серверу. Пожалуйста, подождите минуту и попробуйте снова.')
        } else {
          setError(result.error)
        }
      }
    })
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
              <form action={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      required
                      disabled={isPending}
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Введите пароль"
                        required
                        disabled={isPending}
                        autoComplete="current-password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Вход...
                      </>
                    ) : (
                      'Войти'
                    )}
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
