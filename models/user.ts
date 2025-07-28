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
