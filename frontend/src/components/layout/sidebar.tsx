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
  Menu,
  LucideIcon
} from 'lucide-react'
import { LogoIcon } from '@/components/shared/logo-icon'
import { useAuth } from '@/contexts/auth-context'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
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

  const initials = user?.name
    .split(' ')
    .map(n => n.charAt(0).toUpperCase())
    .join('')

  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r border-border transition-[width] duration-200',
        expanded ? 'w-60' : 'w-16'
      )}
      style={{ background: 'var(--sidebar)' }}
    >
      <div className={cn('flex items-center py-[22px]', expanded ? 'gap-2.5 px-5' : 'justify-center px-3')}>
        <LogoIcon />
        {expanded && <span className='text-base font-semibold tracking-tight'>Fintrack</span>}
      </div>

      <div className={cn('pb-4', expanded ? 'px-4' : 'px-3 flex justify-center')}>
        {expanded ? (
          <div className='flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-background border border-border'>
            <div className='flex items-center justify-center w-[26px] h-[26px] rounded-md bg-[#3B3F66] text-xs font-semibold shrink-0'>
              {initials}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-[12.5px] font-medium leading-none truncate'>{user?.name}</p>
              <p className='text-[11px] text-muted-foreground mt-0.5 truncate'>{user?.email}</p>
            </div>
          </div>
        ) : (
          <div
            className='flex items-center justify-center w-[30px] h-[30px] rounded-md bg-[#3B3F66] text-xs font-semibold'
            title={user?.name}
          >
            {initials}
          </div>
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
          <button
            onClick={onToggleCollapse}
            title={collapsed ? 'Expandir' : undefined}
            className={cn(
              'cursor-pointer flex items-center w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground transition-colors',
              expanded ? 'gap-3 px-3 py-2.5' : 'justify-center py-2.5'
            )}
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <>
                <ChevronLeft size={16} />
                Recolher
              </>
            )}
          </button>
        )}
        <button
          onClick={logout}
          title={!expanded ? 'Sair' : undefined}
          className={cn(
            'cursor-pointer flex items-center w-full rounded-lg text-sm font-medium text-muted-foreground hover:bg-background hover:text-foreground transition-colors',
            expanded ? 'gap-3 px-3 py-2.5' : 'justify-center py-2.5'
          )}
        >
          <LogOut size={16} />
          {expanded && 'Sair'}
        </button>
      </div>
    </aside>
  )
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <div className='hidden md:flex h-full'>
        <SidebarContent collapsed={collapsed} isMobile={false} onToggleCollapse={() => setCollapsed(c => !c)} />
      </div>

      <button
        onClick={() => setMobileOpen(true)}
        className='cursor-pointer fixed top-4 left-4 z-40 md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-background border border-border'
      >
        <Menu size={18} />
      </button>

      {mobileOpen && (
        <>
          <div className='fixed inset-0 z-40 bg-black/50 md:hidden' onClick={() => setMobileOpen(false)} />
          <div className='fixed inset-y-0 left-0 z-50 md:hidden flex'>
            <SidebarContent collapsed={false} isMobile={true} onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}
    </>
  )
}
