import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Shield, Mail } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/50 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">IncidentTracker</span>
          </div>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Проверьте почту</CardTitle>
              <CardDescription>
                Мы отправили письмо с ссылкой для подтверждения
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-sm text-muted-foreground">
                Перейдите по ссылке в письме, чтобы активировать аккаунт.
                Если письмо не пришло, проверьте папку спам.
              </p>
              <Link href="/auth/login">
                <Button className="w-full">Вернуться к входу</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
