'use client'

import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { LockIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z
  .object({
    username: z.string().min(2).max(50),
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu không khớp',
    path: ['confirmPassword'],
  })

export default function SignUpPage() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login, user } = useAuth()
  const router = useRouter()

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError('')
    setIsLoading(true)

    try {
      console.log(values)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi. Vui lòng thử lại.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-12 items-center w-full flex-col'>
          <strong className='text-2xl text-[#4E3CDB] uppercase'>Chấm công</strong>
          <div className='space-y-6 w-full'>
            <div className='text-sm text-Text-text-negative text-center'>Vui lòng điền thông tin để đăng ký</div>
            <div className='space-y-4 w-full'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <Input
                    {...field}
                    leadingIcon={<UserIcon className='w-5 h-5' />}
                    className='w-full'
                    placeholder='Họ và tên'
                    disabled={isLoading}
                  />
                )}
              />

              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <Input
                    {...field}
                    className='w-full'
                    leadingIcon={<LockIcon className='w-5 h-5' />}
                    type='password'
                    placeholder='Mật khẩu'
                    disabled={isLoading}
                  />
                )}
              />
              <FormField
                control={form.control}
                name='confirmPassword'
                render={({ field }) => (
                  <Input
                    {...field}
                    className='w-full'
                    leadingIcon={<LockIcon className='w-5 h-5' />}
                    type='password'
                    placeholder='Xác nhận mật khẩu'
                    disabled={isLoading}
                  />
                )}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className='text-red-500 text-sm text-center bg-red-50 py-2 px-3 rounded-lg w-full'>{error}</div>
          )}

          <div className='w-full space-y-6'>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </Button>
            <div className='text-sm text-center'>
              Bạn đã có tài khoản?{' '}
              <Link href='/dang-nhap' className='text-Text-text-primary'>
                Đăng nhập
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
