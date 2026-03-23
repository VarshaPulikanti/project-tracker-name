import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Task, Status, SortCol, SortDir } from '../types';
import { STATUSES, STATUS_LABELS } from '../data/seed';
import Avatar from './Avatar';
import PriorityBadge from './PriorityBadge';
import { dueDateLabel } from '../utils';

interface ListViewProps {
  tasks: Task[];
  onStatusChange: (id: string, status: Status) => void;
  onClearFilters: () => void;
}

const ROW_HEIGHT = 44;
const BUFFER = 5;

const ListView: React.FC<ListViewProps> = ({ tasks, onStatusChange, onClearFilters }) => {
  const [sortCol, setSortCol] = useState<SortCol>(null);
  const [sortDir, setSortDir] = useState<SortDir>(1);
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const sorted = useMemo(() => {
    const arr = [...tasks];
    if (!sortCol) return arr;
    return arr.sort((a, b) => {
      let av: string | number = '';
      let bv: string | number = '';
      if (sortCol === 'title') {
        av = a.title.toLowerCase();
        bv = b.title.toLowerCase();
      } else if (sortCol === 'priority') {
        const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
        av = order[a.priority];
        bv = order[b.priority];
      } else if (sortCol === 'dueDate') {
        av = a.dueDate || '9999';
        bv = b.dueDate || '9999';
      }
      if (av < bv) return -sortDir;
      if (av > bv) return sortDir;
      return 0;
    });
  }, [tasks, sortCol, sortDir]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const containerHeight = containerRef.current?.clientHeight ?? 600;
  const visibleCount = Math.ceil(containerHeight / ROW_HEIGHT);
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(sorted.length, startIndex + visibleCount + BUFFER * 2);

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir((d) => (d === 1 ? -1 : 1));
    } else {
      setSortCol(col);
      setSortDir(1);
    }
  };

  const sortableCols: { key: SortCol; label: string; width: string }[] = [
    { key: 'title', label: 'Title', width: '35%' },
    { key: null, label: 'Status', width: '14%' },
    { key: 'priority', label: 'Priority', width: '11%' },
    { key: null, label: 'Assignee', width: '16%' },
    { key: 'dueDate', label: 'Due Date', width: '14%' },
  ];

  const gridCols = '35% 14% 11% 16% 14% 1fr';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: gridCols,
          padding: '0 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg3)',
          flexShrink: 0,
        }}
      >
        {sortableCols.map((c, i) => (
          <div
            key={i}
            onClick={() => c.key && toggleSort(c.key)}
            style={{
              padding: '10px 8px',
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: sortCol === c.key ? 'var(--accent2)' : 'var(--text3)',
              cursor: c.key ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              userSelect: 'none',
            }}
          >
            {c.label}
            {sortCol === c.key && (
              <span style={{ fontSize: 10 }}>{sortDir === 1 ? '↑' : '↓'}</span>
            )}
          </div>
        ))}
        <div />
      </div>

      {/* Virtual scroll container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ flex: 1, overflowY: 'auto', position: 'relative' }}
      >
        {sorted.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 12,
              color: 'var(--text3)',
            }}
          >
            <div style={{ fontSize: 40 }}>◌</div>
            <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text2)' }}>No tasks match your filters</div>
            <div style={{ fontSize: 13 }}>Try adjusting or clearing your filters</div>
            <button
              onClick={onClearFilters}
              style={{
                marginTop: 4,
                padding: '7px 18px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 500,
                background: 'rgba(124,111,247,0.15)',
                border: '1px solid rgba(124,111,247,0.4)',
                color: 'var(--accent2)',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div style={{ height: sorted.length * ROW_HEIGHT, position: 'relative' }}>
            {sorted.slice(startIndex, endIndex).map((t, i) => {
              const idx = startIndex + i;
              const dl = dueDateLabel(t.dueDate);
              return (
                <div
                  key={t.id}
                  style={{
                    position: 'absolute',
                    top: idx * ROW_HEIGHT,
                    left: 0,
                    right: 0,
                    height: ROW_HEIGHT,
                    display: 'grid',
                    gridTemplateColumns: gridCols,
                    padding: '0 16px',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                  }}
                >
                  <div
                    style={{
                      padding: '0 8px',
                      fontSize: 13,
                      fontWeight: 500,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={t.title}
                  >
                    {t.title}
                  </div>
                  <div style={{ padding: '0 8px' }}>
                    <select
                      value={t.status}
                      onChange={(e) => onStatusChange(t.id, e.target.value as Status)}
                      style={{
                        fontSize: 11,
                        padding: '3px 6px',
                        borderRadius: 5,
                        background: 'var(--bg4)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        outline: 'none',
                        cursor: 'pointer',
                        width: '100%',
                        fontFamily: 'inherit',
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ padding: '0 8px' }}>
                    <PriorityBadge priority={t.priority} />
                  </div>
                  <div
                    style={{
                      padding: '0 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Avatar user={t.assignee} size={20} />
                    <span
                      style={{
                        fontSize: 12,
                        color: 'var(--text2)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {t.assignee.name.split(' ')[0]}
                    </span>
                  </div>
                  <div
                    style={{
                      padding: '0 8px',
                      fontSize: 11,
                      color:
                        dl?.cls === 'overdue' || dl?.cls === 'late'
                          ? 'var(--red)'
                          : dl?.cls === 'today'
                          ? 'var(--amber)'
                          : 'var(--text2)',
                      fontWeight: dl?.cls === 'overdue' || dl?.cls === 'today' ? 600 : 400,
                    }}
                  >
                    {dl?.label || '—'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        style={{
          padding: '6px 16px',
          borderTop: '1px solid var(--border)',
          fontSize: 11,
          color: 'var(--text3)',
          background: 'var(--bg2)',
          flexShrink: 0,
        }}
      >
        {sorted.length} tasks · virtual scrolling active (rendering {Math.min(endIndex - startIndex, sorted.length)} of {sorted.length} rows)
      </div>
    </div>
  );
};

export default ListView;
