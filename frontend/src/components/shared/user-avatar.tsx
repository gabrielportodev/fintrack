import { cn } from '@/lib/utils'

type UserAvatarProps = {
  name?: string
  avatarUrl?: string | null
  className?: string
}

function UserAvatar({ name, avatarUrl, className }: UserAvatarProps) {
  const initials = name
    ?.split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .join('')

  return (
    <div
      className={cn(
        'flex items-center justify-center shrink-0 overflow-hidden rounded-md bg-[#3B3F66] font-semibold',
        className
      )}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- avatar é um data URL base64, não otimizável pelo next/image
        <img src={avatarUrl} alt={name ?? 'Avatar'} className='h-full w-full object-cover' />
      ) : (
        initials
      )}
    </div>
  )
}

export { UserAvatar }
