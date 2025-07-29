import { WorkingData } from '@/models/user'
import axiosInstance from './axios'

export const getAttendanceStatus = async (
  employeeId: string
): Promise<{
  employeeId: string
  currentStatus: 'not_checked_in' | 'checked_in' | 'checked_out'
  todayAttendance: {
    totalHours: number
    workShift: {
      expectedHours: number
      remainingHours: number
    }
  }
}> => {
  const response = await axiosInstance.get(`/attendance/status/${employeeId}`)
  return response.data.data
}
export const getAttendanceHistory = async (
  employeeId: string,
  startDate: string,
  endDate: string
): Promise<
  {
    id: string
    employeeId: string
    checkType: 'checkin' | 'checkout'
    timestamp: string
    location: {
      latitude: number
      longitude: number
      accuracy: number
    }
    device: {
      deviceId: string
      deviceType: 'mobile' | 'tablet' | 'web'
    }
    photoUrl?: string
    status: 'success' | 'failed'
    isLate: boolean
    lateMinutes: number
    isEarlyLeave: boolean
    earlyLeaveMinutes: number
    createdAt: string
  }[]
> => {
  const response = await axiosInstance.get(`/attendance/history/${employeeId}`, {
    params: {
      startDate,
      endDate,
      limit: 1000,
    },
  })
  return response.data.data?.records
}
export const checkin = async (
  employeeId: string,
  photo: string,
  location: {
    latitude: number
    longitude: number
    accuracy: number
  },
  device: any
) => {
  const response = await axiosInstance.post(`/attendance/checkin`, {
    employeeId,
    checkType: 'checkin',
    location,
    verification: {
      photo,
    },
    device,
  })
  return response.data.data
}
export const checkout = async (
  employeeId: string,
  photo: string,
  location: {
    latitude: number
    longitude: number
    accuracy: number
  },
  device: any
) => {
  const response = await axiosInstance.post(`/attendance/checkout`, {
    employeeId,
    checkType: 'checkout',
    location,
    verification: {
      photo,
    },
    device,
  })
  return response.data.data
}
export const getWorkingData = async (): Promise<WorkingData> => {
  const response = await axiosInstance.get(`/users/me/enriched-profile`)
  return response.data.data
}
