
import { Task, TeamMember, UserRole } from '../types';

const getBaseUrl = () => {
  // In production, this would be your Render.com URL
  return window.location.origin;
};

export const api = {
  async getData(id: string) {
    const res = await fetch(`/api/data/${id}`);
    if (!res.ok) return { tasks: [], team: [] };
    return res.json();
  },

  async saveData(id: string, data: { tasks: Task[], team: TeamMember[] }) {
    await fetch(`/api/data/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
};
