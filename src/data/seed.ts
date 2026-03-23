import { Task, User, Priority, Status } from '../types';

export const USERS: User[] = [
  { id: 'u1', name: 'Aria Chen', color: '#7c6ff7' },
  { id: 'u2', name: 'Ben Torres', color: '#4cad7c' },
  { id: 'u3', name: 'Cleo Kim', color: '#e59940' },
  { id: 'u4', name: 'Dev Patel', color: '#4a9ce8' },
  { id: 'u5', name: 'Eva Russo', color: '#d4538a' },
  { id: 'u6', name: 'Finn Walsh', color: '#e25050' },
];

export const STATUSES: Status[] = ['todo', 'inprogress', 'inreview', 'done'];
export const PRIORITIES: Priority[] = ['critical', 'high', 'medium', 'low'];

export const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  inprogress: 'In Progress',
  inreview: 'In Review',
  done: 'Done',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  critical: '#e25050',
  high: '#e59940',
  medium: '#7c6ff7',
  low: '#4cad7c',
};

const adjectives = ['Unified', 'Core', 'Async', 'Legacy', 'New', 'Global', 'Internal', 'External', 'Beta', 'Stable'];
const nouns = ['Pipeline', 'Dashboard', 'API', 'Migration', 'Refactor', 'Deployment', 'Integration', 'Module', 'Service', 'Auth'];
const verbs = ['Redesign', 'Implement', 'Fix', 'Optimize', 'Build', 'Test', 'Deploy', 'Review', 'Update', 'Remove'];

function randomDate(daysOffset: number, spread: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset + Math.floor(Math.random() * spread));
  return d.toISOString().slice(0, 10);
}

export function generateTasks(count = 500): Task[] {
  return Array.from({ length: count }, (_, i) => {
    const priority = PRIORITIES[Math.floor(Math.random() * PRIORITIES.length)];
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const user = USERS[Math.floor(Math.random() * USERS.length)];
    const hasStart = Math.random() > 0.15;
    const isOverdue = Math.random() > 0.6 && status !== 'done';
    const startOffset = Math.floor(Math.random() * 20) - 10;
    const dueOffset = isOverdue ? -Math.floor(Math.random() * 15) - 1 : startOffset + Math.floor(Math.random() * 14) + 1;

    return {
      id: `t${i + 1}`,
      title: `${verbs[i % verbs.length]} ${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`,
      status,
      priority,
      assignee: user,
      startDate: hasStart ? randomDate(isOverdue ? -20 : startOffset, 5) : null,
      dueDate: randomDate(dueOffset, 3),
    };
  });
}

export const INITIAL_TASKS = generateTasks(500);
