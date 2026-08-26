"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  TrendingUp,
  Users,
  Truck,
  Settings,
  Leaf,
  AlertTriangle,
  BarChart3,
  Scale,
  Globe,
} from "lucide-react";
import { useState } from "react";

const farmerLinks = [
  { href: "/farmer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/farmer/create-lot", label: "Sell My Crop", icon: Package },
  { href: "/farmer/market", label: "Market Prices", icon: TrendingUp },
  { href: "/farmer/offers", label: "My Offers", icon: Users },
  { href: "/farmer/fpo", label: "FPO", icon: Scale },
];

const buyerLinks = [
  { href: "/buyer", label: "Dashboard", icon: LayoutDashboard },
  { href: "/buyer/lots", label: "Available Lots", icon: Package },
  { href: "/buyer/aggregate", label: "Lot Aggregation", icon: Scale },
];

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/markets", label: "Markets", icon: TrendingUp },
  { href: "/admin/buyers", label: "Buyers", icon: Users },
  { href: "/admin/transactions", label: "Transactions", icon: Truck },
  { href: "/admin/grievances", label: "Grievances", icon: AlertTriangle },
  { href: "/admin/impact", label: "Impact", icon: BarChart3 },
];

type LangKey = "en" | "hi" | "kn";
const LANG_LABELS: Record<LangKey, string> = { en: "EN", hi: "हिं", kn: "ಕ" };
const LANG_NAMES: Record<LangKey, string> = { en: "English", hi: "हिन्दी", kn: "ಕನ್ನಡ" };

export function AppShell({
  children,
  role,
  userName,
}: {
  children: React.ReactNode;
  role: "farmer" | "buyer" | "admin";
  userName: string;
}) {
  const pathname = usePathname();
  const links = role === "farmer" ? farmerLinks : role === "buyer" ? buyerLinks : adminLinks;
  const [lang, setLang] = useState<LangKey>("en");
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7f4]">
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-900">AgriLink</p>
              <p className="text-xs text-gray-500 hidden sm:block">From farm-gate to the best buyer</p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-2 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
              >
                <Globe className="h-3.5 w-3.5" />
                {LANG_LABELS[lang]}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-28 rounded-xl border border-gray-200 bg-white py-1 shadow-lg z-50">
                  {(Object.keys(LANG_NAMES) as LangKey[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setLang(key);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-1.5 text-left text-xs hover:bg-emerald-50",
                        lang === key ? "font-bold text-emerald-700" : "text-gray-600"
                      )}
                    >
                      {LANG_NAMES[key]}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="hidden text-sm text-gray-600 sm:block">{userName}</span>
            <RoleBadge role={role} />
            <Link href="/" className="text-sm text-emerald-700 hover:underline">
              Switch
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <nav className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-20 space-y-1 rounded-2xl border border-emerald-100 bg-white p-3">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-emerald-700 text-white"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-800"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>
        </nav>

        <main className="min-w-0 flex-1 pb-24 md:pb-6">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-100 bg-white md:hidden">
        <div className="flex justify-around py-2">
          {links.slice(0, 5).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 text-xs",
                pathname === href || pathname.startsWith(href + "/")
                  ? "text-emerald-700"
                  : "text-gray-500"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate max-w-[60px]">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors = {
    farmer: "bg-emerald-100 text-emerald-800",
    buyer: "bg-blue-100 text-blue-800",
    admin: "bg-purple-100 text-purple-800",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        colors[role as keyof typeof colors]
      )}
    >
      {role}
    </span>
  );
}

export function DemoBanner() {
  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-900">
      <strong>Demo Dataset</strong> — Karnataka region. Prices and buyers are seeded for demonstration.
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
      <Settings className="mx-auto mb-3 h-10 w-10 text-gray-300" />
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </div>
  );
}
