export type User = {
  id: string
  employeeId: string
  email: string
  fullName: string
  role: string
  departmentId: string
  position: string
  phoneNumber: string
  isActive: boolean
  resetToken: string | null
  resetTokenExpiry: string | null
  lastLoginAt: string | null
  loginAttempts: number
  failedLoginAttempts: number
  loginCount: number
  lastPasswordChange: string
  lockedUntil: string | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
}
export type WorkingData = {
  employeeId: string
  fullName: string
  userProfile: {
    employeeId: string
    fullName: string
    email: string
    role: string
    departmentId: string
    position: string
    phoneNumber: string
    isActive: boolean
    joinDate: string
    dateOfBirth: string
    createdAt: string
    lastLoginAt: string
  }
  workSchedule: null
  defaultSchedule: {
    startTime: string
    endTime: string
    workDays: number[]
    lateThresholdMinutes: number
    earlyCheckoutThresholdMinutes: number
  }
  allowedLocations: [
    {
      name: string
      latitude: number
      longitude: number
      radius: number
    }
  ]
  locationRadius: number
  requirePhoto: boolean
  requireBiometric: boolean
  enableBeacon: boolean
  profileStats: {
    totalAttendanceDays: number
    presentDays: number
    absentDays: number
    lateDays: number
    overtimeHours: number
    attendanceRate: number
    averageCheckinTime: string
    lastAttendanceDate: string
  }
}
