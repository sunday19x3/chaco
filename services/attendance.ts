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
