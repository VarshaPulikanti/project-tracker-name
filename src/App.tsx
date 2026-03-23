import React, { useEffect, useMemo } from 'react';
import { useTaskStore } from './store/taskStore';
import { useCollabSimulation } from './hooks/useCollab';
import FilterBar from './components/FilterBar';
import CollabBar from './components/CollabBar';
import KanbanView from './components/KanbanView';
import ListView from './components/ListView';
import TimelineView from './components/TimelineView';
import { Status, Priority } from './types';

const VIEWS = [
  { id: 'kanban', label: 'Kanban' },
  { id: 'list', label: 'List' },
  { id: 'timeline', label: 'Timeline' },
] as const;

function App() {
  const { view, setView, filters, setFilters, updateTaskStatus, getFilteredTasks, tasks } =
    useTaskStore();

  const filtered = getFilteredTasks();
  const taskIds = useMemo(() => filtered.map((t) => t.id), [filtered]);
  const { viewers, collab } = useCollabSimulation(taskIds);

  // Restore filters on back navigation
  useEffect(() => {
    const onPop = () => {
      const p = new URLSearchParams(window.location.search);
      setFilters({
        status: p.get('status') ? (p.get('status')!.split(',') as Status[]) : [],
        priority: p.get('priority') ? (p.get('priority')!.split(',') as Priority[]) : [],
        assignee: p.get('assignee') ? p.get('assignee')!.split(',') : [],
        dateFrom: p.get('dateFrom') || '',
        dateTo: p.get('dateTo') || '',
      });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Top Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          height: 48,
          background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #7c6ff7, #a89cf7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: '#fff',
            }}
          >
            V
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: '0.01em' }}>Velozity</span>
          <span style={{ fontSize: 12, color: 'var(--text3)' }}>/ Project Tracker</span>
        </div>

        {/* View switcher */}
        <div
          style={{
            display: 'flex',
            gap: 2,
            background: 'var(--bg3)',
            borderRadius: 8,
            padding: 3,
            border: '1px solid var(--border)',
          }}
        >
          {VIEWS.map((v) => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              style={{
                padding: '4px 14px',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 500,
                background: view === v.id ? 'var(--accent)' : 'transparent',
                color: view === v.id ? '#fff' : 'var(--text2)',
                transition: 'all 0.15s',
                cursor: 'pointer',
                border: 'none',
                fontFamily: 'inherit',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'var(--text3)' }}>
          {filtered.length} / {tasks.length} tasks
        </div>
      </div>

      <CollabBar viewers={viewers} />
      <FilterBar filters={filters} onChange={setFilters} />

      {/* View content */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {view === 'kanban' && (
          <KanbanView tasks={filtered} collab={collab} onStatusChange={updateTaskStatus} />
        )}
        {view === 'list' && (
          <ListView
            tasks={filtered}
            onStatusChange={updateTaskStatus}
            onClearFilters={() => setFilters({ status: [], priority: [], assignee: [], dateFrom: '', dateTo: '' })}
          />
        )}
        {view === 'timeline' && <TimelineView tasks={filtered} />}
      </div>
    </div>
  );
}

export default App;
