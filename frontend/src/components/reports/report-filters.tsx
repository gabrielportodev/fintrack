'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ReportFiltersProps {
  months: { month: number; year: number; label: string }[]
  startMonth: number
  startYear: number
  endMonth: number
  endYear: number
  onStartChange: (month: number, year: number) => void
  onEndChange: (month: number, year: number) => void
  onExport: () => void
  isExporting: boolean
}

export const ReportFilters = ({
  months,
  startMonth,
  startYear,
  endMonth,
  endYear,
  onStartChange,
  onEndChange,
  onExport,
  isExporting
}: ReportFiltersProps) => {
  const handleStart = (val: string) => {
    const [m, y] = val.split('-').map(Number)
    onStartChange(m, y)
  }

  const handleEnd = (val: string) => {
    const [m, y] = val.split('-').map(Number)
    onEndChange(m, y)
  }

  return (
    <div className='flex items-center gap-3'>
      <div className='flex items-center gap-2'>
        <Select value={`${startMonth}-${startYear}`} onValueChange={handleStart}>
          <SelectTrigger className='w-36'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map(m => (
              <SelectItem key={`${m.month}-${m.year}`} value={`${m.month}-${m.year}`}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className='text-muted-foreground text-sm'>até</span>
        <Select value={`${endMonth}-${endYear}`} onValueChange={handleEnd}>
          <SelectTrigger className='w-36'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map(m => (
              <SelectItem key={`${m.month}-${m.year}`} value={`${m.month}-${m.year}`}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button variant='outline' onClick={onExport} disabled={isExporting}>
        <Download size={15} />
        {isExporting ? 'Gerando...' : 'Exportar PDF'}
      </Button>
    </div>
  )
}
