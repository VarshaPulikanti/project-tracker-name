import React from 'react';
import { Priority } from '../types';
import { PRIORITY_COLORS } from '../data/seed';

interface PriorityBadgeProps {
  priority: Priority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const c = PRIORITY_COLORS[priority];
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        padding: '2px 6px',
        borderRadius: 4,
        background: c + '22',
        color: c,
        border: `1px solid ${c}44`,
      }}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
