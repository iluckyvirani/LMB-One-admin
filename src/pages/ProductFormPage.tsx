import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProductStore } from "@/store/products";
import { CATEGORIES, STYLES, COLLECTIONS, TAGS } from "@/lib/mockData";
import { slugify } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Category, Collection, Product, Style, Tag } from "@/lib/types";

const ALL_SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

type FormState = {
  title: string;
  slug: string;
  category: Category;
  style: Style;
  collection: Collection;
  tags: Tag[];
  price: string;
  mrp: string;
  stock: string;
  rating: string;
  reviewsCount: string;
  sizes: number[];
  colorway: string;
  color: string;
  colorHex: string;
  swatchFrom: string;
  swatchTo: string;
  description: string;
  image: string;
};

function emptyForm(): FormState {
  return {
    title: "",
    slug: "",
    category: "men",
    style: "formal",
    collection: "LMB Heritage",
    tags: [],
    price: "",
    mrp: "",
    stock: "0",
    rating: "4.5",
    reviewsCount: "0",
    sizes: [],
    colorway: "",
    color: "",
    colorHex: "#1a1a1a",
    swatchFrom: "#1a1a1a",
    swatchTo: "#3a3a3a",
    description: "",
    image: "",
  };
}

function productToForm(p: Product): FormState {
  return {
    title: p.title,
    slug: p.slug,
    category: p.category,
    style: p.style,
    collection: p.collection,
    tags: p.tags,
    price: String(p.price),
    mrp: String(p.mrp),
    stock: String(p.stock),
    rating: String(p.rating),
    reviewsCount: String(p.reviewsCount),
    sizes: p.sizes,
    colorway: p.colorway,
    color: p.color,
    colorHex: p.colorHex,
    swatchFrom: p.swatch[0],
    swatchTo: p.swatch[1],
    description: p.description,
    image: p.image ?? "",
  };
}

const inputClass =
  "w-full border border-white/15 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold";
const labelClass = "block text-xs uppercase tracking-widest text-muted mb-1.5";

