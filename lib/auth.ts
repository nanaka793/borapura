import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { getUser } from './data'
import type { User } from './types'

const SESSION_COOKIE = 'volunteer_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function createSession(userId: string) {
  const store = cookies()
  store.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

export function clearSession() {
  const store = cookies()
  store.delete(SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<User | null> {
  const store = cookies()
  const userId = store.get(SESSION_COOKIE)?.value
  if (!userId) return null
  return await getUser(userId)
}

