
import { Task, TeamMember } from '../types';

export const api = {
  async getData(id: string) {
    try {
      const res = await fetch(`/api/data/${id}`);
      if (!res.ok) throw new Error("Fetch failed");
      return res.json();
    } catch (e) {
      return { tasks: [], team: [] };
    }
  },

  async saveData(id: string, data: { tasks: Task[], team: TeamMember[] }) {
    try {
      await fetch(`/api/data/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    } catch (e) {
      console.error("Save error", e);
    }
  }
};
