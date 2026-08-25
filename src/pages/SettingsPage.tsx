import { useState, type FormEvent } from "react";
import { Truck, CheckCircle2, XCircle, KeyRound } from "lucide-react";
import { useSettingsStore, type StoreSettings } from "@/store/settings";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full border border-white/15 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold disabled:opacity-50";
const labelClass = "block text-xs uppercase tracking-widest text-muted mb-1.5";

function ChangePasswordCard() {
  const changePassword = useAuthStore((s) => s.changePassword);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    const result = changePassword(currentPassword, newPassword);
    if (!result.ok) {
      setError(result.error);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 2500);
  }

  return (
    <section className="border border-white/10 bg-white/[0.03] p-5">
      <h2 className="mb-4 flex items-center gap-2 font-heading text-lg text-foreground">
        <KeyRound className="h-5 w-5 text-gold" />
        Change Password
      </h2>
      <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        </div>
        <div>
          <label className={labelClass}>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={inputClass}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className={labelClass}>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            autoComplete="new-password"
          />
        </div>

        {error && <p className="sm:col-span-2 text-sm text-red-400">{error}</p>}
        {success && (
          <p className="sm:col-span-2 text-sm text-gold">Password updated successfully.</p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={!currentPassword || !newPassword || !confirmPassword}
            className="border border-gold/50 px-5 py-2.5 text-sm text-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Update Password
          </button>
        </div>
      </form>
    </section>
  );
}

export function SettingsPage() {
  const settings = useSettingsStore((s) => s.settings);
  const updateSettings = useSettingsStore((s) => s.updateSettings);
  const updateShiprocket = useSettingsStore((s) => s.updateShiprocket);

  const [draft, setDraft] = useState<StoreSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [testResult, setTestResult] = useState<"idle" | "success" | "error">("idle");
  const [testing, setTesting] = useState(false);

  function set<K extends keyof StoreSettings>(key: K, value: StoreSettings[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function setShiprocket<K extends keyof StoreSettings["shiprocket"]>(
    key: K,
    value: StoreSettings["shiprocket"][K],
  ) {
    setDraft((d) => ({ ...d, shiprocket: { ...d.shiprocket, [key]: value } }));
  }

  function saveAll(e: FormEvent) {
    e.preventDefault();
    updateSettings(draft);
    updateShiprocket(draft.shiprocket);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function testShiprocketConnection() {
    setTesting(true);
    setTestResult("idle");
    window.setTimeout(() => {
      const ok = draft.shiprocket.email.includes("@") && draft.shiprocket.apiKey.trim().length > 0;
      setTestResult(ok ? "success" : "error");
      setTesting(false);
    }, 900);
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="font-heading text-2xl text-foreground sm:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-muted">
        Manage store details, tax, delivery defaults and shipping integrations.
      </p>

      <form onSubmit={saveAll} className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 font-heading text-lg text-foreground">Brand & Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Store Name</label>
              <input
                value={draft.storeName}
                onChange={(e) => set("storeName", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input
                value={draft.tagline}
                onChange={(e) => set("tagline", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Support Email</label>
              <input
                type="email"
                value={draft.supportEmail}
                onChange={(e) => set("supportEmail", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Support Phone</label>
              <input
                value={draft.supportPhone}
                onChange={(e) => set("supportPhone", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>WhatsApp Number</label>
              <input
                value={draft.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 font-heading text-lg text-foreground">Tax & COD</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>GSTIN</label>
              <input
                value={draft.gstin}
                onChange={(e) => set("gstin", e.target.value)}
                placeholder="22AAAAA0000A1Z5"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Tax (%)</label>
              <input
                type="number"
                min={0}
                max={100}
                value={draft.taxPercent}
                onChange={(e) => set("taxPercent", Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={draft.codEnabled}
                  onChange={(e) => set("codEnabled", e.target.checked)}
                  className="h-4 w-4 accent-[var(--gold)]"
                />
                Cash on Delivery enabled
              </label>
            </div>
            <div>
              <label className={labelClass}>Max COD Amount (₹)</label>
              <input
                type="number"
                min={0}
                disabled={!draft.codEnabled}
                value={draft.codMaxAmount}
                onChange={(e) => set("codMaxAmount", Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Free Shipping Above (₹)</label>
              <input
                type="number"
                min={0}
                value={draft.freeShippingThreshold}
                onChange={(e) => set("freeShippingThreshold", Number(e.target.value))}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-muted">0 = always free</p>
            </div>
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 font-heading text-lg text-foreground">Delivery Defaults</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Min ETA (days)</label>
              <input
                type="number"
                min={1}
                value={draft.deliveryEtaMinDays}
                onChange={(e) => set("deliveryEtaMinDays", Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Max ETA (days)</label>
              <input
                type="number"
                min={1}
                value={draft.deliveryEtaMaxDays}
                onChange={(e) => set("deliveryEtaMaxDays", Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <section className="border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-heading text-lg text-foreground">
              <Truck className="h-5 w-5 text-gold" />
              Shiprocket Integration
            </h2>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
              <input
                type="checkbox"
                checked={draft.shiprocket.enabled}
                onChange={(e) => setShiprocket("enabled", e.target.checked)}
                className="h-4 w-4 accent-[var(--gold)]"
              />
              Enabled
            </label>
          </div>

          <div className={cn("grid gap-4 sm:grid-cols-2", !draft.shiprocket.enabled && "opacity-50")}>
            <div>
              <label className={labelClass}>Shiprocket Email</label>
              <input
                type="email"
                disabled={!draft.shiprocket.enabled}
                value={draft.shiprocket.email}
                onChange={(e) => setShiprocket("email", e.target.value)}
                placeholder="you@business.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>API Key</label>
              <input
                type="password"
                disabled={!draft.shiprocket.enabled}
                value={draft.shiprocket.apiKey}
                onChange={(e) => setShiprocket("apiKey", e.target.value)}
                placeholder="••••••••••"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Channel ID</label>
              <input
                disabled={!draft.shiprocket.enabled}
                value={draft.shiprocket.channelId}
                onChange={(e) => setShiprocket("channelId", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Pickup Pincode</label>
              <input
                disabled={!draft.shiprocket.enabled}
                inputMode="numeric"
                value={draft.shiprocket.pickupPincode}
                onChange={(e) =>
                  setShiprocket("pickupPincode", e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              disabled={!draft.shiprocket.enabled || testing}
              onClick={testShiprocketConnection}
              className="border border-gold/50 px-4 py-2 text-sm text-gold hover:bg-gold/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {testing ? "Testing…" : "Test Connection"}
            </button>
            {testResult === "success" && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Connected successfully
              </span>
            )}
            {testResult === "error" && (
              <span className="flex items-center gap-1.5 text-sm text-red-400">
                <XCircle className="h-4 w-4" />
                Invalid credentials
              </span>
            )}
          </div>
          <p className="mt-3 text-xs text-muted">
            This is a demo integration — no real Shiprocket API calls are made.
          </p>
        </section>

        <div className="lg:col-span-2">
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="rounded-full bg-gold px-8 py-3 font-medium text-background transition-colors hover:bg-gold-accent"
            >
              Save Settings
            </button>
            {saved && <span className="text-sm text-gold">Settings saved successfully.</span>}
          </div>
        </div>
      </form>

      <div className="mt-6 max-w-xl">
        <ChangePasswordCard />
      </div>
    </div>
  );
}
