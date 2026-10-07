import { Home, LogIn, LogOut, Menu, ShieldCheck, UserPlus, X, Building2, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { User } from "../types";

interface Props { currentUser: User | null; currentView: string; onNavigate: (view: string) => void; onLogout: () => void; }

export default function Navbar({ currentUser, currentView, onNavigate, onLogout }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const dashboard = currentUser?.type === "admin" ? "admin-dashboard" : currentUser?.type === "owner" ? "owner-dashboard" : "renter-dashboard";
  const go = (view: string) => { onNavigate(view); setMobileOpen(false); };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07111f]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => go("home")} className="flex items-center gap-3 text-left">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-sm font-extrabold text-white shadow-lg shadow-violet-900/30">HC</span>
          <span><span className="block font-display text-lg font-bold tracking-tight text-white">HomeConnect</span><span className="hidden text-[10px] font-semibold uppercase tracking-[.2em] text-slate-500 sm:block">Smart rental marketplace</span></span>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          <button onClick={() => go("home")} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${currentView === "home" ? "bg-white/8 text-white" : "text-slate-400 hover:text-white"}`}><Home className="mr-2 inline h-4 w-4" />Home</button>
          {currentUser ? (
            <button onClick={() => go(dashboard)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${currentView === dashboard ? "bg-violet-500/15 text-violet-300" : "text-slate-400 hover:text-white"}`}><LayoutDashboard className="mr-2 inline h-4 w-4" />Dashboard</button>
          ) : null}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {currentUser ? (
            <>
              <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2 lg:flex"><span className="h-2 w-2 rounded-full bg-emerald-400"/><div><p className="text-xs font-semibold text-white">{currentUser.name}</p><p className="text-[10px] uppercase tracking-wider text-slate-500">{currentUser.type}</p></div></div>
              <button onClick={onLogout} className="rounded-xl p-2.5 text-slate-400 hover:bg-red-500/10 hover:text-red-300" title="Sign out"><LogOut className="h-5 w-5"/></button>
            </>
          ) : (
            <><button onClick={() => go("login")} className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white"><LogIn className="mr-2 inline h-4 w-4"/>Sign in</button><button onClick={() => go("register")} className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-violet-900/25 hover:bg-violet-500"><UserPlus className="mr-2 inline h-4 w-4"/>Get started</button></>
          )}
        </div>

        <button onClick={() => setMobileOpen(v => !v)} className="rounded-xl p-2 text-slate-300 md:hidden">{mobileOpen ? <X/> : <Menu/>}</button>
      </div>
      {mobileOpen && <div className="border-t border-white/10 bg-[#081321] p-4 md:hidden"><div className="space-y-1"><button onClick={() => go("home")} className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-200 hover:bg-white/5"><Home className="mr-3 inline h-4 w-4"/>Home</button>{currentUser ? <button onClick={() => go(dashboard)} className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-200 hover:bg-white/5"><LayoutDashboard className="mr-3 inline h-4 w-4"/>Dashboard</button> : <><button onClick={() => go("login")} className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-slate-200 hover:bg-white/5"><LogIn className="mr-3 inline h-4 w-4"/>Sign in</button><button onClick={() => go("register")} className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-violet-300 hover:bg-violet-500/10"><UserPlus className="mr-3 inline h-4 w-4"/>Create account</button></>}{currentUser && <button onClick={() => { onLogout(); setMobileOpen(false); }} className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-300 hover:bg-red-500/10"><LogOut className="mr-3 inline h-4 w-4"/>Sign out</button>}</div></div>}
    </header>
  );
}
