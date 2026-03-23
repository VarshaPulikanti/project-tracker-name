import React from 'react';
import { User } from '../types';
import { initials } from '../utils';

interface CollabUser extends User {
  currentTask: string;
}

interface CollabBarProps {
  viewers: CollabUser[];
}

const CollabBar: React.FC<CollabBarProps> = ({ viewers }) => {
  if (!viewers.length) return null;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '6px 16px',
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        fontSize: 12,
        color: 'var(--text2)',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex' }}>
        {viewers.slice(0, 3).map((u, i) => (
          <div
            key={u.id}
            style={{
              marginLeft: i > 0 ? -8 : 0,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: u.color + '33',
              border: `2px solid ${u.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 600,
              color: u.color,
              zIndex: 3 - i,
              position: 'relative',
            }}
          >
            {initials(u.name)}
          </div>
        ))}
        {viewers.length > 3 && (
          <div
            style={{
              marginLeft: -8,
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'var(--bg4)',
              border: '2px solid var(--border2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 600,
              color: 'var(--text2)',
            }}
          >
            +{viewers.length - 3}
          </div>
        )}
      </div>
      <span>
        {viewers.length} {viewers.length === 1 ? 'person' : 'people'} viewing this board
      </span>
    </div>
  );
};

export default CollabBar;
