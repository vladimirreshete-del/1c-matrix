
import { Task, TeamMember } from '../types';

export const api = {
  async getData(id: string) {
    try {
      const res = await fetch(`/api/data/${id}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`Fetch failed with status ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn("API getData error, returning defaults:", e);
      return { tasks: [], team: [] };
    }
  },

  async saveData(id: string, data: { tasks: Task[], team: TeamMember[] }) {
    try {
      const res = await fetch(`/api/data/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Save failed");
      return await res.json();
    } catch (e) {
      console.error("Save error", e);
      return { success: false };
    }
  }
};
