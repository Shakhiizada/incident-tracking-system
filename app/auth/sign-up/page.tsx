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
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Shield, AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react'
import { signUp } from '../actions'

export default function SignUpPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setError(null)
    setSuccess(null)

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }

    startTransition(async () => {
      const result = await signUp(formData)

      if (result.error) {
        // Translate common errors to Russian
        if (result.error.includes('Password')) {
          setError('Пароль слишком слабый. Используйте минимум 6 символов.')
        } else if (result.error.includes('email') || result.error.includes('Email')) {
          setError('Неверный формат email или этот email уже зарегистрирован.')
        } else if (result.error.includes('rate limit')) {
          setError('Слишком много попыток. Подождите несколько минут.')
        } else if (result.error.includes('fetch') || result.error.includes('ENOTFOUND') || result.error.includes('network')) {
          setError('Ошибка подключения к серверу. Пожалуйста, подождите минуту и попробуйте снова.')
        } else {
          setError(result.error)
        }
        return
      }

      if (result.success) {
        if (result.needsEmailConfirmation) {
          setSuccess('Регистрация успешна! Проверьте вашу почту для подтверждения.')
          setTimeout(() => {
            router.push('/auth/sign-up-success')
          }, 2000)
        } else {
          setSuccess('Регистрация успешна! Перенаправление...')
          router.refresh()
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
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
              <CardTitle className="text-2xl">Регистрация</CardTitle>
              <CardDescription>
                Создайте аккаунт для доступа к системе
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={handleSubmit}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Полное имя</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Иван Иванов"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      required
                      disabled={isPending}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Минимум 6 символов"
                        required
                        minLength={6}
                        disabled={isPending}
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
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Повторите пароль"
                        required
                        minLength={6}
                        disabled={isPending}
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
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
                  
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Регистрация...
                      </>
                    ) : (
                      'Зарегистрироваться'
                    )}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Уже есть аккаунт?{' '}
                  <Link
                    href="/auth/login"
                    className="underline underline-offset-4"
                  >
                    Войти
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
