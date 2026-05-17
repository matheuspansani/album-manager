import type { Sticker } from "../types";

interface Props {
  stickers: Sticker[];
  onRemove: (code: string) => void;
}

export function DuplicatesPanel({ stickers, onRemove }: Props) {
  const duplicates = stickers.filter((s) => s.quantity > 1);

  if (duplicates.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-500">
        <p className="text-lg">Nenhuma figurinha repetida</p>
        <p className="text-sm mt-1">Figurinhas repetidas aparecerão aqui para troca</p>
      </div>
    );
  }

  const totalExtras = duplicates.reduce((sum, s) => sum + (s.quantity - 1), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Lista de Trocas</h3>
        <span className="text-sm text-amber-400">{totalExtras} figurinhas disponiveis para troca</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {duplicates.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between bg-zinc-800 rounded-lg px-3 py-2 border border-zinc-700"
          >
            <div className="min-w-0">
              <span className="font-mono text-amber-300 text-sm">{s.code}</span>
              <p className="text-xs text-zinc-500 truncate">{s.name}</p>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <span className="text-amber-400 font-bold text-sm">x{s.quantity - 1}</span>
              <button
                onClick={() => onRemove(s.code)}
                className="text-zinc-500 hover:text-red-400 transition-colors text-lg leading-none"
                title="Remover uma"
              >
                -
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
