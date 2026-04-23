'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    // Check if email confirmation is required
    if (data?.user?.identities?.length === 0) {
      return { error: 'Этот email уже зарегистрирован. Попробуйте войти.' }
    }

    // Check if user needs to confirm email
    if (data?.user && !data?.session) {
      return { success: true, needsEmailConfirmation: true }
    }

    // User is signed in (email confirmation disabled)
    return { success: true, needsEmailConfirmation: false }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('fetch') || message.includes('ENOTFOUND')) {
      return { error: 'Ошибка подключения к серверу. Попробуйте через минуту.' }
    }
    return { error: message }
  }
}

export async function signIn(formData: FormData) {
  try {
    const supabase = await createClient()
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error) {
      return { error: error.message }
    }

    redirect('/dashboard')
  } catch (err) {
    // Check if it's a redirect (Next.js throws an error for redirects)
    if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
      throw err
    }
    const message = err instanceof Error ? err.message : 'Unknown error'
    if (message.includes('fetch') || message.includes('ENOTFOUND')) {
      return { error: 'Ошибка подключения к серверу. Попробуйте через минуту.' }
    }
    return { error: message }
  }
}

export async function signOut() {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  } catch (err) {
    if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
      throw err
    }
    redirect('/auth/login')
  }
}
