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
import { Language, t } from "@/lib/translations";

const farmerLinks = [
  { href: "/farmer", labelKey: "sellCrop", defaultLabel: "Dashboard", icon: LayoutDashboard },
  { href: "/farmer/create-lot", labelKey: "sellCrop", defaultLabel: "Sell My Crop", icon: Package },
  { href: "/farmer/market", labelKey: "checkPrices", defaultLabel: "Market Prices", icon: TrendingUp },
  { href: "/farmer/offers", labelKey: "findBuyers", defaultLabel: "My Offers", icon: Users },
  { href: "/farmer/fpo", labelKey: "fpoAggregation", defaultLabel: "FPO Aggregation", icon: Scale },
];

const buyerLinks = [
  { href: "/buyer", labelKey: "findBuyers", defaultLabel: "Dashboard", icon: LayoutDashboard },
  { href: "/buyer/lots", labelKey: "sellCrop", defaultLabel: "Available Lots", icon: Package },
  { href: "/buyer/aggregate", labelKey: "fpoAggregation", defaultLabel: "Lot Aggregation", icon: Scale },
];

const adminLinks = [
  { href: "/admin", labelKey: "commandCenter", defaultLabel: "Command Center", icon: LayoutDashboard },
  { href: "/admin/markets", labelKey: "checkPrices", defaultLabel: "Markets", icon: TrendingUp },
  { href: "/admin/buyers", labelKey: "findBuyers", defaultLabel: "Buyers", icon: Users },
  { href: "/admin/transactions", labelKey: "trackSale", defaultLabel: "Transactions", icon: Truck },
  { href: "/admin/grievances", labelKey: "fpoAggregation", defaultLabel: "Grievances", icon: AlertTriangle },
  { href: "/admin/impact", labelKey: "fpoAggregation", defaultLabel: "Impact", icon: BarChart3 },
];

const LANG_LABELS: Record<Language, string> = { en: "EN", mr: "मराठी", hi: "हिंदी" };

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
  const [lang, setLang] = useState<Language>("en");
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f7f4]">
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white font-bold shadow-sm">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-emerald-950">AgriLink Maharashtra</p>
                <span className="hidden sm:inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  MSINS Pilot
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden md:block">
                State Agricultural Market Intelligence &amp; Transaction Enablement Platform
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
              >
                <Globe className="h-3.5 w-3.5" />
                {LANG_LABELS[lang]}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 rounded-xl border border-emerald-100 bg-white py-1 shadow-xl z-50">
                  {(Object.keys(LANG_LABELS) as Language[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setLang(key);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-emerald-50",
                        lang === key ? "font-bold text-emerald-700 bg-emerald-50/50" : "text-gray-700"
                      )}
                    >
                      {key === "mr" ? "मराठी (Marathi)" : key === "hi" ? "हिंदी (Hindi)" : "English"}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="hidden text-xs text-gray-600 sm:block font-medium">{userName}</span>
            <RoleBadge role={role} />
            <Link href="/" className="text-xs font-medium text-emerald-700 hover:underline">
              {t("switchRole", lang)}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        <nav className="hidden w-56 shrink-0 md:block">
          <div className="sticky top-20 space-y-1 rounded-2xl border border-emerald-100 bg-white p-3 shadow-xs">
            {links.map(({ href, labelKey, defaultLabel, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-800"
                )}
              >
                <Icon className="h-4 w-4" />
                {t(labelKey, lang) || defaultLabel}
              </Link>
            ))}
          </div>
        </nav>

        <main className="min-w-0 flex-1 pb-24 md:pb-6">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-emerald-100 bg-white md:hidden shadow-lg">
        <div className="flex justify-around py-2">
          {links.slice(0, 5).map(({ href, labelKey, defaultLabel, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1 text-[11px] font-medium",
                pathname === href || pathname.startsWith(href + "/")
                  ? "text-emerald-700 font-bold"
                  : "text-gray-500"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="truncate max-w-[64px]">{t(labelKey, lang) || defaultLabel}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors = {
    farmer: "bg-emerald-100 text-emerald-800 border-emerald-200",
    buyer: "bg-blue-100 text-blue-800 border-blue-200",
    admin: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize border",
        colors[role as keyof typeof colors]
      )}
    >
      {role}
    </span>
  );
}

export function DemoBanner() {
  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-2 shadow-xs">
      <div>
        <strong>Demonstration Dataset</strong> — Maharashtra Region Pilot (Nashik, Pune, Nagpur, Solapur, Sangli, Kolhapur).
      </div>
      <span className="hidden sm:inline-block font-semibold bg-amber-100 px-2 py-0.5 rounded text-[10px]">
        MSINS Govt Pilot
      </span>
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
