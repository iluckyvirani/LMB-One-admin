import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Truck, PackageCheck } from "lucide-react";
import { useOrderStore } from "@/store/orders";
import { useShipmentStore } from "@/store/shipments";
import { useSettingsStore } from "@/store/settings";
import { COURIERS, SHIPMENT_STATUS_FLOW, SHIPMENT_STATUS_LABELS } from "@/lib/mockData";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ShipmentStatus } from "@/lib/types";

const STATUS_STYLES: Record<ShipmentStatus, string> = {
  not_shipped: "border-white/20 text-muted",
  awb_assigned: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  picked_up: "border-blue-400/40 bg-blue-400/10 text-blue-300",
  in_transit: "border-purple-400/40 bg-purple-400/10 text-purple-300",
  out_for_delivery: "border-cyan-400/40 bg-cyan-400/10 text-cyan-300",
  delivered: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  rto: "border-red-400/40 bg-red-400/10 text-red-300",
};

function CourierPicker({ onAssign }: { onAssign: (courier: string) => void }) {
  const [courier, setCourier] = useState(COURIERS[0]);
  return (
    <div className="flex items-center gap-2">
      <select
        value={courier}
        onChange={(e) => setCourier(e.target.value)}
        className="border border-white/15 bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-gold"
      >
        {COURIERS.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => onAssign(courier)}
        className="whitespace-nowrap border border-gold/50 px-3 py-1.5 text-xs text-gold hover:bg-gold/10"
      >
        Push to Shiprocket
      </button>
    </div>
  );
}

export function ShippingPage() {
  const orders = useOrderStore((s) => s.orders);
  const shipments = useShipmentStore((s) => s.shipments);
  const assignAwb = useShipmentStore((s) => s.assignAwb);
  const updateStatus = useShipmentStore((s) => s.updateStatus);
  const enabled = useSettingsStore((s) => s.settings.shiprocket.enabled);

  const rows = useMemo(() => {
    return orders
      .filter((o) => o.status !== "cancelled")
      .map((o) => ({
        order: o,
        shipment: shipments.find((s) => s.orderId === o.id),
      }))
      .sort(
        (a, b) => new Date(b.order.createdAt).getTime() - new Date(a.order.createdAt).getTime(),
      );
  }, [orders, shipments]);

  if (!enabled) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Shiprocket</h1>
        <div className="mt-10 flex flex-col items-center gap-3 py-16 text-center">
          <Truck className="h-8 w-8 text-muted" />
          <p className="text-muted">
            Shiprocket integration is disabled. Enable it in Settings to view and manage
            shipment tracking.
          </p>
          <Link
            to="/settings"
            className="mt-2 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-background hover:bg-gold-accent"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-2">
        <PackageCheck className="h-6 w-6 text-gold" />
        <h1 className="font-heading text-2xl text-foreground sm:text-3xl">
          Shiprocket Shipments
        </h1>
      </div>
      <p className="mt-1 text-sm text-muted">
        Track and manage courier shipments for every order.
      </p>

      <div className="mt-6 overflow-x-auto border border-white/10">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Courier</th>
              <th className="px-4 py-3 font-medium">AWB Code</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Last Update</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ order, shipment }) => {
              const status = shipment?.status ?? "not_shipped";
              const notShipped = status === "not_shipped";
              return (
                <tr
                  key={order.id}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <Link to={`/orders/${order.id}`} className="text-gold hover:underline">
                      {order.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{order.customerName}</td>
                  <td className="px-4 py-3 text-muted">{shipment?.courier ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{shipment?.awbCode ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-block whitespace-nowrap border px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase",
                        STATUS_STYLES[status],
                      )}
                    >
                      {SHIPMENT_STATUS_LABELS[status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {shipment ? formatDate(shipment.lastUpdate) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {notShipped ? (
                      <CourierPicker onAssign={(courier) => assignAwb(order.id, courier)} />
                    ) : (
                      <select
                        value={status}
                        onChange={(e) =>
                          updateStatus(order.id, e.target.value as ShipmentStatus)
                        }
                        className="border border-white/15 bg-background px-2 py-1.5 text-xs text-foreground outline-none focus:border-gold"
                      >
                        {SHIPMENT_STATUS_FLOW.map((s) => (
                          <option key={s} value={s}>
                            {SHIPMENT_STATUS_LABELS[s]}
                          </option>
                        ))}
                        <option value="rto">RTO</option>
                      </select>
                    )}
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted">
                  No active orders to ship.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-muted">
        This is a demo integration — AWB codes and status updates are simulated locally, no
        real Shiprocket API calls are made.
      </p>
    </div>
  );
}
