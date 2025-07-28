import { Bell } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()
  return (
    <header className='bg-[#4E3CDB] text-white h-12 flex items-center justify-center relative'>
      <h1 className=' font-medium'>{pathname === '/lich-su-cham-cong' ? 'Lịch sử chấm công' : 'Chấm công'}</h1>
      <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
        <Bell />
      </div>
    </header>
  )
}
