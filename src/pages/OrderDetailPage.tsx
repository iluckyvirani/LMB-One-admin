import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useOrderStore } from "@/store/orders";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatINR, formatDate } from "@/lib/format";
import { ORDER_STATUS_FLOW, ORDER_STATUS_LABELS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

export function OrderDetailPage() {
  const { id } = useParams();
  const order = useOrderStore((s) => (id ? s.getOrder(id) : undefined));
  const updateStatus = useOrderStore((s) => s.updateStatus);

  if (!order) {
    return (
      <div className="p-8 text-center text-muted">
        Order not found.{" "}
        <Link to="/orders" className="text-gold hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_FLOW.indexOf(
    order.status as (typeof ORDER_STATUS_FLOW)[number],
  );
  const isCancelled = order.status === "cancelled";

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link to="/orders" className="mb-4 flex items-center gap-2 text-sm text-gold hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground sm:text-3xl">{order.id}</h1>
          <p className="mt-1 text-sm text-muted">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 font-heading text-lg text-foreground">Update Status</h2>
            {isCancelled ? (
              <p className="text-sm text-red-400">
                This order was cancelled and cannot be updated.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUS_FLOW.map((status, i) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => updateStatus(order.id, status as OrderStatus)}
                    className={cn(
                      "border px-3 py-2 text-xs transition-colors",
                      i === currentIndex
                        ? "border-gold bg-gold/10 text-gold"
                        : i < currentIndex
                          ? "border-white/15 text-muted"
                          : "border-white/15 text-foreground hover:border-gold/40",
                    )}
                  >
                    {ORDER_STATUS_LABELS[status]}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => updateStatus(order.id, "cancelled")}
                  className="border border-red-400/30 px-3 py-2 text-xs text-red-400 hover:bg-red-400/10"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </section>

          <section className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 font-heading text-lg text-foreground">Items</h2>
            <ul className="space-y-3">
              {order.items.map((item, i) => (
                <li
                  key={`${item.productId}-${i}`}
                  className="flex gap-3 border border-white/10 p-3"
                >
                  <span className="h-16 w-16 shrink-0 overflow-hidden bg-background-secondary rounded">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{
                          background: `linear-gradient(135deg, ${item.swatch[0]}, ${item.swatch[1]})`,
                        }}
                      />
                    )}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{item.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      Size {item.size} · Qty {item.qty} · {formatINR(item.price)}
                    </p>
                  </div>
                  <p className="font-[family-name:var(--font-poppins)] text-gold">
                    {formatINR(item.price * item.qty)}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-4">
          <div className="border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm tracking-widest text-gold uppercase">Customer</h3>
            <p className="mt-3 text-sm text-white">{order.customerName}</p>
            <p className="mt-1 text-sm text-muted">{order.customerPhone}</p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm tracking-widest text-gold uppercase">
              Delivery Address
            </h3>
            <p className="mt-3 text-sm text-muted">
              {order.address}
              <br />
              {order.city}, {order.state} — {order.pincode}
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm tracking-widest text-gold uppercase">Price Details</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <dt>Subtotal</dt>
                <dd>{formatINR(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-muted">
                <dt>Shipping</dt>
                <dd>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-white/10 pt-2 text-white">
                <dt>Total</dt>
                <dd className="font-[family-name:var(--font-poppins)] text-gold">
                  {formatINR(order.total)}
                </dd>
              </div>
              <p className="text-xs capitalize text-muted">
                Paid by: {order.paymentMethod}
              </p>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
