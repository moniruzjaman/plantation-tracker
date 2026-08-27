const API_BASE = '/api';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  farmers: {
    list: () => apiFetch<any[]>('/farmers'),
    get: (id: string) => apiFetch<any>(`/farmers/${id}`),
    create: (data: any) => apiFetch<any>('/farmers', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/farmers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<void>(`/farmers/${id}`, { method: 'DELETE' }),
  },
  plantations: {
    list: () => apiFetch<any[]>('/plantations'),
    get: (id: string) => apiFetch<any>(`/plantations/${id}`),
    create: (data: any) => apiFetch<any>('/plantations', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/plantations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => apiFetch<void>(`/plantations/${id}`, { method: 'DELETE' }),
  },
  monitoring: {
    list: () => apiFetch<any[]>('/monitoring'),
    get: (id: string) => apiFetch<any>(`/monitoring/${id}`),
    create: (data: any) => apiFetch<any>('/monitoring', { method: 'POST', body: JSON.stringify(data) }),
  },
  tasks: {
    list: () => apiFetch<any[]>('/tasks'),
    create: (data: any) => apiFetch<any>('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: any) => apiFetch<any>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  notifications: {
    list: () => apiFetch<any[]>('/notifications'),
    markRead: (id: string) => apiFetch<void>(`/notifications/${id}/read`, { method: 'PATCH' }),
  },
  reports: {
    generate: (type: string) => apiFetch<any>('/reports/generate', { method: 'POST', body: JSON.stringify({ type }) }),
    list: () => apiFetch<any[]>('/reports'),
  },
  sync: {
    status: () => apiFetch<any>('/sync/status'),
    post: (items: any[]) => apiFetch<any>('/sync', { method: 'POST', body: JSON.stringify({ items }) }),
  }
};
