'use client'

import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/AuthContext'
import { zodResolver } from '@hookform/resolvers/zod'
import { LockIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
})
export default function SignInPage() {
  const { login, user, isLoading } = useAuth()
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
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    login(values.username, values.password)
  }
  return (
    <div className='flex items-center justify-center h-screen'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-12 items-center w-full flex-col'>
          <strong className='text-2xl text-[#4E3CDB] uppercase'>Chấm công</strong>
          <div className='space-y-6 w-full'>
            <div className='text-sm text-Text-text-negative text-center'>Vui lòng đăng nhập tài khoản của bạn</div>
            <div className='space-y-4 w-full'>
              <FormField
                control={form.control}
                name='username'
                render={({ field }) => (
                  <Input
                    {...field}
                    leadingIcon={<UserIcon className='w-5 h-5' />}
                    className='w-full'
                    placeholder='Tên đăng nhập'
                  />
                )}
              />
              <div className='w-full space-y-2'>
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
                    />
                  )}
                />
                <div className='w-full text-right'>
                  <span className='text-Button-text-primary text-sm font-semibold'>Quên mật khẩu?</span>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full space-y-6'>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
            <div className='text-sm text-center'>
              Bạn chưa có tài khoản?{' '}
              <Link href='/dang-ky' className='text-Text-text-primary'>
                Đăng ký
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
