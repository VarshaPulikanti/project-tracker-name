export function initials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase();
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface DueDateInfo {
  label: string;
  cls: 'today' | 'overdue' | 'late' | 'normal';
}

export function dueDateLabel(date: string | null): DueDateInfo | null {
  if (!date) return null;
  const t = today();
  if (date === t) return { label: 'Due Today', cls: 'today' };
  const diff = Math.floor((new Date(t).getTime() - new Date(date).getTime()) / 86400000);
  if (diff > 7) return { label: `${diff}d overdue`, cls: 'overdue' };
  if (diff > 0) return { label: `${diff}d overdue`, cls: 'late' };
  return { label: date, cls: 'normal' };
}
