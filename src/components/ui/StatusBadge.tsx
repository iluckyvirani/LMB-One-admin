import { cn } from "@/lib/utils";
import { ORDER_STATUS_LABELS } from "@/lib/mockData";
import type { OrderStatus } from "@/lib/types";

const STATUS_STYLES: Record<OrderStatus, string> = {
  ordered: "border-blue-400/40 bg-blue-400/10 text-blue-300",
  packed: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  shipped: "border-purple-400/40 bg-purple-400/10 text-purple-300",
  out_for_delivery: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  delivered: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  cancelled: "border-red-400/40 bg-red-400/10 text-red-300",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase",
        STATUS_STYLES[status],
      )}
    >
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
