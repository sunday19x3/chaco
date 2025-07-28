'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@/models/user'
import { login as loginService, getCurrentUser as getCurrentUserService } from '@/services/auth'
import { getDeviceInfo } from '@/utils/deviceDetection'
interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const login = async (username: string, password: string) => {
    setIsLoading(true)
    const deviceInfo = getDeviceInfo()
    const loginData = await loginService(username, password, deviceInfo)
    if (loginData) {
      localStorage.setItem('access-token', loginData.tokens.accessToken)
      localStorage.setItem('refresh-token', loginData.tokens.refreshToken)
      setUser(loginData.user)
    }
    setIsLoading(false)
  }

  const getCurrentUser = async () => {
    const accessToken = localStorage.getItem('access-token')
    if (!accessToken) return
    const user = await getCurrentUserService()
    if (user) {
      setUser(user)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('access-token')
    localStorage.removeItem('refresh-token')
  }

  const initialize = async () => {
    try {
      await getCurrentUser()
    } catch (error) {
      console.error(error)
    } finally {
      setIsInitialized(true)
    }
  }

  useEffect(() => {
    initialize()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
