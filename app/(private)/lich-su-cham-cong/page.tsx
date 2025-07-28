'use client'

import { Calendar } from '@/components/ui/calendar'
import { useState, useEffect } from 'react'
import { vi } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import moment from 'moment'
import { getAttendanceHistory } from '@/services/attendance'
import { useAuth } from '@/contexts/AuthContext'
export default function AttendanceHistory() {
  const [date, setDate] = useState<Date | undefined>(moment().toDate())
  const [month, setMonth] = useState(moment().toDate())
  const { user } = useAuth()
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([])
  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      const response = await getAttendanceHistory(
        user?.employeeId || '',
        moment(month).subtract(1, 'month').format('YYYY-MM-DD'),
        moment(month).add(1, 'month').format('YYYY-MM-DD')
      )
      setAttendanceHistory(response)
    }
    fetchAttendanceHistory()
  }, [month])
  return (
    <div>
      <div className='space-y-4 bg-white py-4'>
        <Calendar
          mode='single'
          month={month}
          onMonthChange={setMonth}
          selected={date}
          onSelect={setDate}
          locale={vi}
          className='w-full rounded-lg'
          components={{
            DayButton: (props) => {
              return (
                <button
                  {...props}
                  className={cn(
                    props.className,
                    'w-full cursor-pointer aspect-square rounded-full grid place-items-center',
                    props.modifiers.selected && 'border'
                  )}>
                  {props.children}
                </button>
              )
            },
          }}
        />
        <div className='space-y-2 px-4 text-[10px]'>
          <div className='flex items-center gap-1.5 h-4'>
            <div className='w-3 h-3 rounded-sm bg-[#E1F8E4]'></div>
            <span>Chấm công thành công</span>
          </div>
          <div className='flex items-center gap-1.5 h-4'>
            <div className='w-3 h-3 rounded-sm bg-[#FFD3D3]'></div>
            <span>Chưa ghi nhận Chấm công</span>
          </div>
          <div className='flex items-center gap-1.5 h-4'>
            <div className='w-3 text-sm font-bold rounded-sm text-[#2788FE]'>P</div>
            <span>Ca làm vắng có phép</span>
          </div>
        </div>
      </div>
    </div>
  )
}
