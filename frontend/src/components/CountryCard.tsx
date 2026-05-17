import type { Sticker } from "../types";

interface Props {
  country: string;
  group: string;
  stickers: Sticker[];
  onToggle: (code: string) => void;
  onRemove: (code: string) => void;
}

const FLAG_EMOJI: Record<string, string> = {
  Mexico: "\u{1F1F2}\u{1F1FD}", "South Africa": "\u{1F1FF}\u{1F1E6}", "South Korea": "\u{1F1F0}\u{1F1F7}", Czechia: "\u{1F1E8}\u{1F1FF}",
  Canada: "\u{1F1E8}\u{1F1E6}", Switzerland: "\u{1F1E8}\u{1F1ED}", Qatar: "\u{1F1F6}\u{1F1E6}", "Bosnia and Herzegovina": "\u{1F1E7}\u{1F1E6}",
  Brazil: "\u{1F1E7}\u{1F1F7}", Morocco: "\u{1F1F2}\u{1F1E6}", Haiti: "\u{1F1ED}\u{1F1F9}", Scotland: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
  USA: "\u{1F1FA}\u{1F1F8}", Paraguay: "\u{1F1F5}\u{1F1FE}", Australia: "\u{1F1E6}\u{1F1FA}", Turkiye: "\u{1F1F9}\u{1F1F7}",
  Germany: "\u{1F1E9}\u{1F1EA}", Curacao: "\u{1F1E8}\u{1F1FC}", "Ivory Coast": "\u{1F1E8}\u{1F1EE}", Ecuador: "\u{1F1EA}\u{1F1E8}",
  Netherlands: "\u{1F1F3}\u{1F1F1}", Japan: "\u{1F1EF}\u{1F1F5}", Sweden: "\u{1F1F8}\u{1F1EA}", Tunisia: "\u{1F1F9}\u{1F1F3}",
  Belgium: "\u{1F1E7}\u{1F1EA}", Egypt: "\u{1F1EA}\u{1F1EC}", Iran: "\u{1F1EE}\u{1F1F7}", "New Zealand": "\u{1F1F3}\u{1F1FF}",
  Spain: "\u{1F1EA}\u{1F1F8}", "Cape Verde": "\u{1F1E8}\u{1F1FB}", "Saudi Arabia": "\u{1F1F8}\u{1F1E6}", Uruguay: "\u{1F1FA}\u{1F1FE}",
  France: "\u{1F1EB}\u{1F1F7}", Senegal: "\u{1F1F8}\u{1F1F3}", Norway: "\u{1F1F3}\u{1F1F4}", Iraq: "\u{1F1EE}\u{1F1F6}",
  Argentina: "\u{1F1E6}\u{1F1F7}", Algeria: "\u{1F1E9}\u{1F1FF}", Austria: "\u{1F1E6}\u{1F1F9}", Jordan: "\u{1F1EF}\u{1F1F4}",
  Portugal: "\u{1F1F5}\u{1F1F9}", "Congo DR": "\u{1F1E8}\u{1F1E9}", Uzbekistan: "\u{1F1FA}\u{1F1FF}", Colombia: "\u{1F1E8}\u{1F1F4}",
  England: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}", Croatia: "\u{1F1ED}\u{1F1F7}", Ghana: "\u{1F1EC}\u{1F1ED}", Panama: "\u{1F1F5}\u{1F1E6}",
  FWC: "\u{1F3C6}",
};

export function CountryCard({ country, group, stickers, onToggle, onRemove }: Props) {
  const owned = stickers.filter((s) => s.owned).length;
  const total = stickers.length;
  const pct = total > 0 ? Math.round((owned / total) * 100) : 0;
  const flag = FLAG_EMOJI[country] ?? "\u{1F3F3}\u{FE0F}";
  const isComplete = owned === total;

  const groupLabel = group === "FWC" ? "Especiais" : group === "Coca-Cola" ? "Coca-Cola" : `Grupo ${group}`;

  return (
    <div
      className={`rounded-xl border transition-all ${
        isComplete
          ? "border-emerald-500 bg-emerald-950/30 shadow-lg shadow-emerald-500/10"
          : "border-zinc-700 bg-zinc-900"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-zinc-700/50">
        <div className="flex items-center gap-2">
          <span className="text-xl">{flag}</span>
          <div>
            <h3 className="font-semibold text-white text-sm">{country}</h3>
            <span className="text-xs text-zinc-500">{groupLabel}</span>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-sm font-bold ${isComplete ? "text-emerald-400" : "text-zinc-400"}`}>
            {owned}/{total}
          </span>
          <div className="w-16 bg-zinc-700 rounded-full h-1.5 mt-1">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                isComplete ? "bg-emerald-400" : "bg-teal-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
      <div className="p-3 flex flex-wrap gap-1.5">
        {stickers.map((s) => (
          <StickerChip key={s.id} sticker={s} onToggle={onToggle} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}

function StickerChip({
  sticker,
  onToggle,
  onRemove,
}: {
  sticker: Sticker;
  onToggle: (code: string) => void;
  onRemove: (code: string) => void;
}) {
  const isDuplicate = sticker.quantity > 1;

  return (
    <button
      onClick={() => onToggle(sticker.code)}
      onContextMenu={(e) => {
        e.preventDefault();
        onRemove(sticker.code);
      }}
      title={`${sticker.code} - ${sticker.name}${sticker.owned ? ` (x${sticker.quantity})` : ""}\nClique esquerdo: adicionar | Clique direito: remover`}
      className={`
        relative px-2 py-1 rounded-md text-xs font-mono cursor-pointer transition-all
        ${
          sticker.owned
            ? isDuplicate
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
            : "bg-zinc-800 text-zinc-500 border border-zinc-700 hover:bg-zinc-700 hover:text-zinc-300"
        }
      `}
    >
      {sticker.code}
      {isDuplicate && (
        <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-black text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {sticker.quantity}
        </span>
      )}
    </button>
  );
}
