import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { cn } from '@/lib/utils'

interface InputProps extends React.ComponentProps<'input'> {
  leadingIcon?: React.ReactNode
}

function Input({ className, type, leadingIcon, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const isPasswordType = type === 'password'
  const inputType = isPasswordType && showPassword ? 'text' : type
  if (leadingIcon || isPasswordType) {
    return (
      <div className='relative'>
        {leadingIcon && (
          <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
            <div className='text-Stroke-stroke-primary w-5 h-5'>{leadingIcon}</div>
          </div>
        )}
        <input
          type={inputType}
          data-slot='input'
          className={cn(
            'file:text-foreground placeholder:text-Text-text-negative selection:bg-primary selection:text-primary-foreground flex h-auto w-full min-w-0 rounded-xl outline outline-Stroke-stroke-secondary bg-transparent py-4 leading-5 text-sm transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            'focus-visible:outline-Stroke-stroke-info',
            'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
            leadingIcon && isPasswordType
              ? 'pl-12 pr-12'
              : leadingIcon
              ? 'pl-12 pr-4'
              : isPasswordType
              ? 'pl-4 pr-12'
              : 'px-4',
            className
          )}
          {...props}
        />
        {isPasswordType && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute inset-y-0 right-0 pr-4 flex items-center'>
            <div className='text-Text-text-negative w-5 h-5'>
              {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
            </div>
          </button>
        )}
      </div>
    )
  }

  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'file:text-foreground placeholder:text-Text-text-negative selection:bg-primary selection:text-primary-foreground flex h-auto w-full min-w-0 rounded-xl outline outline-Stroke-stroke-secondary bg-transparent px-4 py-4 text-sm transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-Stroke-stroke-info',
        'aria-invalid:ring-destructive/20 aria-invalid:outline-destructive',
        className
      )}
      {...props}
    />
  )
}

export { Input }
