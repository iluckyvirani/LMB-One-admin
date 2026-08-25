import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useProductStore } from "@/store/products";
import { CATEGORIES } from "@/lib/mockData";
import { formatINR, discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function ProductsPage() {
  const products = useProductStore((s) => s.products);
  const removeProduct = useProductStore((s) => s.removeProduct);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (category && p.category !== category) return false;
      if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [products, query, category]);

  const productToDelete = products.find((p) => p.id === deleteId) ?? null;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Products</h1>
          <p className="mt-1 text-sm text-muted">{products.length} total products</p>
        </div>
        <Link
          to="/products/new"
          className="flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-background hover:bg-gold-accent"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <label className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full border border-white/15 bg-background py-2.5 pl-9 pr-3 text-sm text-foreground outline-none focus:border-gold"
          />
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-white/15 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 overflow-x-auto border border-white/10">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const off = discountPercent(p.price, p.mrp);
              return (
                <tr
                  key={p.id}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02]"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-11 w-11 shrink-0 overflow-hidden bg-background-secondary rounded">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.title}
                            className="h-full w-full object-cover object-center"
                          />
                        ) : (
                          <div
                            className="h-full w-full"
                            style={{
                              background: `linear-gradient(135deg, ${p.swatch[0]}, ${p.swatch[1]})`,
                            }}
                          />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{p.title}</p>
                        <p className="text-xs text-muted">{p.colorway}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted">{p.category}</td>
                  <td className="px-4 py-3">
                    <span className="text-gold">{formatINR(p.price)}</span>
                    {off > 0 && (
                      <span className="ml-1.5 text-xs text-muted">{off}% off</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "text-xs font-medium",
                        p.stock === 0
                          ? "text-red-400"
                          : p.stock < 10
                            ? "text-amber-300"
                            : "text-emerald-400",
                      )}
                    >
                      {p.stock === 0 ? "Out of stock" : `${p.stock} in stock`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    ★ {p.rating} ({p.reviewsCount})
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/products/${p.id}`}
                        className="text-muted hover:text-gold"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteId(p.id)}
                        className="text-muted hover:text-red-400"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted">
                  No products match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!productToDelete}
        title="Delete product"
        description={`Are you sure you want to delete "${productToDelete?.title}"? This can't be undone.`}
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) removeProduct(deleteId);
          setDeleteId(null);
        }}
      />
    </div>
  );
}
