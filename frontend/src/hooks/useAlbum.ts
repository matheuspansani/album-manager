import { useCallback, useEffect, useState } from "react";
import { api } from "../api";
import type { AlbumStats, CountryProgress, Sticker } from "../types";

export function useAlbum() {
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [stats, setStats] = useState<AlbumStats | null>(null);
  const [progress, setProgress] = useState<CountryProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [s, st, p] = await Promise.all([
      api.getAll(),
      api.getStats(),
      api.getProgress(),
    ]);
    setStickers(s);
    setStats(st);
    setProgress(p);
  }, []);

  useEffect(() => {
    api
      .seed()
      .then(() => refresh())
      .finally(() => setLoading(false));
  }, [refresh]);

  const toggle = useCallback(
    async (code: string) => {
      await api.toggle(code);
      await refresh();
    },
    [refresh]
  );

  const remove = useCallback(
    async (code: string) => {
      await api.remove(code);
      await refresh();
    },
    [refresh]
  );

  return { stickers, stats, progress, loading, toggle, remove, refresh };
}
