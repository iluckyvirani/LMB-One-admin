import { useState } from "react";
import {
  Image as ImageIcon,
  MessageSquareQuote,
  ShieldCheck,
  CreditCard,
  Trash2,
  Pencil,
  Plus,
  Truck,
  RotateCcw,
  Banknote,
  Package,
  Clock,
  Star,
  Heart,
  Award,
  CheckCircle,
  Gift,
  type LucideIcon,
} from "lucide-react";
import {
  useContentStore,
  type Banner,
  type Testimonial,
  type TrustItem,
  type BankOffer,
} from "@/store/content";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

const inputClass =
  "w-full border border-white/15 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold";
const labelClass = "block text-xs uppercase tracking-widest text-muted mb-1.5";

const TABS = [
  { id: "banners", label: "Banners", Icon: ImageIcon },
  { id: "testimonials", label: "Testimonials", Icon: MessageSquareQuote },
  { id: "trust", label: "Trust Strip", Icon: ShieldCheck },
  { id: "bank", label: "Bank Offers", Icon: CreditCard },
] as const;

type TabId = (typeof TABS)[number]["id"];

export const ICON_OPTIONS: { value: string; label: string; Icon: LucideIcon }[] = [
  { value: "truck", label: "Truck", Icon: Truck },
  { value: "rotate-ccw", label: "Returns", Icon: RotateCcw },
  { value: "shield-check", label: "Shield", Icon: ShieldCheck },
  { value: "banknote", label: "Banknote", Icon: Banknote },
  { value: "package", label: "Package", Icon: Package },
  { value: "credit-card", label: "Card", Icon: CreditCard },
  { value: "clock", label: "Clock", Icon: Clock },
  { value: "star", label: "Star", Icon: Star },
  { value: "heart", label: "Heart", Icon: Heart },
  { value: "award", label: "Award", Icon: Award },
  { value: "check-circle", label: "Check", Icon: CheckCircle },
  { value: "gift", label: "Gift", Icon: Gift },
];

function iconFor(value: string) {
  return ICON_OPTIONS.find((o) => o.value === value)?.Icon ?? Truck;
}

export function ContentPage() {
  const [tab, setTab] = useState<TabId>("banners");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Content</h1>
      <p className="mt-1 text-sm text-muted">
        Manage the home page banners, testimonials, trust strip and bank offers shown on
        the storefront.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-white/10">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm transition-colors",
              tab === id
                ? "border-gold text-gold"
                : "border-transparent text-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "banners" && <BannersTab />}
        {tab === "testimonials" && <TestimonialsTab />}
        {tab === "trust" && <TrustItemsTab />}
        {tab === "bank" && <BankOffersTab />}
      </div>
    </div>
  );
}

// ---- Banners ----

function emptyBanner(): Omit<Banner, "id"> {
  return {
    href: "/shop",
    image: null,
    swatch: ["#1a1a1a", "#3a3a3a"],
    badge: "",
    eyebrow: "",
    title: "",
    subtitle: "",
    cta: "Shop Now",
    position: 0,
    active: true,
  };
}

