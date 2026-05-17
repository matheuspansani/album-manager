import { useState } from "react";

interface Props {
  onAdd: (codes: string[]) => void;
}

export function QuickAdd({ onAdd }: Props) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const codes = input
      .toUpperCase()
      .split(/[\s,;]+/)
      .map((c) => c.trim())
      .filter(Boolean);
    if (codes.length > 0) {
      onAdd(codes);
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        placeholder="Adicao rapida: digite os codigos (ex: BRA1, ARG5, FWC3)..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-mono"
      />
      <button
        type="submit"
        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg transition-colors"
      >
        Adicionar
      </button>
    </form>
  );
}
