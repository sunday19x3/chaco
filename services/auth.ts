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
  try {
    const response = await axiosInstance.post('/auth/login', { email, password, deviceInfo })
    return response.data.data
  } catch (error) {
    throw error
  }
}
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axiosInstance.get('/auth/me')
    return response.data.data
  } catch (error) {
    throw error
  }
}
