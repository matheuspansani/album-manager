interface Props {
  value: string;
  onChange: (v: string) => void;
  filter: string;
  onFilterChange: (v: string) => void;
}

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "owned", label: "Coladas" },
  { key: "missing", label: "Faltando" },
  { key: "duplicates", label: "Repetidas" },
];

export function SearchBar({ value, onChange, filter, onFilterChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="Buscar por codigo, jogador ou pais..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
      />
      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => onFilterChange(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-teal-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
