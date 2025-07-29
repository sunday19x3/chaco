'use client'

import { useAuth } from '@/contexts/AuthContext'
import { LogOut, User } from 'lucide-react'
import IncomingWorkingShift from './components/incoming-working-shift'
import WorkingShiftProcessor from './components/working-shift-processor'

export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div>
      <div className='p-4 space-y-5'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-5'>
            <div className='w-10 h-10 rounded-full bg-gray-200 grid place-items-center'>
              <User className='w-5 h-5 text-[#B2A9FF]' />
            </div>
            <div>
              <p className='font-medium'>{user?.fullName}</p>
              <p className='text-sm text-[#898989]'>{user?.position}</p>
            </div>
          </div>
          <div onClick={logout}>
            <LogOut className='w-5 h-5 text-Text-text-negative' />
          </div>
        </div>

        <WorkingShiftProcessor />
      </div>
      <IncomingWorkingShift />
    </div>
  )
}
