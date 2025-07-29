'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { checkin, checkout, getAttendanceStatus, getWorkingData } from '@/services/attendance'
import { getBrowserInfo, getDeviceType } from '@/utils/deviceDetection'
import { CheckCircle, Clock, MapPin, ScanFace, TriangleAlert, X } from 'lucide-react'
import moment from 'moment'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import useSWR from 'swr'
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
  const { workingData } = useAuth()
  const [tab, setTab] = useState<'gps' | 'wifi'>('gps')
  const [currentTime, setCurrentTime] = useState(moment())
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState<GeolocationPosition | null>(null)
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

  // Camera related state and refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

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

  // Location functions
  const requestLocation = useCallback(async () => {
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        toast.error('Geolocation is not supported by this browser.')
        return
      }

      // Request location permission and get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        })
      })

      setLocation(position)
    } catch (err: any) {
      console.error('Error getting location:', err)
      let errorMessage = 'Unable to get location.'

      if (err.code === 1) {
        errorMessage = 'Location access denied. Please enable location permissions.'
      } else if (err.code === 2) {
        errorMessage = 'Location unavailable. Please check your GPS settings.'
      } else if (err.code === 3) {
        errorMessage = 'Location request timed out. Please try again.'
      }

      toast.error(errorMessage)
    }
  }, [])

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      setCameraError(null)

      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'user',
        },
        audio: false,
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsStreaming(true)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setCameraError('Unable to access camera. Please check permissions.')
      setIsStreaming(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const video = videoRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw the video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data as base64
    const imageDataUrl = canvas.toDataURL('image/jpeg', 1)
    setCapturedImage(imageDataUrl)

    // Stop camera after capture
    stopCamera()
  }, [stopCamera])

  const handler = async () => {
    if (!location) {
      toast.error('Không thể lấy vị trí')
      return
    }
    try {
      setLoading(true)
      if (attendanceStatus?.currentStatus === 'not_started') {
        await checkin(
          user?.employeeId!,
          capturedImage!,
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          },
          {
            deviceType: getDeviceType(),
            deviceId: getBrowserInfo().engine,
            appVersion: getBrowserInfo().version,
          }
        )
      } else {
        await checkout(
          user?.employeeId!,
          capturedImage!,
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          },
          {
            deviceType: getDeviceType(),
            deviceId: getBrowserInfo().engine,
            appVersion: getBrowserInfo().version,
          }
        )
      }
    } catch (error) {
      console.error(error)
      toast.error('Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendanceStatus()
  }, [])

  // Start camera and request location when dialog opens
  useEffect(() => {
    if (open) {
      startCamera()
      setCapturedImage(null)
      requestLocation()
    } else {
      stopCamera()
    }

    // Cleanup on unmount
    return () => {
      stopCamera()
    }
  }, [open, startCamera, stopCamera, requestLocation])

  return (
    <>
      {/* Work Shift Information Card */}
      {workingData && (
        <div className='bg-[#F3F1FF] rounded-2xl p-4'>
          <h3 className='text-sm font-semibold mb-3 text-gray-900'>Thông tin ca làm việc</h3>

          <div className='space-y-2 text-sm'>
            {/* Shift Time */}
            <div className='flex items-center gap-3'>
              <Clock className='w-5 h-5 text-[#B2A9FF] mt-0.5' />
              <div>
                <p className='font-medium text-gray-900'>
                  Cả ngày <span className='text-xs text-gray-400'>•</span> {workingData.defaultSchedule.startTime} -{' '}
                  {workingData.defaultSchedule.endTime}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className='flex items-center gap-3'>
              <MapPin className='w-5 h-5 text-[#B2A9FF] mt-0.5' />
              <div>
                <p className='font-medium text-gray-900'>{workingData.allowedLocations[0].name}</p>
                <p className='text-xs text-gray-400'>Khu công nghiệp Quế Võ, Nam Sơn, Bắc Ninh</p>
              </div>
            </div>
          </div>
        </div>
      )}
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className='w-full'
                disabled={
                  loading ||
                  (attendanceStatus?.currentStatus !== 'not_started' &&
                    attendanceStatus?.currentStatus !== 'in_progress')
                }>
                {loading
                  ? 'Đang xử lý...'
                  : attendanceStatus?.currentStatus === 'not_started'
                  ? 'Vào làm'
                  : attendanceStatus?.currentStatus === 'in_progress'
                  ? 'Tan làm'
                  : 'Hết ca'}
              </Button>
            </DialogTrigger>
            <DialogContent
              showCloseButton={false}
              className='p-0 !max-w-xl !w-screen !bg-[#404040] !rounded-none !border-none'>
              <DialogHeader className='hidden'>
                <DialogTitle>Chụp ảnh chấm công</DialogTitle>
              </DialogHeader>
              <div className='w-full h-screen flex items-center flex-col text-white pb-6'>
                <header className='text-white  w-full h-12 flex items-center justify-center relative'>
                  <h1 className=' font-medium'>Chụp ảnh chấm công</h1>
                  <div onClick={() => setOpen(false)} className='absolute left-4 top-1/2 transform -translate-y-1/2'>
                    <X />
                  </div>
                </header>
                <div className='w-full text-center text-sm'>Vui lòng chụp rõ khuôn mặt</div>
                <div className='px-6 py-3 flex-1 w-full'>
                  <div className='w-full h-full bg-[#D9D9D9] rounded-lg relative overflow-hidden' id='live-preview'>
                    {cameraError ? (
                      <div className='flex flex-col items-center justify-center h-full text-red-500'>
                        <X className='w-12 h-12 mb-2' />
                        <p className='text-sm text-center px-4'>{cameraError}</p>
                        <button onClick={startCamera} className='mt-2 px-4 py-2 bg-blue-500 text-white rounded text-sm'>
                          Thử lại
                        </button>
                      </div>
                    ) : capturedImage ? (
                      <img src={capturedImage} alt='Captured photo' className='w-full h-full object-cover' />
                    ) : (
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className='w-full h-full object-cover transform scale-x-[-1]'
                      />
                    )}

                    {/* Loading indicator when starting camera */}
                    {!isStreaming && !cameraError && !capturedImage && (
                      <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='text-gray-600'>Đang mở camera...</div>
                      </div>
                    )}
                  </div>
                </div>

                {capturedImage ? (
                  <div className='flex gap-4'>
                    <Button
                      onClick={() => {
                        setCapturedImage(null)
                        startCamera()
                      }}
                      size='sm'
                      variant='outline'>
                      Chụp lại
                    </Button>
                    <Button onClick={handler} size='sm'>
                      Xác nhận
                    </Button>
                  </div>
                ) : (
                  <button onClick={capturePhoto} disabled={!isStreaming} className='disabled:opacity-50'>
                    <ScanFace className='text-[#B83E3E] w-11 animate-pulse h-11' />
                  </button>
                )}

                {/* Hidden canvas for image capture */}
                <canvas ref={canvasRef} className='hidden' />
              </div>
            </DialogContent>
          </Dialog>
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
    </>
  )
}
