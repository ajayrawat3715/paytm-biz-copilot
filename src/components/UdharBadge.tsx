import { statusLabel, statusOf, type UdharEntry } from "@/lib/khata";
import { cn } from "@/lib/utils";

export function UdharBadge({ entry }: { entry: UdharEntry }) {
  const status = statusOf(entry);
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
        status === "settled" && "bg-emerald/10 text-emerald",
        status === "overdue" && "bg-rust/10 text-rust",
        status === "active" && "bg-sand text-ink",
      )}
    >
      {statusLabel(entry)}
    </span>
  );
}
