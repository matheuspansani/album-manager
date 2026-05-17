import { useCallback, useMemo, useState } from "react";
import { api } from "./api";
import { CountryCard } from "./components/CountryCard";
import { DuplicatesPanel } from "./components/DuplicatesPanel";
import { QuickAdd } from "./components/QuickAdd";
import { SearchBar } from "./components/SearchBar";
import { StatsBar } from "./components/StatsBar";
import { useAlbum } from "./hooks/useAlbum";

type Tab = "album" | "duplicates";

function App() {
  const { stickers, stats, loading, toggle, remove, refresh } = useAlbum();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [tab, setTab] = useState<Tab>("album");

  const filtered = useMemo(() => {
    let list = stickers;
    if (filter === "owned") list = list.filter((s) => s.owned);
    if (filter === "missing") list = list.filter((s) => !s.owned);
    if (filter === "duplicates") list = list.filter((s) => s.quantity > 1);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          s.code.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q)
      );
    }
    return list;
  }, [stickers, search, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, { country: string; group: string; stickers: typeof filtered }>();
    for (const s of filtered) {
      const key = s.country;
      if (!map.has(key)) map.set(key, { country: s.country, group: s.group, stickers: [] });
      map.get(key)!.stickers.push(s);
    }
    return Array.from(map.values());
  }, [filtered]);

  const handleQuickAdd = useCallback(
    async (codes: string[]) => {
      for (const code of codes) {
        await api.toggle(code);
      }
      await refresh();
    },
    [refresh]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 mt-4">Carregando album...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Copa do Mundo FIFA 2026
              </h1>
              <p className="text-sm text-zinc-500">Gerenciador de Figurinhas</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTab("album")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === "album"
                    ? "bg-teal-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                Album
              </button>
              <button
                onClick={() => setTab("duplicates")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === "duplicates"
                    ? "bg-amber-600 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                Trocas
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {stats && <StatsBar stats={stats} />}

        <QuickAdd onAdd={handleQuickAdd} />

        {tab === "album" ? (
          <>
            <SearchBar
              value={search}
              onChange={setSearch}
              filter={filter}
              onFilterChange={setFilter}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {grouped.map((g) => (
                <CountryCard
                  key={g.country}
                  country={g.country}
                  group={g.group}
                  stickers={g.stickers}
                  onToggle={toggle}
                  onRemove={remove}
                />
              ))}
            </div>
            {grouped.length === 0 && (
              <p className="text-center text-zinc-500 py-12">Nenhuma figurinha encontrada.</p>
            )}
          </>
        ) : (
          <DuplicatesPanel stickers={stickers} onRemove={remove} />
        )}
      </main>
    </div>
  );
}

export default App;
