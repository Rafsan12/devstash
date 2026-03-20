export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-[22px] border border-white/10 bg-black/20 p-5">
      <span className="text-sm font-medium text-zinc-400">{label}</span>
      <span className="text-2xl font-semibold text-white">{value}</span>
    </div>
  );
}
