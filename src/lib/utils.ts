import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function formatDate(dateStr: string, fmt = 'yyyy年 MM月 dd日'): string {
  try {
    // SQLite sometimes stores as 'YYYY-MM-DD HH:MM:SS', normalise to ISO
    const normalised = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T')
    return format(parseISO(normalised), fmt, { locale: zhCN })
  } catch {
    return dateStr
  }
}
