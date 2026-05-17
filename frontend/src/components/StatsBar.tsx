import type { AlbumStats } from "../types";

export function StatsBar({ stats }: { stats: AlbumStats }) {
  return (
    <div className="bg-gradient-to-r from-emerald-900 to-teal-800 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Progresso do Album</h2>
        <span className="text-3xl font-bold">{stats.completion_percentage}%</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-4 mb-4">
        <div
          className="bg-emerald-400 h-4 rounded-full transition-all duration-500"
          style={{ width: `${stats.completion_percentage}%` }}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <Stat label="Total" value={stats.total} />
        <Stat label="Coladas" value={stats.owned} color="text-emerald-300" />
        <Stat label="Faltando" value={stats.missing} color="text-red-300" />
        <Stat label="Repetidas" value={stats.duplicates} color="text-amber-300" />
      </div>
    </div>
  );
}

function Stat({ label, value, color = "text-white" }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-sm text-white/70">{label}</p>
    </div>
  );
}
