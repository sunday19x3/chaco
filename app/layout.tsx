import type { Metadata } from "next";
import { Lato } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/sonner'
const lato = Lato({
  weight: ['400', '700'],
  variable: '--font-lato',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Check in',
  description: 'Check in app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${lato.variable} antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <main className='max-w-xl mx-auto relative bg-[#FBFBFB]'>{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
