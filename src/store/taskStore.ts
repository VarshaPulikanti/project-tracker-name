import { create } from 'zustand';
import { Task, Filters, Status } from '../types';
import { INITIAL_TASKS } from '../data/seed';

interface TaskStore {
  tasks: Task[];
  filters: Filters;
  view: 'kanban' | 'list' | 'timeline';
  setView: (view: 'kanban' | 'list' | 'timeline') => void;
  setFilters: (filters: Filters) => void;
  updateTaskStatus: (id: string, status: Status) => void;
  getFilteredTasks: () => Task[];
}

function parseUrlFilters(): Filters {
  const p = new URLSearchParams(window.location.search);
  return {
    status: p.get('status') ? (p.get('status')!.split(',') as Status[]) : [],
    priority: p.get('priority') ? (p.get('priority')!.split(',') as Priority[]) : [],
    assignee: p.get('assignee') ? p.get('assignee')!.split(',') : [],
    dateFrom: p.get('dateFrom') || '',
    dateTo: p.get('dateTo') || '',
  };
}

function applyFilters(tasks: Task[], filters: Filters): Task[] {
  return tasks.filter((t) => {
    if (filters.status.length && !filters.status.includes(t.status)) return false;
    if (filters.priority.length && !filters.priority.includes(t.priority)) return false;
    if (filters.assignee.length && !filters.assignee.includes(t.assignee.id)) return false;
    if (filters.dateFrom && t.dueDate < filters.dateFrom) return false;
    if (filters.dateTo && t.dueDate > filters.dateTo) return false;
    return true;
  });
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: INITIAL_TASKS,
  filters: parseUrlFilters(),
  view: 'kanban',

  setView: (view) => set({ view }),

  setFilters: (filters) => {
    const p = new URLSearchParams();
    if (filters.status.length) p.set('status', filters.status.join(','));
    if (filters.priority.length) p.set('priority', filters.priority.join(','));
    if (filters.assignee.length) p.set('assignee', filters.assignee.join(','));
    if (filters.dateFrom) p.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) p.set('dateTo', filters.dateTo);
    const qs = p.toString();
    window.history.replaceState({}, '', qs ? `?${qs}` : window.location.pathname);
    set({ filters });
  },

  updateTaskStatus: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
    })),

  getFilteredTasks: () => {
    const { tasks, filters } = get();
    return applyFilters(tasks, filters);
  },
}));
