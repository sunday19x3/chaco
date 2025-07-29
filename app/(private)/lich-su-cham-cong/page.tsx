'use client'

import { Calendar } from '@/components/ui/calendar'
import { useAuth } from '@/contexts/AuthContext'
import { cn, getImageUrl } from '@/lib/utils'
import { getAttendanceHistory } from '@/services/attendance'
import { vi } from 'date-fns/locale'
import { CircleAlert, CircleCheck } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Mapbox from './components/mapbox'
export default function AttendanceHistory() {
  const [date, setDate] = useState<Date | undefined>(moment().toDate())
  const [month, setMonth] = useState(moment().toDate())
  const { user, workingData } = useAuth()
  const [attendanceHistory, setAttendanceHistory] = useState<
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
  >([])
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
  const selectedDateAttendance = attendanceHistory.filter((item) =>
    moment(item.timestamp).startOf('day').isSame(moment(date).startOf('day'))
  )
  console.log(selectedDateAttendance)
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
                    'w-full cursor-pointer max-w-10 text-xs aspect-square rounded-full grid place-items-center',
                    props.modifiers.selected && 'border',
                    attendanceHistory?.some((item) =>
                      moment(item.timestamp).startOf('day').isSame(moment(props.day.date).startOf('day'))
                    )
                      ? props.modifiers.selected
                        ? 'bg-[#E1F8E4] border-[#45ae53]'
                        : 'bg-[#E1F8E4]'
                      : '',
                    moment(props.day.date).isBefore(moment()) &&
                      workingData?.defaultSchedule?.workDays.includes(moment(props.day.date).day()) &&
                      attendanceHistory?.every(
                        (item) => !moment(item.timestamp).startOf('day').isSame(moment(props.day.date).startOf('day'))
                      )
                      ? props.modifiers.selected
                        ? 'bg-[#FFD3D3] border-[#E46060]'
                        : 'bg-[#FFD3D3]'
                      : ''
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
      <div className='p-4 space-y-4'>
        <div className='text-sm font-semibold'>
          {moment(date)
            .format('dddd, [ngày] DD/MM/YYYY')
            .replace('Monday', 'Thứ 2')
            .replace('Tuesday', 'Thứ 3')
            .replace('Wednesday', 'Thứ 4')
            .replace('Thursday', 'Thứ 5')
            .replace('Friday', 'Thứ 6')
            .replace('Saturday', 'Thứ 7')
            .replace('Sunday', 'Chủ Nhật')}
        </div>
        <div className='rounded-xl bg-white p-4 space-y-4'>
          <div className='space-y-4'>
            {selectedDateAttendance.find((item) => item.checkType === 'checkin') ? (
              selectedDateAttendance
                .filter((item) => item.checkType === 'checkin')
                ?.map((item, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex gap-2'>
                      <CircleCheck className='text-[#00C60A] w-4 h-4' />
                      <div className='flex gap-1'>
                        <div className='text-sm '>Checkin thành công</div>
                        <div className='text-sm text-Text-text-primary font-semibold'>
                          {moment(item.timestamp).format('HH:mm:ss')}
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <div className='w-full aspect-square bg-[#FAF9F9] rounded-lg overflow-hidden'>
                        <Image
                          src={getImageUrl(item.photoUrl || '')}
                          alt='checkin'
                          width={1000}
                          height={1000}
                          className='w-full h-full object-cover'
                          unoptimized
                        />
                      </div>
                      <div className='w-full aspect-square bg-[#FAF9F9] rounded-lg overflow-hidden'>
                        <Mapbox lat={item.location.latitude} lng={item.location.longitude} />
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className='flex gap-2 text-sm items-center'>
                <CircleAlert className='text-[#C61700] w-4 h-4' />
                <div>Chưa checkin</div>
              </div>
            )}
          </div>
          <div className='h-px w-full bg-[#F3F3F3]'></div>
          <div className='space-y-4'>
            {selectedDateAttendance.find((item) => item.checkType === 'checkout') ? (
              selectedDateAttendance
                .filter((item) => item.checkType === 'checkout')
                ?.map((item, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex gap-2'>
                      <CircleCheck className='text-[#00C60A] w-4 h-4' />
                      <div className='flex gap-1'>
                        <div className='text-sm '>Checkout thành công</div>
                        <div className='text-sm text-Text-text-primary font-semibold'>
                          {moment(item.timestamp).format('HH:mm:ss')}
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <div className='w-full aspect-square bg-[#FAF9F9] rounded-lg overflow-hidden'>
                        <Image
                          src={getImageUrl(item.photoUrl || '')}
                          alt='checkout'
                          width={1000}
                          height={1000}
                          className='w-full h-full object-cover'
                          unoptimized
                        />
                      </div>
                      <div className='w-full aspect-square bg-[#FAF9F9] rounded-lg overflow-hidden'>
                        <Mapbox lat={item.location.latitude} lng={item.location.longitude} />
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className='flex gap-2 text-sm items-center'>
                <CircleAlert className='text-[#C61700] w-4 h-4' />
                <div>Chưa checkout</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
