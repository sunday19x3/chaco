'use client'

import { Calendar } from '@/components/ui/calendar'
import { useState } from 'react'
import { vi } from 'date-fns/locale'
export default function AttendanceHistory() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <div>
      <Calendar
        mode='single'
        defaultMonth={date}
        selected={date}
        onSelect={setDate}
        locale={vi}
        className='w-full rounded-lg'
      />
    </div>
  )
}
