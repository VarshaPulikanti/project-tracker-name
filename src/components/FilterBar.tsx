import React, { useState, useRef, useEffect } from 'react';
import { Filters, Status, Priority } from '../types';
import { STATUSES, PRIORITIES, USERS, STATUS_LABELS } from '../data/seed';

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (val: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (v: string) =>
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '5px 10px',
          borderRadius: 6,
          background: value.length ? 'rgba(124,111,247,0.15)' : 'var(--bg3)',
          border: `1px solid ${value.length ? 'rgba(124,111,247,0.4)' : 'var(--border)'}`,
          color: value.length ? 'var(--accent2)' : 'var(--text2)',
          fontSize: 13,
          whiteSpace: 'nowrap',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {label}
        {value.length ? ` (${value.length})` : ''}
        <span style={{ fontSize: 9, opacity: 0.6 }}>▼</span>
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 100,
            background: 'var(--bg3)',
            border: '1px solid var(--border2)',
            borderRadius: 8,
            padding: 4,
            minWidth: 150,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          {options.map((o) => (
            <label
              key={o.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                cursor: 'pointer',
                borderRadius: 5,
                fontSize: 13,
                background: value.includes(o.value) ? 'rgba(124,111,247,0.1)' : 'transparent',
              }}
            >
              <input
                type="checkbox"
                checked={value.includes(o.value)}
                onChange={() => toggle(o.value)}
                style={{ accentColor: 'var(--accent)' }}
              />
              {o.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

interface FilterBarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onChange }) => {
  const hasFilters =
    filters.status.length ||
    filters.priority.length ||
    filters.assignee.length ||
    filters.dateFrom ||
    filters.dateTo;

  const clearAll = () =>
    onChange({ status: [], priority: [], assignee: [], dateFrom: '', dateTo: '' });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        padding: '8px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)',
        flexShrink: 0,
      }}
    >
      <MultiSelect
        label="Status"
        value={filters.status}
        onChange={(v) => onChange({ ...filters, status: v as Status[] })}
        options={STATUSES.map((s) => ({ value: s, label: STATUS_LABELS[s] }))}
      />
      <MultiSelect
        label="Priority"
        value={filters.priority}
        onChange={(v) => onChange({ ...filters, priority: v as Priority[] })}
        options={PRIORITIES.map((p) => ({
          value: p,
          label: p.charAt(0).toUpperCase() + p.slice(1),
        }))}
      />
      <MultiSelect
        label="Assignee"
        value={filters.assignee}
        onChange={(v) => onChange({ ...filters, assignee: v })}
        options={USERS.map((u) => ({ value: u.id, label: u.name }))}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>From</span>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
          style={{
            fontSize: 12,
            padding: '4px 8px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--bg3)',
            color: 'var(--text)',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>To</span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
          style={{
            fontSize: 12,
            padding: '4px 8px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'var(--bg3)',
            color: 'var(--text)',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
      {hasFilters && (
        <button
          onClick={clearAll}
          style={{
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 6,
            background: 'rgba(226,80,80,0.1)',
            border: '1px solid rgba(226,80,80,0.3)',
            color: 'var(--red)',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
