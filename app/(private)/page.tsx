'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Clock, MapPin, User } from 'lucide-react'
import IncomingWorkingShift from './components/incoming-working-shift'
import WorkingShiftProcessor from './components/working-shift-processor'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div>
      <div className='p-4 space-y-5'>
        <div className='flex items-center gap-5'>
          <div className='w-10 h-10 rounded-full bg-gray-200 grid place-items-center'>
            <User className='w-5 h-5 text-[#B2A9FF]' />
          </div>
          <div>
            <p className='font-medium'>{user?.fullName}</p>
            <p className='text-sm text-[#898989]'>{user?.position}</p>
          </div>
        </div>
        {/* Work Shift Information Card */}
        <div className='bg-[#F3F1FF] rounded-2xl p-4'>
          <h3 className='text-sm font-semibold mb-3 text-gray-900'>Thông tin ca làm việc</h3>

          <div className='space-y-2 text-sm'>
            {/* Shift Time */}
            <div className='flex items-center gap-3'>
              <Clock className='w-5 h-5 text-[#B2A9FF] mt-0.5' />
              <div>
                <p className='font-medium text-gray-900'>
                  Cả ngày <span className='text-xs text-gray-400'>•</span> 08:00 - 17:00
                </p>
              </div>
            </div>

            {/* Location */}
            <div className='flex items-center gap-3'>
              <MapPin className='w-5 h-5 text-[#B2A9FF] mt-0.5' />
              <div>
                <p className='font-medium text-gray-900'>Nhà máy Điện phân khu 1</p>
                <p className='text-xs text-gray-400'>Khu công nghiệp Quế Võ, Nam Sơn, Bắc Ninh</p>
              </div>
            </div>
          </div>
        </div>
        <WorkingShiftProcessor />
      </div>
      <IncomingWorkingShift />
    </div>
  )
}
