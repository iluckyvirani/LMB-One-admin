import { NavLink } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV } from "@/lib/nav";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-background-secondary/60 lg:flex">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <img src="/logo.jpg" alt="LMB Shoes" className="h-9 w-9 rounded-full" />
        <div>
          <p className="font-heading text-base leading-tight text-foreground">
            LMB Shoes
          </p>
          <p className="text-[11px] tracking-widest text-gold uppercase">Admin</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-6">
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-gold/10 text-gold"
                  : "text-muted hover:bg-white/[0.04] hover:text-foreground",
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <a
          href="http://localhost:3001"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted hover:bg-white/[0.04] hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          View Storefront
        </a>
      </div>
    </aside>
  );
}
