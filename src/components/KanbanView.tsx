import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Task, Status } from '../types';
import { STATUSES, STATUS_LABELS, PRIORITY_COLORS } from '../data/seed';
import { User } from '../types';
import Avatar from './Avatar';
import PriorityBadge from './PriorityBadge';
import { dueDateLabel, initials } from '../utils';

interface CollabUser extends User {
  currentTask: string;
}

interface DragState {
  task: Task;
  origin: Status;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
}

interface KanbanCardProps {
  task: Task;
  collab: Record<string, CollabUser[]>;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent, task: Task, status: Status) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, collab, isDragging, onPointerDown }) => {
  const dl = dueDateLabel(task.dueDate);
  const viewers = collab[task.id] || [];

  return (
    <div
      onPointerDown={(e) => onPointerDown(e, task, task.status)}
      style={{
        background: isDragging ? 'transparent' : 'var(--bg3)',
        border: isDragging ? '1px dashed var(--border2)' : '1px solid var(--border)',
        borderRadius: 8,
        padding: isDragging ? 0 : '10px 12px',
        marginBottom: 6,
        cursor: 'grab',
        opacity: isDragging ? 0.3 : 1,
        height: isDragging ? 80 : 'auto',
        transition: 'opacity 0.15s',
        userSelect: 'none',
        position: 'relative',
        touchAction: 'none',
      }}
    >
      {!isDragging && (
        <>
          {viewers.length > 0 && (
            <div style={{ position: 'absolute', top: 6, right: 6, display: 'flex' }}>
              {viewers.slice(0, 2).map((u, i) => (
                <div
                  key={u.id}
                  style={{
                    marginLeft: i > 0 ? -6 : 0,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: u.color,
                    border: '2px solid var(--bg3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 7,
                    fontWeight: 700,
                    color: '#fff',
                    transition: 'all 0.3s ease',
                    animation: 'avatarPop 0.3s ease',
                  }}
                >
                  {initials(u.name)}
                </div>
              ))}
              {viewers.length > 2 && (
                <div
                  style={{
                    marginLeft: -6,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: 'var(--bg4)',
                    border: '2px solid var(--bg3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 7,
                    fontWeight: 700,
                    color: 'var(--text2)',
                    transition: 'all 0.3s ease',
                  }}
                >
                  +{viewers.length - 2}
                </div>
              )}
            </div>
          )}
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              lineHeight: 1.4,
              marginBottom: 8,
              paddingRight: viewers.length ? 30 : 0,
            }}
          >
            {task.title}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 6,
            }}
          >
            <PriorityBadge priority={task.priority} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
              {dl && (
                <span
                  style={{
                    fontSize: 10,
                    color:
                      dl.cls === 'overdue' || dl.cls === 'late'
                        ? 'var(--red)'
                        : dl.cls === 'today'
                        ? 'var(--amber)'
                        : 'var(--text3)',
                    fontWeight: dl.cls === 'overdue' || dl.cls === 'today' ? 600 : 400,
                  }}
                >
                  {dl.label}
                </span>
              )}
              <Avatar user={task.assignee} size={20} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  collab: Record<string, CollabUser[]>;
  dragState: DragState | null;
  isDragOver: boolean;
  onPointerDown: (e: React.PointerEvent, task: Task, status: Status) => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  collab,
  dragState,
  isDragOver,
  onPointerDown,
  onDragEnter,
  onDragLeave,
}) => {
  return (
    <div
      onPointerEnter={dragState ? onDragEnter : undefined}
      onPointerLeave={dragState ? onDragLeave : undefined}
      style={{
        flex: '0 0 260px',
        display: 'flex',
        flexDirection: 'column',
        background: isDragOver ? 'rgba(124,111,247,0.06)' : 'var(--bg2)',
        border: `1px solid ${isDragOver ? 'rgba(124,111,247,0.3)' : 'var(--border)'}`,
        borderRadius: 10,
        overflow: 'hidden',
        transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <div
        style={{
          padding: '10px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg3)',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 600 }}>{STATUS_LABELS[status]}</span>
        <span
          style={{
            fontSize: 11,
            padding: '2px 7px',
            borderRadius: 10,
            background: 'var(--bg4)',
            color: 'var(--text2)',
          }}
        >
          {tasks.length}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px', minHeight: 0 }}>
        {tasks.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px 16px',
              gap: 8,
              color: 'var(--text3)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 24 }}>○</div>
            <div style={{ fontSize: 12 }}>No tasks here</div>
          </div>
        ) : (
          tasks.map((t) => (
            <KanbanCard
              key={t.id}
              task={t}
              collab={collab}
              isDragging={dragState?.task.id === t.id}
              onPointerDown={onPointerDown}
            />
          ))
        )}
      </div>
    </div>
  );
};

interface KanbanViewProps {
  tasks: Task[];
  collab: Record<string, CollabUser[]>;
  onStatusChange: (id: string, status: Status) => void;
}

const KanbanView: React.FC<KanbanViewProps> = ({ tasks, collab, onStatusChange }) => {
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [ghostPos, setGhostPos] = useState({ x: 0, y: 0 });
  const [dragOverCol, setDragOverCol] = useState<Status | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const byStatus = useMemo(() => {
    const map: Record<Status, Task[]> = { todo: [], inprogress: [], inreview: [], done: [] };
    tasks.forEach((t) => {
      if (map[t.status]) map[t.status].push(t);
    });
    return map;
  }, [tasks]);

  const handlePointerDown = useCallback((e: React.PointerEvent, task: Task, origin: Status) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragState({
      task,
      origin,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
    });
    setGhostPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState) return;
      setGhostPos({ x: e.clientX, y: e.clientY });
    },
    [dragState]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!dragState) return;
      if (dragOverCol && dragOverCol !== dragState.origin) {
        onStatusChange(dragState.task.id, dragOverCol);
      }
      setDragState(null);
      setDragOverCol(null);
    },
    [dragState, dragOverCol, onStatusChange]
  );

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        display: 'flex',
        gap: 12,
        padding: '12px 16px',
        overflowX: 'auto',
        height: '100%',
        cursor: dragState ? 'grabbing' : 'default',
        userSelect: 'none',
      }}
    >
      {STATUSES.map((s) => (
        <KanbanColumn
          key={s}
          status={s}
          tasks={byStatus[s]}
          collab={collab}
          dragState={dragState}
          isDragOver={dragOverCol === s}
          onPointerDown={handlePointerDown}
          onDragEnter={() => setDragOverCol(s)}
          onDragLeave={() => setDragOverCol(null)}
        />
      ))}

      {/* Ghost card that follows cursor */}
      {dragState && (
        <div
          style={{
            position: 'fixed',
            left: ghostPos.x - dragState.offsetX,
            top: ghostPos.y - dragState.offsetY,
            width: 240,
            background: 'var(--bg3)',
            border: '1px solid var(--accent)',
            borderRadius: 8,
            padding: '10px 12px',
            pointerEvents: 'none',
            zIndex: 9999,
            opacity: 0.85,
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
            transform: 'rotate(2deg)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>
            {dragState.task.title}
          </div>
          <PriorityBadge priority={dragState.task.priority} />
        </div>
      )}
    </div>
  );
};

export default KanbanView;
