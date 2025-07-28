import { User } from '@/models/user'
import axiosInstance from './axios'

export const login = async (
  email: string,
  password: string,
  deviceInfo?: any
): Promise<{
  user: User
  tokens: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
  session: {
    sessionId: string
    expiresAt: string
  }
}> => {
  const response = await axiosInstance.post('/auth/login', { email, password, deviceInfo })
  return response.data.data
}
export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get('/auth/me')
  return response.data.data
}
export const refreshToken = async (): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> => {
  const response = await axiosInstance.post('/auth/refresh', {
    refreshToken: localStorage.getItem('refresh-token'),
  })
  return response.data.data
}