import { useState, useEffect } from 'react';
import { User } from '../types';
import { USERS } from '../data/seed';

interface CollabUser extends User {
  currentTask: string;
}

export function useCollabSimulation(taskIds: string[]) {
  const [viewers, setViewers] = useState<CollabUser[]>([]);
  const [collab, setCollab] = useState<Record<string, CollabUser[]>>({});

  useEffect(() => {
    if (!taskIds.length) return;

    const simUsers: CollabUser[] = USERS.slice(0, 4).map((u) => ({
      ...u,
      currentTask: taskIds[Math.floor(Math.random() * taskIds.length)],
    }));

    const buildMap = (users: CollabUser[]) => {
      const map: Record<string, CollabUser[]> = {};
      users.forEach((u) => {
        if (!map[u.currentTask]) map[u.currentTask] = [];
        map[u.currentTask].push(u);
      });
      return map;
    };

    setViewers(simUsers);
    setCollab(buildMap(simUsers));

    const interval = setInterval(() => {
      setViewers((prev) => {
        const next = prev.map((u) => {
          if (Math.random() > 0.4) return u;
          return { ...u, currentTask: taskIds[Math.floor(Math.random() * taskIds.length)] };
        });
        setCollab(buildMap(next));
        return next;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [taskIds.join(',')]);

  return { viewers, collab };
}
