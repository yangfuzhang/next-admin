'use server'
import { cookies } from 'next/headers'
import { AUTH_SUCCESS } from '@/lib/constants'

export async function setAuthSuccess() {
  await cookies().set(AUTH_SUCCESS, '1')
}

export async function removeAuthSuccess() {
  await cookies().delete(AUTH_SUCCESS)
}