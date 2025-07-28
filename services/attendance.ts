import axiosInstance from './axios'

export const getAttendanceStatus = async (
  employeeId: string
): Promise<{
  employeeId: string
  currentStatus: 'not_started' | 'in_progress' | 'ended'
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
export const getAttendanceHistory = async (employeeId: string, startDate: string, endDate: string) => {
  const response = await axiosInstance.get(`/attendance/history/${employeeId}`, {
    params: {
      startDate,
      endDate,
      limit: 1000,
    },
  })
  return response.data.data
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
