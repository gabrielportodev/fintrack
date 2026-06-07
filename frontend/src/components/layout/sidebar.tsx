'use client'

import {
  LayoutDashboard,
  ArrowLeftRight,
  Tag,
  Target,
  BarChart2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LucideIcon
} from 'lucide-react'
import { LogoIcon } from '@/components/shared/logo-icon'
import { UserAvatar } from '@/components/shared/user-avatar'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { Fragment, useState } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type NavItemType = {
  href: string
  label: string
  icon: LucideIcon
}

const navItems: NavItemType[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transações', icon: ArrowLeftRight },
  { href: '/categories', label: 'Categorias', icon: Tag },
  { href: '/goals', label: 'Metas', icon: Target },
  { href: '/reports', label: 'Relatórios', icon: BarChart2 }
]

type SidebarContentProps = {
  collapsed: boolean
  isMobile: boolean
  onNavigate?: () => void
  onToggleCollapse?: () => void
}

function SidebarContent({ collapsed, isMobile, onNavigate, onToggleCollapse }: SidebarContentProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const expanded = !collapsed || isMobile

  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r border-border transition-[width] duration-200',
        expanded ? 'w-60' : 'w-16'
      )}
      style={{ background: 'var(--sidebar)' }}
    >
      <div className={cn('flex items-center py-5.5', expanded ? 'gap-2.5 px-5' : 'justify-center px-3')}>
        <LogoIcon />
        {expanded && <span className='text-base font-semibold tracking-tight'>Fintrack</span>}
      </div>

      <div className={cn('pb-4', expanded ? 'px-4' : 'px-3 flex justify-center')}>
        {expanded ? (
          <Link
            href='/profile'
            onClick={onNavigate}
            title='Ver perfil'
            className='flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-background border border-border transition-colors hover:border-primary/40'
          >
            <UserAvatar name={user?.name} avatarUrl={user?.avatarUrl} className='w-6.5 h-6.5 text-xs' />
            <div className='flex-1 min-w-0'>
              <p className='text-[12.5px] font-medium leading-none truncate'>{user?.name}</p>
              <p className='text-[11px] text-muted-foreground mt-0.5 truncate'>{user?.email}</p>
            </div>
          </Link>
        ) : (
          <Link href='/profile' onClick={onNavigate} className='transition-opacity hover:opacity-80' title={user?.name}>
            <UserAvatar name={user?.name} avatarUrl={user?.avatarUrl} className='w-7.5 h-7.5 text-xs' />
          </Link>
        )}
      </div>

      <nav className={cn('flex-1 flex flex-col gap-0.5', expanded ? 'px-4' : 'px-2')}>
        {expanded && (
          <p className='text-[10.5px] font-semibold text-muted-foreground uppercase tracking-widest px-3 pb-1.5 pt-2'>
            Menu
          </p>
        )}
        {!expanded && <div className='pt-2' />}
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              title={!expanded ? label : undefined}
              onClick={onNavigate}
              className={cn(
                'relative flex items-center rounded-lg text-sm font-medium transition-colors',
                expanded ? 'gap-3 px-3 py-2.5' : 'justify-center py-2.5',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-background hover:text-foreground'
              )}
            >
              {isActive && expanded && (
                <span className='absolute -left-4 top-2 bottom-2 w-0.5 rounded-full bg-primary' />
              )}
              <Icon size={16} />
              {expanded && label}
            </Link>
          )
        })}
      </nav>

      <div className={cn('pb-5 pt-3 border-t border-border flex flex-col gap-0.5', expanded ? 'px-4' : 'px-2')}>
        {!isMobile && (
          <Button
            variant='ghost'
            onClick={onToggleCollapse}
            title={collapsed ? 'Expandir' : undefined}
            className={cn(
              'w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground',
              expanded ? 'justify-start gap-3 px-3 py-2.5 h-auto' : 'justify-center py-2.5 h-auto'
            )}
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <Fragment>
                <ChevronLeft size={16} />
                Recolher
              </Fragment>
            )}
          </Button>
        )}
        <Button
          variant='ghost'
          onClick={logout}
          title={!expanded ? 'Sair' : undefined}
          className={cn(
            'w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground',
            expanded ? 'justify-start gap-3 px-3 py-2.5 h-auto' : 'justify-center py-2.5 h-auto'
          )}
        >
          <LogOut size={16} />
          {expanded && 'Sair'}
        </Button>
      </div>
    </aside>
  )
}

interface SidebarProps {
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}

export function Sidebar({ mobileOpen, onMobileOpenChange }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Fragment>
      <div className='hidden md:flex h-full'>
        <SidebarContent collapsed={collapsed} isMobile={false} onToggleCollapse={() => setCollapsed(c => !c)} />
      </div>

      {mobileOpen && (
        <Fragment>
          <div className='fixed inset-0 z-40 bg-black/50 md:hidden' onClick={() => onMobileOpenChange(false)} />
          <div className='fixed inset-y-0 left-0 z-50 md:hidden flex'>
            <SidebarContent collapsed={false} isMobile={true} onNavigate={() => onMobileOpenChange(false)} />
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}
