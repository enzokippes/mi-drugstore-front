const API_BASE = (import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:3000').replace(/\/$/, '');

export function getImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_BASE}${path}`;
}

export function getApiBase(): string {
  return API_BASE;
}
