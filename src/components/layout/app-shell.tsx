"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  CheckSquare,
  ShoppingCart,
  ShieldCheck,
  Building2,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { Language, t } from "@/lib/translations";
import { Button } from "@/components/ui/button";

const farmerLinks = [
  { href: "/farmer", labelKey: "dashboard", defaultLabel: "Dashboard", icon: LayoutDashboard },
  { href: "/farmer/create-lot", labelKey: "sellCrop", defaultLabel: "Sell My Crop", icon: Package },
  { href: "/farmer/market", labelKey: "checkPrices", defaultLabel: "Check Market Prices", icon: TrendingUp },
  { href: "/farmer/recommendations", labelKey: "findBuyers", defaultLabel: "Find Buyers", icon: Users },
  { href: "/farmer/offers", labelKey: "myOffers", defaultLabel: "My Offers", icon: ShoppingCart },
  { href: "/farmer/track", labelKey: "trackSale", defaultLabel: "Track My Sale", icon: Truck },
  { href: "/farmer/fpo", labelKey: "fpoAggregation", defaultLabel: "FPO Aggregation", icon: Scale },
  { href: "/farmer/coverage", labelKey: "sihCoverage", defaultLabel: "SIH Coverage", icon: CheckSquare },
];

const buyerLinks = [
  { href: "/buyer", labelKey: "dashboard", defaultLabel: "Dashboard", icon: LayoutDashboard },
  { href: "/buyer/lots", labelKey: "availableLots", defaultLabel: "Available Lots", icon: Package },
  { href: "/buyer/aggregate", labelKey: "aiLotAggregation", defaultLabel: "AI Lot Aggregation", icon: Scale },
  { href: "/buyer/procurement", labelKey: "myProcurement", defaultLabel: "My Procurement", icon: ShoppingCart },
  { href: "/buyer/transactions", labelKey: "transactions", defaultLabel: "Transactions", icon: Truck },
  { href: "/buyer/coverage", labelKey: "sihCoverage", defaultLabel: "SIH Coverage", icon: CheckSquare },
];

const adminLinks = [
  { href: "/admin", labelKey: "commandCenter", defaultLabel: "Command Center", icon: LayoutDashboard },
  { href: "/admin/markets", labelKey: "marketIntelligence", defaultLabel: "Market Intelligence", icon: TrendingUp },
  { href: "/admin/buyers", labelKey: "buyerRegistry", defaultLabel: "Buyer Registry", icon: Building2 },
  { href: "/admin/fpo", labelKey: "fpoInsights", defaultLabel: "FPO Insights", icon: Scale },
  { href: "/admin/transactions", labelKey: "transactions", defaultLabel: "Transactions", icon: Truck },
  { href: "/admin/grievances", labelKey: "grievances", defaultLabel: "Grievance Center", icon: AlertTriangle },
  { href: "/admin/impact", labelKey: "impactDashboard", defaultLabel: "Impact Dashboard", icon: BarChart3 },
  { href: "/admin/coverage", labelKey: "sihCoverage", defaultLabel: "SIH Coverage", icon: CheckSquare },
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
  const router = useRouter();
  const links = role === "farmer" ? farmerLinks : role === "buyer" ? buyerLinks : adminLinks;
  const [lang, setLang] = useState<Language>("en");
  const [langOpen, setLangOpen] = useState(false);

  // Role Guarding (PART 21)
  const isFarmerRoute = pathname.startsWith("/farmer");
  const isBuyerRoute = pathname.startsWith("/buyer");
  const isAdminRoute = pathname.startsWith("/admin");

  const accessDenied =
    (role === "farmer" && (isBuyerRoute || isAdminRoute)) ||
    (role === "buyer" && (isFarmerRoute || isAdminRoute)) ||
    (role === "admin" && (isFarmerRoute || isBuyerRoute));

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-[#f4f7f4] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-red-200 text-center shadow-lg space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
          <p className="text-xs text-gray-600">
            Your current portal role (<strong>{role.toUpperCase()}</strong>) is restricted from accessing <code>{pathname}</code>.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Button onClick={() => router.push(`/${role}`)} variant="outline" size="sm" className="font-bold">
              Return to Dashboard
            </Button>
            <Button onClick={() => router.push("/")} className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold" size="sm">
              Switch Role
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const roleCoverageLink =
    role === "farmer" ? "/farmer/coverage" : role === "buyer" ? "/buyer/coverage" : "/admin/coverage";

  return (
    <div className="min-h-screen bg-[#f4f7f4]">
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5">
          <Link href={`/${role}`} className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white font-bold shadow-sm">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-emerald-950">AgriLink Maharashtra</p>
                <span className="hidden sm:inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  SIH 2026 Prototype
                </span>
              </div>
              <p className="text-[11px] text-gray-500 hidden md:block">
                State Agricultural Market Intelligence &amp; Transaction Enablement Platform
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href={roleCoverageLink}
              className="hidden sm:flex items-center gap-1 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 hover:bg-emerald-100"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              SIH Coverage
            </Link>

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
            <span className="hidden text-xs text-gray-700 sm:block font-bold">{userName}</span>
            <RoleBadge role={role} />
            <Link href="/" className="text-xs font-semibold text-emerald-700 hover:underline">
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
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-bold transition-colors",
                  pathname === href || (href !== "/farmer" && href !== "/buyer" && href !== "/admin" && pathname.startsWith(href))
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-800"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
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
                pathname === href || (href !== "/farmer" && href !== "/buyer" && href !== "/admin" && pathname.startsWith(href))
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
  const badgeConfig = {
    farmer: { label: "FARMER", style: "bg-emerald-100 text-emerald-900 border-emerald-300 font-bold" },
    buyer: { label: "BUYER", style: "bg-blue-100 text-blue-900 border-blue-300 font-bold" },
    admin: { label: "GOVERNMENT", style: "bg-purple-100 text-purple-900 border-purple-300 font-bold" },
  };
  const config = badgeConfig[role as keyof typeof badgeConfig] ?? { label: role.toUpperCase(), style: "bg-gray-100 text-gray-800" };
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-[10px] uppercase border tracking-wide",
        config.style
      )}
    >
      {config.label}
    </span>
  );
}

export function DemoBanner() {
  return (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2 text-xs text-amber-900 flex items-center justify-between gap-2 shadow-xs">
      <div>
        <strong>Demonstration Dataset</strong> — Region: Maharashtra (Nashik, Pune, Nagpur, Solapur, Sangli, Kolhapur) · Status: Prototype Data.
      </div>
      <span className="hidden sm:inline-block font-semibold bg-amber-100 px-2 py-0.5 rounded text-[10px]">
        SIH 2026 Prototype
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
