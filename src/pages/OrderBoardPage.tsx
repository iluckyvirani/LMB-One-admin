import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useOrderStore } from "@/store/orders";
import { ORDER_STATUS_LABELS } from "@/lib/mockData";
import { formatINR, formatDate } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLUMNS: OrderStatus[] = [
  "ordered",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const COLUMN_ACCENTS: Record<OrderStatus, string> = {
  ordered: "border-t-blue-400",
  packed: "border-t-amber-400",
  shipped: "border-t-purple-400",
  out_for_delivery: "border-t-cyan-400",
  delivered: "border-t-emerald-400",
  cancelled: "border-t-red-400",
};

function OrderCard({ order, dragging }: { order: Order; dragging?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: order.id,
  });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "touch-none cursor-grab border border-white/10 bg-white/[0.03] p-3 text-sm active:cursor-grabbing",
        (isDragging || dragging) && "opacity-40",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-foreground">{order.customerName}</p>
        <p className="shrink-0 font-[family-name:var(--font-poppins)] text-gold">
          {formatINR(order.total)}
        </p>
      </div>
      <p className="mt-1 text-xs text-muted">
        {order.id} · {formatDate(order.createdAt)}
      </p>
      <p className="mt-1 text-xs text-muted">
        {order.items.length} item{order.items.length > 1 ? "s" : ""}
      </p>
      <Link
        to={`/orders/${order.id}`}
        onPointerDown={(e) => e.stopPropagation()}
        className="mt-2 inline-block text-xs text-gold hover:underline"
      >
        View details →
      </Link>
    </div>
  );
}

function Column({ status, orders }: { status: OrderStatus; orders: Order[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col border-t-2 bg-white/[0.02] transition-colors",
        COLUMN_ACCENTS[status],
        isOver && "bg-gold/5",
      )}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground">
          {ORDER_STATUS_LABELS[status]}
        </p>
        <span className="text-xs text-muted">{orders.length}</span>
      </div>
      <div className="min-h-[140px] flex-1 space-y-2 p-2.5">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
        {orders.length === 0 && (
          <p className="py-6 text-center text-xs text-muted">No orders</p>
        )}
      </div>
    </div>
  );
}

export function OrderBoardPage() {
  const orders = useOrderStore((s) => s.orders);
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const activeOrder = orders.find((o) => o.id === activeId) ?? null;

  function onDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const newStatus = over.id as OrderStatus;
    const order = orders.find((o) => o.id === active.id);
    if (order && order.status !== newStatus) {
      updateStatus(String(active.id), newStatus);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Order Board</h1>
      <p className="mt-1 text-sm text-muted">
        Drag an order card into another column to update its status.
      </p>

      <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((status) => (
            <Column
              key={status}
              status={status}
              orders={orders.filter((o) => o.status === status)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeOrder ? <OrderCard order={activeOrder} dragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
