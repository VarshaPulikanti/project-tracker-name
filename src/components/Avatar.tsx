import React from 'react';
import { User } from '../types';
import { initials } from '../utils';

interface AvatarProps {
  user: User;
  size?: number;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 28 }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: user.color + '33',
        border: `1.5px solid ${user.color}66`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.36,
        fontWeight: 600,
        color: user.color,
        flexShrink: 0,
      }}
    >
      {initials(user.name)}
    </div>
  );
};

export default Avatar;
