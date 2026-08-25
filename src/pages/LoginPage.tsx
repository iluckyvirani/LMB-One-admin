import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore, DEMO_CREDENTIALS } from "@/store/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [error, setError] = useState("");

  if (isLoggedIn) return <Navigate to="/" replace />;

  function submit(e: FormEvent) {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <img src="/logo.jpg" alt="LMB Shoes" className="mb-4 h-14 w-14 rounded-full" />
          <p className="text-xs uppercase tracking-[0.3em] text-gold">LMB Shoes</p>
          <h1 className="mt-1 font-heading text-2xl text-foreground">Admin Login</h1>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block text-sm text-muted">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full border border-white/15 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
            />
          </label>
          <label className="block text-sm text-muted">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full border border-white/15 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-gold"
            />
          </label>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-full bg-gold px-8 py-3 font-medium text-background transition-colors hover:bg-gold-accent"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          Demo credentials: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
        </p>
      </div>
    </div>
  );
}
