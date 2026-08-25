import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Menu, User } from "lucide-react";
import { useAuthStore } from "@/store/auth";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const navigate = useNavigate();
  const name = useAuthStore((s) => s.name);
  const logout = useAuthStore((s) => s.logout);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-16 items-center gap-4 border-b border-white/10 px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center text-foreground lg:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1" />

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 text-sm text-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
            <User className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">{name ?? "Admin"}</span>
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full z-20 mt-2 min-w-[160px] border border-white/10 bg-background-secondary py-1 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-muted hover:bg-white/[0.04] hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
