'use client'
import { CalendarClock, CopyCheck } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNavigation() {
  const pathname = usePathname()

  return (
    <div className='fixed w-full max-w-xl text-sm h-20 bottom-0 left-1/2 -translate-x-1/2 right-0 bg-white border-t border-[#EDEDED] shadow-[0px_-4px_12px_0px_#DFDFDF4D] p-4 grid grid-cols-2 divide-x divide-[#EDEDED]'>
      <Link
        href='/'
        className={`flex items-center justify-center flex-col gap-2 ${
          pathname === '/' ? 'text-Text-text-primary font-semibold' : 'text-Text-text-negative'
        }`}>
        <CopyCheck className='w-5 h-5' />
        <p>Chấm công</p>
      </Link>
      <Link
        href='/lich-su-cham-cong'
        className={`flex items-center justify-center flex-col gap-2 ${
          pathname === '/lich-su-cham-cong' ? 'text-Text-text-primary font-semibold' : 'text-Text-text-negative'
        }`}>
        <CalendarClock className='w-5 h-5' />
        <p>Lịch sử chấm công</p>
      </Link>
    </div>
  )
}
