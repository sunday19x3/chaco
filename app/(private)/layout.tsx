'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from './components/header'
import BottomNavigation from './components/bottom-navigation'
import 'mapbox-gl/dist/mapbox-gl.css'
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/dang-nhap')
    }
  }, [user])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null // Will redirect in useEffect
  }

  // User is authenticated, render the private page content
  return (
    <div className='min-h-screen relative pb-20'>
      <Header />
      {children}
      <BottomNavigation />
    </div>
  )
}
