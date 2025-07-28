'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { getAttendanceStatus } from '@/services/attendance'
import { CheckCircle, TriangleAlert } from 'lucide-react'
import moment from 'moment'
import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

// Vietnamese day names mapping
const vietnameseDays = {
  0: 'Chủ Nhật',
  1: 'Thứ Hai',
  2: 'Thứ Ba',
  3: 'Thứ Tư',
  4: 'Thứ Năm',
  5: 'Thứ Sáu',
  6: 'Thứ Bảy',
}

export default function WorkingShiftProcessor() {
  const [tab, setTab] = useState<'gps' | 'wifi'>('gps')
  const [currentTime, setCurrentTime] = useState(moment())
  const [attendanceStatus, setAttendanceStatus] = useState<{
    employeeId: string
    currentStatus: 'not_started' | 'in_progress' | 'ended'
    todayAttendance:
      | {
          totalHours: number
          workShift: {
            expectedHours: number
            remainingHours: number
          }
        }
      | undefined
  }>()
  const { user } = useAuth()

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment())
    }, 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(timer)
  }, [])

  // Get current date with Vietnamese day name
  const getCurrentDateVietnamese = () => {
    const dayOfWeek = currentTime.day() // 0 = Sunday, 1 = Monday, etc.
    const vietnameseDay = vietnameseDays[dayOfWeek as keyof typeof vietnameseDays]
    const formattedDate = currentTime.format('DD/MM/YYYY')
    return `${vietnameseDay}, ${formattedDate}`
  }

  const getCurrentTime = () => {
    return currentTime.format('HH:mm:ss')
  }

  const fetchAttendanceStatus = async () => {
    const status = await getAttendanceStatus(user?.employeeId!)
    setAttendanceStatus(status)
  }
  useEffect(() => {
    fetchAttendanceStatus()
  }, [])

  return (
    <div>
      <div className='flex items-end'>
        <div
          onClick={() => setTab('gps')}
          className={cn(
            'w-[120px] grid cursor-pointer place-items-center text-sm font-semibold bg-white rounded-t-xl',
            tab === 'gps' ? 'bg-white h-11' : 'bg-[#F3F3F3] h-9 text-[#959393]'
          )}>
          GPS
        </div>
        <div
          onClick={() => setTab('wifi')}
          className={cn(
            'w-[120px] grid cursor-pointer place-items-center text-sm font-semibold bg-white rounded-t-xl',
            tab === 'wifi' ? 'bg-white h-11' : 'bg-[#F3F3F3] h-9 text-[#959393]'
          )}>
          WiFi
        </div>
      </div>
      <div className='p-4 bg-white rounded-b-xl space-y-5'>
        <div className='flex items-center w-full flex-col gap-3 justify-between'>
          <div className='text-sm font-medium'>{getCurrentDateVietnamese()}</div>
          <div className='font-extrabold text-2xl'>{getCurrentTime()}</div>
        </div>
        <div>
          <Button className='w-full'>
            {attendanceStatus?.currentStatus === 'not_started'
              ? 'Vào làm'
              : attendanceStatus?.currentStatus === 'in_progress'
              ? 'Tan làm'
              : 'Hết ca'}
          </Button>
        </div>
        <div className='flex items-center gap-5 justify-between'>
          <div className='space-y-2 text-xs'>
            {attendanceStatus?.currentStatus === 'not_started' ? (
              <div className='flex items-center gap-2'>
                <TriangleAlert className='w-4 h-4 text-[#F7C604]' /> Bạn chưa check-in
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4 text-[#00C60A]' /> Bạn đã check-in thành công
              </div>
            )}
            {attendanceStatus?.currentStatus === 'ended' ? (
              <div className='flex items-center gap-2'>
                <CheckCircle className='w-4 h-4 text-[#00C60A]' /> Bạn đã check-out thành công
              </div>
            ) : (
              <div className='flex items-center gap-2'>
                <TriangleAlert className='w-4 h-4 text-[#F7C604]' /> Bạn chưa check-out
              </div>
            )}
          </div>
          <Button variant='secondary' size='sm'>
            Xin nghỉ
          </Button>
        </div>
      </div>
    </div>
  )
}
