import type { AlbumStats, CountryProgress, Sticker } from "./types";

const BASE = "/api/stickers";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export const api = {
  getAll: () => request<Sticker[]>(`${BASE}/`),
  getStats: () => request<AlbumStats>(`${BASE}/stats`),
  getProgress: () => request<CountryProgress[]>(`${BASE}/progress`),
  getOwned: () => request<Sticker[]>(`${BASE}/owned`),
  getMissing: () => request<Sticker[]>(`${BASE}/missing`),
  getDuplicates: () => request<Sticker[]>(`${BASE}/duplicates`),
  getByCountry: (country: string) =>
    request<Sticker[]>(`${BASE}/country/${encodeURIComponent(country)}`),
  toggle: (code: string) =>
    request<Sticker>(`${BASE}/toggle/${code}`, { method: "POST" }),
  remove: (code: string) =>
    request<Sticker>(`${BASE}/remove/${code}`, { method: "POST" }),
  seed: () => request<{ message: string; count: number }>(`${BASE}/seed`, { method: "POST" }),
};
