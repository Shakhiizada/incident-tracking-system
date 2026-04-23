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

export default function SignUpPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const validatePassword = (pass: string): string | null => {
    if (pass.length < 6) {
      return 'Пароль должен содержать минимум 6 символов'
    }
    return null
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Пароли не совпадают')
      setIsLoading(false)
      return
    }

    // Validate password strength
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName.trim(),
          },
        },
      })

      if (signUpError) {
        // Handle specific error messages
        if (signUpError.message.includes('Password')) {
          setError('Пароль слишком слабый. Используйте минимум 6 символов, включая буквы и цифры.')
        } else if (signUpError.message.includes('email')) {
          setError('Неверный формат email или этот email уже зарегистрирован.')
        } else if (signUpError.message.includes('rate limit')) {
          setError('Слишком много попыток. Подождите несколько минут.')
        } else {
          setError(signUpError.message)
        }
        return
      }

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        setError('Этот email уже зарегистрирован. Попробуйте войти.')
        return
      }

      // Check if user needs to confirm email
      if (data?.user && !data?.session) {
        setSuccess('Регистрация успешна! Проверьте вашу почту для подтверждения.')
        setTimeout(() => {
          router.push('/auth/sign-up-success')
        }, 2000)
      } else if (data?.session) {
        // User is automatically signed in (email confirmation disabled)
        setSuccess('Регистрация успешна! Перенаправление...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (err) {
      setError('Произошла неожиданная ошибка. Попробуйте позже.')
      console.error('[v0] Sign up error:', err)
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
              <CardTitle className="text-2xl">Регистрация</CardTitle>
              <CardDescription>
                Создайте аккаунт для доступа к системе
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Полное имя</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Иван Иванов"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
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
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Минимум 6 символов"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Повторите пароль"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
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
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
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
