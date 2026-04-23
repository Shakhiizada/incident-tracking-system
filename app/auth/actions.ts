'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
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
}

export async function signIn(formData: FormData) {
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
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth/login')
}
