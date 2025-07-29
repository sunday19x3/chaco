'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/models/user'
import { login as loginService, getCurrentUser as getCurrentUserService } from '@/services/auth'
import { getDeviceInfo } from '@/utils/deviceDetection'
import { toast } from 'sonner'
import useSWR from 'swr'
import { getWorkingData } from '@/services/attendance'
import { WorkingData } from '@/models/user'
import { useRouter } from 'next/navigation'
interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  workingData?: WorkingData
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  const { data: workingData } = useSWR({ key: 'get-working-data', user }, ({ user }) =>
    user ? getWorkingData() : undefined
  )
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true)
      const deviceInfo = getDeviceInfo()
      const loginData = await loginService(username, password, deviceInfo)
      if (loginData) {
        localStorage.setItem('access-token', loginData.tokens.accessToken)
        localStorage.setItem('refresh-token', loginData.tokens.refreshToken)
        setUser(loginData.user)
      }
    } catch (error) {
      console.error(error)
      toast.error('Đăng nhập thất bại. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentUser = async () => {
    const hasToken = localStorage.getItem('access-token') || localStorage.getItem('refresh-token')
    if (!hasToken) {
      router.push('/dang-nhap')
      return
    }
    const user = await getCurrentUserService()
    if (user) {
      setUser(user)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('access-token')
    localStorage.removeItem('refresh-token')
    router.push('/dang-nhap')
  }

  const initialize = async () => {
    try {
      await getCurrentUser()
    } catch (error) {
      console.error(error)
      router.push('/dang-nhap')
    } finally {
      setIsInitialized(true)
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, workingData }}>
      {isInitialized ? children : null}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
