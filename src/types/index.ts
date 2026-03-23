export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Status = 'todo' | 'inprogress' | 'inreview' | 'done';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: User;
  startDate: string | null;
  dueDate: string;
}

export interface Filters {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dateFrom: string;
  dateTo: string;
}

export type SortCol = 'title' | 'priority' | 'dueDate' | null;
export type SortDir = 1 | -1;
