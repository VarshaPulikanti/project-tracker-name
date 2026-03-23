import React, { useMemo } from 'react';
import { Task } from '../types';
import { PRIORITY_COLORS } from '../data/seed';

interface TimelineViewProps {
  tasks: Task[];
}

const DAY_WIDTH = 34;

const TimelineView: React.FC<TimelineViewProps> = ({ tasks }) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDay = now.getDate();

  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const filtered = useMemo(() => {
    return tasks
      .filter((t) => {
        if (!t.dueDate) return false;
        const due = new Date(t.dueDate);
        const start = t.startDate ? new Date(t.startDate) : null;
        const inMonth =
          (due.getFullYear() === year && due.getMonth() === month) ||
          (start && start.getFullYear() === year && start.getMonth() === month);
        return inMonth;
      })
      .slice(0, 100);
  }, [tasks]);

  const getBarLeft = (dateStr: string): number => {
    const d = new Date(dateStr);
    if (d.getMonth() !== month || d.getFullYear() !== year) return 0;
    return (d.getDate() - 1) * DAY_WIDTH;
  };

  const getBarWidth = (startStr: string | null, endStr: string): number => {
    if (!startStr) return DAY_WIDTH;
    const s = new Date(startStr);
    const e = new Date(endStr);
    const days = Math.max(1, Math.ceil((e.getTime() - s.getTime()) / 86400000) + 1);
    return days * DAY_WIDTH;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}>
        <div style={{ minWidth: daysInMonth * DAY_WIDTH + 200 }}>
          {/* Month label + day header */}
          <div
            style={{
              display: 'flex',
              position: 'sticky',
              top: 0,
              zIndex: 10,
              background: 'var(--bg2)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                width: 200,
                flexShrink: 0,
                padding: '8px 16px',
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--text2)',
                borderRight: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {monthName}
            </div>
            <div style={{ display: 'flex' }}>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <div
                  key={i}
                  style={{
                    width: DAY_WIDTH,
                    flexShrink: 0,
                    textAlign: 'center',
                    padding: '8px 0',
                    fontSize: 11,
                    color: i + 1 === todayDay ? 'var(--accent2)' : 'var(--text3)',
                    fontWeight: i + 1 === todayDay ? 700 : 400,
                    borderRight: '1px solid var(--border)',
                    background:
                      i + 1 === todayDay ? 'rgba(124,111,247,0.08)' : 'transparent',
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Task rows */}
          {filtered.length === 0 ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 200,
                color: 'var(--text3)',
                fontSize: 13,
              }}
            >
              No tasks in the current month
            </div>
          ) : (
            filtered.map((t, ri) => {
              const c = PRIORITY_COLORS[t.priority];
              const barLeft = t.startDate ? getBarLeft(t.startDate) : getBarLeft(t.dueDate);
              const barWidth = getBarWidth(t.startDate, t.dueDate);

              return (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border)',
                    background: ri % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)',
                    height: 38,
                  }}
                >
                  <div
                    style={{
                      width: 200,
                      flexShrink: 0,
                      padding: '0 16px',
                      fontSize: 12,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      color: 'var(--text2)',
                      borderRight: '1px solid var(--border)',
                    }}
                    title={t.title}
                  >
                    {t.title}
                  </div>
                  <div style={{ flex: 1, position: 'relative', height: '100%' }}>
                    {/* Today vertical line */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: (todayDay - 1) * DAY_WIDTH + DAY_WIDTH / 2,
                        width: 1,
                        background: 'rgba(124,111,247,0.5)',
                        pointerEvents: 'none',
                        zIndex: 2,
                      }}
                    />
                    {/* Task bar */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 7,
                        height: 24,
                        left: barLeft,
                        width: barWidth,
                        background: c + '28',
                        border: `1px solid ${c}70`,
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: 6,
                        overflow: 'hidden',
                        zIndex: 1,
                      }}
                      title={t.title}
                    >
                      {!t.startDate && (
                        <span style={{ fontSize: 10, color: c, fontWeight: 700 }}>●</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