export function ProductFormPage() {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const getProduct = useProductStore((s) => s.getProduct);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const uploadImage = useProductStore((s) => s.uploadImage);

  const existing = !isNew && id ? getProduct(id) : undefined;
  const [form, setForm] = useState<FormState>(existing ? productToForm(existing) : emptyForm());
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (existing) setForm(productToForm(existing));
  }, [existing]);

  if (!isNew && !existing) {
    return (
      <div className="p-8 text-center text-muted">
        Product not found. <Link to="/products" className="text-gold hover:underline">Back to products</Link>
      </div>
    );
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleSize(size: number) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(size)
        ? f.sizes.filter((s) => s !== size)
        : [...f.sizes, size].sort((a, b) => a - b),
    }));
  }

  function toggleTag(tag: Tag) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }));
  }

  async function onImageSelected(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setSubmitError("");
    try {
      const url = await uploadImage(file);
      set("image", url);
    } catch {
      setSubmitError("Image upload failed. Check Cloudinary credentials on the server.");
    } finally {
      setUploading(false);
    }
  }

  const canSubmit =
    form.title.trim() &&
    form.slug.trim() &&
    Number(form.price) > 0 &&
    Number(form.mrp) > 0 &&
    form.sizes.length > 0 &&
    form.colorway.trim() &&
    form.color.trim() &&
    form.description.trim();

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim(),
      category: form.category,
      style: form.style,
      collection: form.collection,
      tags: form.tags,
      price: Number(form.price),
      mrp: Number(form.mrp),
      rating: Number(form.rating) || 0,
      reviewsCount: Number(form.reviewsCount) || 0,
      stock: Number(form.stock) || 0,
      sizes: form.sizes,
      colorway: form.colorway.trim(),
      color: form.color.trim(),
      colorHex: form.colorHex,
      swatch: [form.swatchFrom, form.swatchTo] as [string, string],
      description: form.description.trim(),
      image: form.image || undefined,
      images: form.image ? [form.image] : [],
    };

    setSubmitting(true);
    setSubmitError("");
    try {
      if (isNew) {
        await addProduct(payload);
      } else if (id) {
        await updateProduct(id, payload);
      }
      navigate("/products");
    } catch {
      setSubmitError("Could not save this product. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Link to="/products" className="mb-4 flex items-center gap-2 text-sm text-gold hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </Link>
      <h1 className="font-heading text-2xl text-foreground sm:text-3xl">
        {isNew ? "Add Product" : `Edit ${existing?.title}`}
      </h1>

      <form onSubmit={submit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 font-heading text-lg text-foreground">Basic Information</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Title</label>
                <input
                  value={form.title}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (!slugTouched) set("slug", slugify(e.target.value));
                  }}
                  className={inputClass}
                  placeholder="e.g. Regal Oxford"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                  className={inputClass}
                  placeholder="regal-oxford"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  rows={3}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 font-heading text-lg text-foreground">Classification</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value as Category)}
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Style</label>
                <select
                  value={form.style}
                  onChange={(e) => set("style", e.target.value as Style)}
                  className={inputClass}
                >
                  {STYLES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Collection</label>
                <select
                  value={form.collection}
                  onChange={(e) => set("collection", e.target.value as Collection)}
                  className={inputClass}
                >
                  {COLLECTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>Tags</label>
              <div className="flex flex-wrap gap-2">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      "border px-3 py-1.5 text-xs capitalize transition-colors",
                      form.tags.includes(tag)
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-white/15 text-muted hover:border-gold/40",
                    )}
                  >
                    {tag.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 font-heading text-lg text-foreground">Pricing & Inventory</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Price (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>MRP (₹)</label>
                <input
                  type="number"
                  min={0}
                  value={form.mrp}
                  onChange={(e) => set("mrp", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Stock</label>
                <input
                  type="number"
                  min={0}
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Rating</label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  value={form.rating}
                  onChange={(e) => set("rating", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Reviews Count</label>
                <input
                  type="number"
                  min={0}
                  value={form.reviewsCount}
                  onChange={(e) => set("reviewsCount", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClass}>Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {ALL_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={cn(
                      "flex h-9 w-9 items-center justify-center border text-sm transition-colors",
                      form.sizes.includes(size)
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-white/15 text-muted hover:border-gold/40",
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-4 font-heading text-lg text-foreground">Color & Appearance</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Colorway (display name)</label>
                <input
                  value={form.colorway}
                  onChange={(e) => set("colorway", e.target.value)}
                  placeholder="e.g. Midnight Black"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Color (filter name)</label>
                <input
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  placeholder="e.g. Black"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Swatch Color 1</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.swatchFrom}
                    onChange={(e) => set("swatchFrom", e.target.value)}
                    className="h-10 w-12 shrink-0 border border-white/15 bg-background"
                  />
                  <input
                    value={form.swatchFrom}
                    onChange={(e) => set("swatchFrom", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Swatch Color 2</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.swatchTo}
                    onChange={(e) => set("swatchTo", e.target.value)}
                    className="h-10 w-12 shrink-0 border border-white/15 bg-background"
                  />
                  <input
                    value={form.swatchTo}
                    onChange={(e) => set("swatchTo", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Color Filter Swatch</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.colorHex}
                    onChange={(e) => set("colorHex", e.target.value)}
                    className="h-10 w-12 shrink-0 border border-white/15 bg-background"
                  />
                  <input
                    value={form.colorHex}
                    onChange={(e) => set("colorHex", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="h-fit space-y-4">
          <div className="border border-white/10 bg-white/[0.03] p-5">
            <h2 className="mb-3 font-heading text-lg text-foreground">Preview</h2>
            <div
              className="aspect-[4/5] w-full overflow-hidden bg-background-secondary"
              style={
                form.image
                  ? undefined
                  : { background: `linear-gradient(135deg, ${form.swatchFrom}, ${form.swatchTo})` }
              }
            >
              {form.image && (
                <img
                  src={form.image}
                  alt={form.title || "Product"}
                  className="h-full w-full object-cover object-center"
                />
              )}
            </div>
            <label className="mt-3 block cursor-pointer border border-white/15 px-3 py-2 text-center text-xs text-muted hover:border-gold/40 hover:text-gold">
              {uploading ? "Uploading…" : form.image ? "Replace Image" : "Upload Image"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={onImageSelected}
              />
            </label>
            <p className="mt-3 text-xs uppercase tracking-widest text-gold/80">
              {form.colorway || "Colorway"}
            </p>
            <p className="font-heading text-lg text-foreground">
              {form.title || "Product title"}
            </p>
            <p className="text-gold">{form.price ? `₹${form.price}` : "₹0"}</p>
          </div>

          {submitError && <p className="text-sm text-red-400">{submitError}</p>}

          <button
            type="submit"
            disabled={!canSubmit || submitting || uploading}
            className="w-full rounded-full bg-gold px-8 py-3 font-medium text-background transition-colors hover:bg-gold-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? "Saving…" : isNew ? "Add Product" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
