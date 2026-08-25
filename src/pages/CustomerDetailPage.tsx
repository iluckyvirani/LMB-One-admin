import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Ban, CheckCircle2, ChevronRight, Trash2 } from "lucide-react";
import { useCustomerStore } from "@/store/customers";
import { useOrderStore } from "@/store/orders";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { formatINR, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border border-white/15 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold disabled:opacity-60";
const labelClass = "block text-xs uppercase tracking-widest text-muted mb-1.5";

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const getCustomer = useCustomerStore((s) => s.getCustomer);
  const updateCustomer = useCustomerStore((s) => s.updateCustomer);
  const removeCustomer = useCustomerStore((s) => s.removeCustomer);
  const setBlocked = useCustomerStore((s) => s.setBlocked);
  const orders = useOrderStore((s) => s.orders);

  const customer = id ? getCustomer(id) : undefined;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone);
    }
  }, [customer]);

  const customerOrders = useMemo(() => {
    if (!customer) return [];
    return [...orders]
      .filter((o) => o.customerPhone === customer.phone)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [orders, customer]);

  if (!customer) {
    return (
      <div className="p-8 text-center text-muted">
        Customer not found.{" "}
        <Link to="/customers" className="text-gold hover:underline">
          Back to customers
        </Link>
      </div>
    );
  }

  function saveDetails() {
    if (!customer) return;
    updateCustomer(customer.id, { name: name.trim(), email: email.trim(), phone: phone.trim() });
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link
        to="/customers"
        className="mb-4 flex items-center gap-2 text-sm text-gold hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Customers
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl text-foreground sm:text-3xl">{customer.name}</h1>
          <p className="mt-1 text-sm text-muted">Customer since {formatDate(customer.joinedAt)}</p>
        </div>
        {customer.blocked && (
          <span className="flex items-center gap-1.5 border border-red-400/40 bg-red-400/10 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-red-300">
            <Ban className="h-3.5 w-3.5" />
            Blocked
          </span>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-heading text-lg text-foreground">Customer Details</h2>
              <button
                type="button"
                onClick={() => setEditing((v) => !v)}
                className="text-sm text-gold hover:text-gold-accent"
              >
                {editing ? "Cancel" : "Edit"}
              </button>
            </div>
            {saved && <p className="mb-3 text-sm text-gold">Details saved successfully.</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  disabled={!editing}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input
                  disabled={!editing}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Email</label>
                <input
                  disabled={!editing}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            {editing && (
              <button
                type="button"
                onClick={saveDetails}
                className="mt-4 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-background hover:bg-gold-accent"
              >
                Save Changes
              </button>
            )}
          </section>

          <section className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 font-heading text-lg text-foreground">
              Orders ({customerOrders.length})
            </h2>
            {customerOrders.length === 0 ? (
              <p className="text-sm text-muted">This customer hasn&apos;t placed any orders.</p>
            ) : (
              <ul className="space-y-3">
                {customerOrders.map((o) => (
                  <li key={o.id}>
                    <Link
                      to={`/orders/${o.id}`}
                      className="flex items-center justify-between gap-3 border border-white/10 p-3 text-sm transition-colors hover:border-gold/40"
                    >
                      <span>
                        <span className="block text-foreground">{o.id}</span>
                        <span className="block text-xs text-muted">{formatDate(o.createdAt)}</span>
                      </span>
                      <span className="flex items-center gap-3">
                        <span className="font-[family-name:var(--font-poppins)] text-gold">
                          {formatINR(o.total)}
                        </span>
                        <StatusBadge status={o.status} />
                        <ChevronRight className="h-4 w-4 text-muted" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <div className="border border-white/10 bg-white/[0.02] p-5">
            <h3 className="text-sm tracking-widest text-gold uppercase">Summary</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between text-muted">
                <dt>Total Orders</dt>
                <dd className="text-foreground">{customer.ordersCount}</dd>
              </div>
              <div className="flex justify-between text-muted">
                <dt>Total Spent</dt>
                <dd className="text-gold">{formatINR(customer.totalSpent)}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-2 border border-white/10 bg-white/[0.02] p-5">
            <h3 className="mb-1 text-sm tracking-widest text-gold uppercase">Actions</h3>
            <button
              type="button"
              onClick={() => setBlocked(customer.id, !customer.blocked)}
              className={cn(
                "flex w-full items-center justify-center gap-2 border px-4 py-2.5 text-sm transition-colors",
                customer.blocked
                  ? "border-emerald-400/40 text-emerald-300 hover:bg-emerald-400/10"
                  : "border-red-400/40 text-red-300 hover:bg-red-400/10",
              )}
            >
              {customer.blocked ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Unblock Customer
                </>
              ) : (
                <>
                  <Ban className="h-4 w-4" />
                  Block Customer
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="flex w-full items-center justify-center gap-2 border border-white/15 px-4 py-2.5 text-sm text-muted hover:border-red-400/40 hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
              Delete Customer
            </button>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete customer"
        description={`Are you sure you want to delete "${customer.name}"? This can't be undone.`}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          removeCustomer(customer.id);
          navigate("/customers");
        }}
      />
    </div>
  );
}