function BannersTab() {
  const banners = useContentStore((s) => s.banners);
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      {banners
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((b) => (
          <BannerCard key={b.id} banner={b} />
        ))}

      {adding ? (
        <BannerForm initial={emptyBanner()} onDone={() => setAdding(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 border border-dashed border-white/20 py-4 text-sm text-muted hover:border-gold/40 hover:text-gold"
        >
          <Plus className="h-4 w-4" />
          Add Banner
        </button>
      )}
    </div>
  );
}

function BannerCard({ banner }: { banner: Banner }) {
  const removeBanner = useContentStore((s) => s.removeBanner);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (editing) {
    return <BannerForm initial={banner} bannerId={banner.id} onDone={() => setEditing(false)} />;
  }

  return (
    <div className="flex gap-4 border border-white/10 bg-white/[0.03] p-4">
      <div
        className="h-20 w-32 shrink-0 overflow-hidden bg-background-secondary"
        style={{ background: `linear-gradient(135deg, ${banner.swatch[0]}, ${banner.swatch[1]})` }}
      >
        {banner.image && (
          <img src={banner.image} alt={banner.title} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm text-foreground">{banner.title}</p>
            <p className="mt-1 text-xs text-muted">
              {banner.href} · position {banner.position} · {banner.active ? "active" : "hidden"}
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-muted hover:text-gold"
              aria-label="Edit"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="text-muted hover:text-red-400"
              aria-label="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={deleteOpen}
        title="Delete banner"
        description={`Delete "${banner.title}"? This can't be undone.`}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          removeBanner(banner.id);
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}

function BannerForm({
  initial,
  bannerId,
  onDone,
}: {
  initial: Omit<Banner, "id">;
  bannerId?: number;
  onDone: () => void;
}) {
  const addBanner = useContentStore((s) => s.addBanner);
  const updateBanner = useContentStore((s) => s.updateBanner);
  const uploadBannerImage = useContentStore((s) => s.uploadBannerImage);
  const [form, setForm] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof Omit<Banner, "id">>(key: K, value: Omit<Banner, "id">[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onImageSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadBannerImage(file);
      set("image", url);
    } catch {
      setError("Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!form.title.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (bannerId) await updateBanner(bannerId, form);
      else await addBanner(form);
      onDone();
    } catch {
      setError("Could not save this banner.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 border border-gold/30 bg-white/[0.03] p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Title</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Badge</label>
          <input value={form.badge} onChange={(e) => set("badge", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Eyebrow</label>
          <input value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Subtitle</label>
          <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Link (href)</label>
          <input value={form.href} onChange={(e) => set("href", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>CTA Label</label>
          <input value={form.cta} onChange={(e) => set("cta", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Position</label>
          <input
            type="number"
            value={form.position}
            onChange={(e) => set("position", Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 pb-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 accent-[var(--gold)]"
            />
            Active
          </label>
        </div>
        <div>
          <label className={labelClass}>Swatch Color 1</label>
          <input
            type="color"
            value={form.swatch[0]}
            onChange={(e) => set("swatch", [e.target.value, form.swatch[1]])}
            className="h-10 w-full border border-white/15 bg-background"
          />
        </div>
        <div>
          <label className={labelClass}>Swatch Color 2</label>
          <input
            type="color"
            value={form.swatch[1]}
            onChange={(e) => set("swatch", [form.swatch[0], e.target.value])}
            className="h-10 w-full border border-white/15 bg-background"
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Image</label>
          <div className="flex items-center gap-3">
            {form.image && (
              <img src={form.image} alt="" className="h-14 w-20 shrink-0 object-cover" />
            )}
            <label className="cursor-pointer border border-white/15 px-3 py-2 text-xs text-muted hover:border-gold/40 hover:text-gold">
              {uploading ? "Uploading…" : form.image ? "Replace Image" : "Upload Image"}
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={onImageSelected} />
            </label>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || uploading || !form.title.trim()}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-background hover:bg-gold-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="border border-white/15 px-6 py-2.5 text-sm text-muted hover:border-white/30"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ---- Testimonials ----

function emptyTestimonial(): Omit<Testimonial, "id"> {
  return { name: "", location: "", rating: 5, text: "", position: 0, active: true };
}

function TestimonialsTab() {
  const testimonials = useContentStore((s) => s.testimonials);
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      {testimonials
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((t) => (
          <TestimonialCard key={t.id} testimonial={t} />
        ))}
      {adding ? (
        <TestimonialForm initial={emptyTestimonial()} onDone={() => setAdding(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 border border-dashed border-white/20 py-4 text-sm text-muted hover:border-gold/40 hover:text-gold"
        >
          <Plus className="h-4 w-4" />
          Add Testimonial
        </button>
      )}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const removeTestimonial = useContentStore((s) => s.removeTestimonial);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (editing) {
    return (
      <TestimonialForm
        initial={testimonial}
        testimonialId={testimonial.id}
        onDone={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-foreground">
            {testimonial.name} <span className="text-muted">· {testimonial.location}</span>
          </p>
          <p className="mt-1 text-xs text-muted">
            ★ {testimonial.rating} · position {testimonial.position} ·{" "}
            {testimonial.active ? "active" : "hidden"}
          </p>
          <p className="mt-2 text-sm text-muted">{testimonial.text}</p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" onClick={() => setEditing(true)} className="text-muted hover:text-gold" aria-label="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setDeleteOpen(true)} className="text-muted hover:text-red-400" aria-label="Delete">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={deleteOpen}
        title="Delete testimonial"
        description={`Delete the testimonial from "${testimonial.name}"? This can't be undone.`}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          removeTestimonial(testimonial.id);
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}

function TestimonialForm({
  initial,
  testimonialId,
  onDone,
}: {
  initial: Omit<Testimonial, "id">;
  testimonialId?: number;
  onDone: () => void;
}) {
  const addTestimonial = useContentStore((s) => s.addTestimonial);
  const updateTestimonial = useContentStore((s) => s.updateTestimonial);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof Omit<Testimonial, "id">>(key: K, value: Omit<Testimonial, "id">[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    if (!form.name.trim() || !form.text.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (testimonialId) await updateTestimonial(testimonialId, form);
      else await addTestimonial(form);
      onDone();
    } catch {
      setError("Could not save this testimonial.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 border border-gold/30 bg-white/[0.03] p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Name</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Review Text</label>
          <textarea
            value={form.text}
            onChange={(e) => set("text", e.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Rating (1-5)</label>
          <input
            type="number"
            min={1}
            max={5}
            value={form.rating}
            onChange={(e) => set("rating", Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Position</label>
          <input
            type="number"
            value={form.position}
            onChange={(e) => set("position", Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 pb-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 accent-[var(--gold)]"
            />
            Active
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || !form.name.trim() || !form.text.trim()}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-background hover:bg-gold-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="border border-white/15 px-6 py-2.5 text-sm text-muted hover:border-white/30"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ---- Trust strip items ----

function emptyTrustItem(): Omit<TrustItem, "id"> {
  return { icon: "truck", label: "", description: "", position: 0, active: true };
}

function TrustItemsTab() {
  const trustItems = useContentStore((s) => s.trustItems);
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      {trustItems
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((t) => (
          <TrustItemCard key={t.id} item={t} />
        ))}
      {adding ? (
        <TrustItemForm initial={emptyTrustItem()} onDone={() => setAdding(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 border border-dashed border-white/20 py-4 text-sm text-muted hover:border-gold/40 hover:text-gold"
        >
          <Plus className="h-4 w-4" />
          Add Trust Item
        </button>
      )}
    </div>
  );
}

function TrustItemCard({ item }: { item: TrustItem }) {
  const removeTrustItem = useContentStore((s) => s.removeTrustItem);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const Icon = iconFor(item.icon);

  if (editing) {
    return <TrustItemForm initial={item} itemId={item.id} onDone={() => setEditing(false)} />;
  }

  return (
    <div className="flex items-center gap-4 border border-white/10 bg-white/[0.03] p-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">{item.label}</p>
        <p className="mt-1 text-xs text-muted">
          {item.description} · position {item.position} · {item.active ? "active" : "hidden"}
        </p>
      </div>
      <div className="flex shrink-0 gap-3">
        <button type="button" onClick={() => setEditing(true)} className="text-muted hover:text-gold" aria-label="Edit">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setDeleteOpen(true)} className="text-muted hover:text-red-400" aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <ConfirmDialog
        open={deleteOpen}
        title="Delete trust item"
        description={`Delete "${item.label}"? This can't be undone.`}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          removeTrustItem(item.id);
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}

function TrustItemForm({
  initial,
  itemId,
  onDone,
}: {
  initial: Omit<TrustItem, "id">;
  itemId?: number;
  onDone: () => void;
}) {
  const addTrustItem = useContentStore((s) => s.addTrustItem);
  const updateTrustItem = useContentStore((s) => s.updateTrustItem);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof Omit<TrustItem, "id">>(key: K, value: Omit<TrustItem, "id">[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    if (!form.label.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (itemId) await updateTrustItem(itemId, form);
      else await addTrustItem(form);
      onDone();
    } catch {
      setError("Could not save this item.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 border border-gold/30 bg-white/[0.03] p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Label</label>
          <input value={form.label} onChange={(e) => set("label", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <input
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label className={labelClass}>Icon</label>
          <div className="flex flex-wrap gap-2">
            {ICON_OPTIONS.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => set("icon", value)}
                title={label}
                className={cn(
                  "flex h-10 w-10 items-center justify-center border transition-colors",
                  form.icon === value
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-white/15 text-muted hover:border-gold/40",
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Position</label>
          <input
            type="number"
            value={form.position}
            onChange={(e) => set("position", Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-2 pb-2.5 text-sm text-foreground">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 accent-[var(--gold)]"
            />
            Active
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || !form.label.trim()}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-background hover:bg-gold-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="border border-white/15 px-6 py-2.5 text-sm text-muted hover:border-white/30"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ---- Bank offers ----

function emptyBankOffer(): Omit<BankOffer, "id"> {
  return { title: "", detail: "", position: 0, active: true };
}

function BankOffersTab() {
  const bankOffers = useContentStore((s) => s.bankOffers);
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-4">
      {bankOffers
        .slice()
        .sort((a, b) => a.position - b.position)
        .map((o) => (
          <BankOfferCard key={o.id} offer={o} />
        ))}
      {adding ? (
        <BankOfferForm initial={emptyBankOffer()} onDone={() => setAdding(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 border border-dashed border-white/20 py-4 text-sm text-muted hover:border-gold/40 hover:text-gold"
        >
          <Plus className="h-4 w-4" />
          Add Bank Offer
        </button>
      )}
    </div>
  );
}

function BankOfferCard({ offer }: { offer: BankOffer }) {
  const removeBankOffer = useContentStore((s) => s.removeBankOffer);
  const [editing, setEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (editing) {
    return <BankOfferForm initial={offer} offerId={offer.id} onDone={() => setEditing(false)} />;
  }

  return (
    <div className="flex items-start justify-between gap-3 border border-white/10 bg-white/[0.03] p-4">
      <div>
        <p className="text-sm text-foreground">{offer.title}</p>
        <p className="mt-1 text-xs text-muted">{offer.detail}</p>
        <p className="mt-1 text-xs text-muted">
          position {offer.position} · {offer.active ? "active" : "hidden"}
        </p>
      </div>
      <div className="flex shrink-0 gap-3">
        <button type="button" onClick={() => setEditing(true)} className="text-muted hover:text-gold" aria-label="Edit">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={() => setDeleteOpen(true)} className="text-muted hover:text-red-400" aria-label="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
      <ConfirmDialog
        open={deleteOpen}
        title="Delete bank offer"
        description={`Delete "${offer.title}"? This can't be undone.`}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => {
          removeBankOffer(offer.id);
          setDeleteOpen(false);
        }}
      />
    </div>
  );
}

function BankOfferForm({
  initial,
  offerId,
  onDone,
}: {
  initial: Omit<BankOffer, "id">;
  offerId?: number;
  onDone: () => void;
}) {
  const addBankOffer = useContentStore((s) => s.addBankOffer);
  const updateBankOffer = useContentStore((s) => s.updateBankOffer);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof Omit<BankOffer, "id">>(key: K, value: Omit<BankOffer, "id">[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    if (!form.title.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (offerId) await updateBankOffer(offerId, form);
      else await addBankOffer(form);
      onDone();
    } catch {
      setError("Could not save this offer.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 border border-gold/30 bg-white/[0.03] p-5">
      <div className="grid gap-4">
        <div>
          <label className={labelClass}>Title</label>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Detail</label>
          <input value={form.detail} onChange={(e) => set("detail", e.target.value)} className={inputClass} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Position</label>
            <input
              type="number"
              value={form.position}
              onChange={(e) => set("position", Number(e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="flex items-end">
            <label className="flex cursor-pointer items-center gap-2 pb-2.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => set("active", e.target.checked)}
                className="h-4 w-4 accent-[var(--gold)]"
              />
              Active
            </label>
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving || !form.title.trim()}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-background hover:bg-gold-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="border border-white/15 px-6 py-2.5 text-sm text-muted hover:border-white/30"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
