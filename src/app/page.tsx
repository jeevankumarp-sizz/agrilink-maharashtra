"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { actionLogin } from "@/actions/agri-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/lib/language-context";
import { Language } from "@/lib/translations";
import {
  ArrowRight,
  Database,
  Globe,
  Leaf,
  MapPin,
  Package,
  Scale,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  Zap,
  Building2,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import type { NormalizedMarketPrice, DataStatus } from "@/lib/agmarknet";
import { formatCurrencyPerKg, formatNumber } from "@/lib/utils";

const LANG_LABELS: Record<Language, string> = { en: "English", mr: "मराठी", hi: "हिंदी" };

export default function HomePage() {
  const router = useRouter();
  const { language, setLanguage, t: translate } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  // Live AGMARKNET market preview
  const [marketPrices, setMarketPrices] = useState<NormalizedMarketPrice[]>([]);
  const [dataStatus, setDataStatus] = useState<DataStatus>("live");
  const [dataSource, setDataSource] = useState<string>("AGMARKNET");
  const [loadingMarkets, setLoadingMarkets] = useState(true);

  useEffect(() => {
    async function fetchMarketData() {
      try {
        const res = await fetch("/api/market/prices?state=Maharashtra");
        const json = await res.json();
        if (json && json.data && json.data.length > 0) {
          setMarketPrices(json.data.slice(0, 6));
          setDataStatus(json.dataStatus || "live");
          setDataSource(json.source || "AGMARKNET");
        }
      } catch (err) {
        console.error("Error fetching homepage markets:", err);
      } finally {
        setLoadingMarkets(false);
      }
    }
    fetchMarketData();
  }, []);

  async function handleRoleNavigate(role: "farmer" | "buyer" | "admin") {
    setLoadingRole(role);
    await actionLogin(role);
    router.push(`/${role}`);
  }

  return (
    <div className="min-h-screen bg-[#f4f7f4]">
      {/* State Public Service Top Banner */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-2 border-b border-emerald-800">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
              AGRICULTURAL MARKET SERVICES
            </span>
            <span className="font-semibold">
              {translate("subtitle") || "State Agricultural Market Intelligence & Transaction Services"}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 bg-emerald-900 hover:bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded text-xs font-bold border border-emerald-700"
              >
                <Globe className="h-3.5 w-3.5" />
                {LANG_LABELS[language]} ▼
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 rounded-lg border border-emerald-800 bg-emerald-950 py-1 shadow-xl z-50 text-white">
                  {(Object.keys(LANG_LABELS) as Language[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        setLanguage(key);
                        setLangOpen(false);
                      }}
                      className="w-full px-3 py-1.5 text-left text-xs hover:bg-emerald-800 transition-colors"
                    >
                      {key === "mr" ? "मराठी (Marathi)" : key === "hi" ? "हिंदी (Hindi)" : "English"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Portal Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-emerald-100 bg-white/95 backdrop-blur shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-700 text-white font-bold shadow-sm">
              <Leaf className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-emerald-950">
                {translate("title") || "AgriLink Maharashtra"}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                {translate("tagline") || "Transparent Price Discovery, Direct Farm-to-Buyer Trade & Market Advisory"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRoleNavigate("farmer")}
              className="hidden md:flex font-bold text-xs"
            >
              🌾 {translate("farmerPortal") || "Farmer Portal"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRoleNavigate("buyer")}
              className="hidden md:flex font-bold text-xs"
            >
              🏢 {translate("buyerPortal") || "Buyer Portal"}
            </Button>
            <Button
              size="sm"
              onClick={() => handleRoleNavigate("admin")}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
            >
              🏛️ {translate("adminPortal") || "Command Center"}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Service Section */}
      <section className="bg-gradient-to-b from-emerald-900 via-emerald-850 to-emerald-950 text-white py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 space-y-6">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <Badge variant="verified" className="bg-emerald-800 text-emerald-100 border-emerald-700 font-bold px-3 py-1 text-xs">
                State Market Data Feed
              </Badge>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                Find the right market. Find the right buyer. Sell with confidence.
              </h2>
              <p className="text-sm md:text-base text-emerald-100 leading-relaxed">
                Check market prices, compare buyer offers, assess your crop quality and track your sale from pickup to payment.
              </p>
            </div>
            <div className="hidden md:block bg-emerald-900/60 p-3 rounded-2xl border border-emerald-700 shadow-lg">
              <div className="grid grid-cols-2 gap-2 text-xs font-bold text-emerald-100">
                <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800 flex items-center gap-2">
                  <span className="text-base">🧅</span>
                  <div>
                    <span className="block text-white">Onion (कांदा)</span>
                    <span className="text-[10px] text-emerald-300">Nashik &amp; Lasalgaon APMC</span>
                  </div>
                </div>
                <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800 flex items-center gap-2">
                  <span className="text-base">🌱</span>
                  <div>
                    <span className="block text-white">Soybean (सोयाबीन)</span>
                    <span className="text-[10px] text-emerald-300">Latur &amp; Akola APMC</span>
                  </div>
                </div>
                <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800 flex items-center gap-2">
                  <span className="text-base">☁️</span>
                  <div>
                    <span className="block text-white">Cotton (कापूस)</span>
                    <span className="text-[10px] text-emerald-300">Akola &amp; Yavatmal APMC</span>
                  </div>
                </div>
                <div className="bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-800 flex items-center gap-2">
                  <span className="text-base">🥔</span>
                  <div>
                    <span className="block text-white">Potato (बटाटा)</span>
                    <span className="text-[10px] text-emerald-300">Pune &amp; Manchar APMC</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-emerald-300 text-center mt-2 font-medium">
                Maharashtra Agricultural Produce Coverage
              </p>
            </div>
          </div>

          {/* Quick Access Service Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            <button
              type="button"
              onClick={() => handleRoleNavigate("farmer")}
              className="bg-white/10 hover:bg-white/15 backdrop-blur p-4 rounded-xl border border-white/20 text-left transition-all space-y-2 group"
            >
              <div className="flex justify-between items-center">
                <div className="p-2 bg-emerald-700 text-white rounded-lg group-hover:scale-105 transition-transform">
                  <Package className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">{translate("sellCrop") || "Sell My Crop"}</p>
                <p className="text-xs text-emerald-200 mt-0.5">Calculate net realization &amp; create digital lot</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleNavigate("farmer")}
              className="bg-white/10 hover:bg-white/15 backdrop-blur p-4 rounded-xl border border-white/20 text-left transition-all space-y-2 group"
            >
              <div className="flex justify-between items-center">
                <div className="p-2 bg-blue-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">{translate("checkPrices") || "Market Prices"}</p>
                <p className="text-xs text-emerald-200 mt-0.5">Live APMC modal rates across Maharashtra</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleNavigate("buyer")}
              className="bg-white/10 hover:bg-white/15 backdrop-blur p-4 rounded-xl border border-white/20 text-left transition-all space-y-2 group"
            >
              <div className="flex justify-between items-center">
                <div className="p-2 bg-purple-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                  <Building2 className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">{translate("buyerPortal") || "Buyer Procurement"}</p>
                <p className="text-xs text-emerald-200 mt-0.5">Browse crop lots &amp; submit commercial offers</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleNavigate("admin")}
              className="bg-white/10 hover:bg-white/15 backdrop-blur p-4 rounded-xl border border-white/20 text-left transition-all space-y-2 group"
            >
              <div className="flex justify-between items-center">
                <div className="p-2 bg-amber-600 text-white rounded-lg group-hover:scale-105 transition-transform">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-emerald-300" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">{translate("commandCenter") || "State Command Center"}</p>
                <p className="text-xs text-emerald-200 mt-0.5">Market anomaly alerts &amp; analytics</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Today's Market Data Snapshot */}
        <Card className="border border-emerald-100 shadow-sm">
          <CardHeader className="bg-emerald-50/50 pb-3 border-b border-emerald-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-700" />
                  Maharashtra APMC Daily Market Rates (AGMARKNET Direct Feed)
                </CardTitle>
                <CardDescription className="text-xs text-gray-600">
                  Daily APMC mandi modal prices, arrival volumes, and min/max range across Maharashtra
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={dataStatus === "live" ? "verified" : "info"} className="text-xs font-bold">
                  <Database className="h-3 w-3 mr-1" />
                  Source: {dataSource} ({dataStatus.toUpperCase()})
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loadingMarkets ? (
              <div className="p-8 text-center text-xs text-gray-500">Loading daily APMC market prices...</div>
            ) : marketPrices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-600 uppercase font-bold border-b">
                    <tr>
                      <th className="px-4 py-3">Market APMC</th>
                      <th className="px-4 py-3">District</th>
                      <th className="px-4 py-3">Commodity</th>
                      <th className="px-4 py-3">Variety / Grade</th>
                      <th className="px-4 py-3 text-right">Min - Max Rate</th>
                      <th className="px-4 py-3 text-right">Modal Price</th>
                      <th className="px-4 py-3 text-right">Arrival Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {marketPrices.map((item) => (
                      <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                        <td className="px-4 py-3 font-bold text-gray-900">{item.market}</td>
                        <td className="px-4 py-3 text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-emerald-600" />
                            {item.district}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-900">{item.commodity}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {item.variety} ({item.grade})
                        </td>
                        <td className="px-4 py-3 text-right text-gray-600">
                          ₹{item.minPrice} - ₹{item.maxPrice}/kg
                        </td>
                        <td className="px-4 py-3 text-right font-extrabold text-emerald-800 text-sm">
                          {formatCurrencyPerKg(item.modalPrice)}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-700">
                          {formatNumber(item.arrivals)} {item.unit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-gray-500">No market price data available at present.</div>
            )}
          </CardContent>
        </Card>

        {/* Core Portals Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">AgriLink Public Service Portals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Farmer Portal Card */}
            <Card className="border border-emerald-200 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="bg-emerald-50/50 pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="success" className="font-bold">FARMER &amp; FPO SERVICES</Badge>
                  <Users className="h-5 w-5 text-emerald-700" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 mt-2">Farmer &amp; FPO Portal</CardTitle>
                <CardDescription className="text-xs">
                  Create crop lots, view upfront net realization recommendations, and receive direct buyer offers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-3">
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex items-center gap-2">✓ AI-assisted net realization calculation</li>
                  <li className="flex items-center gap-2">✓ Optional AI visual quality assessment</li>
                  <li className="flex items-center gap-2">✓ Direct buyer offer evaluation &amp; comparison</li>
                  <li className="flex items-center gap-2">✓ Transaction timeline &amp; payout status</li>
                </ul>
                <Button
                  onClick={() => handleRoleNavigate("farmer")}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
                >
                  Enter Farmer Portal →
                </Button>
              </CardContent>
            </Card>

            {/* Buyer Portal Card */}
            <Card className="border border-blue-200 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="bg-blue-50/50 pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="info" className="font-bold">COMMERCIAL PROCUREMENT</Badge>
                  <Building2 className="h-5 w-5 text-blue-700" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 mt-2">Buyer Procurement Portal</CardTitle>
                <CardDescription className="text-xs">
                  Source verified crop lots from farmers and FPOs with transparent visual quality evidence.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-3">
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex items-center gap-2">✓ Browse crop lots across Maharashtra</li>
                  <li className="flex items-center gap-2">✓ Visual inspection &amp; quality evidence photos</li>
                  <li className="flex items-center gap-2">✓ Multi-lot AI procurement aggregation</li>
                  <li className="flex items-center gap-2">✓ Digital offer submission &amp; transaction tracking</li>
                </ul>
                <Button
                  onClick={() => handleRoleNavigate("buyer")}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs"
                >
                  Enter Buyer Portal →
                </Button>
              </CardContent>
            </Card>

            {/* Admin Command Center Card */}
            <Card className="border border-purple-200 hover:shadow-md transition-all flex flex-col justify-between">
              <CardHeader className="bg-purple-50/50 pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="default" className="bg-purple-100 text-purple-900 border-purple-300 font-bold">STATE COMMAND CENTER</Badge>
                  <BarChart3 className="h-5 w-5 text-purple-700" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900 mt-2">Market Command Center</CardTitle>
                <CardDescription className="text-xs">
                  Monitor market health, arrival surges, price anomalies, and grievance tickets.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-3">
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex items-center gap-2">✓ Interactive district market health map</li>
                  <li className="flex items-center gap-2">✓ AI market anomaly detection &amp; advisories</li>
                  <li className="flex items-center gap-2">✓ Platform verified buyer registry</li>
                  <li className="flex items-center gap-2">✓ Farmer dispute &amp; grievance resolution</li>
                </ul>
                <Button
                  onClick={() => handleRoleNavigate("admin")}
                  className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs"
                >
                  Enter Command Center →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How The Marketplace Works - Connected System Flow */}
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">How AgriLink Connects Maharashtra Agriculture</h2>
              <p className="text-xs text-gray-500">Transparent end-to-end workflow from farm-gate crop lot creation to state oversight</p>
            </div>
            <Badge variant="verified" className="bg-emerald-100 text-emerald-900 border-emerald-300 text-[10px] font-bold w-fit">
              Connected Operational Flow
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Step 1: Farmer */}
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200 space-y-2 relative">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-700 text-white font-bold text-xs">1</span>
                <h3 className="font-bold text-emerald-950 text-sm">Farmer &amp; FPO Aggregation</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Create digital crop lots with quantity, location, and optional visual quality assessment. Compare APMC mandi rates against buyer direct offers to maximize net realization.
              </p>
              <div className="text-[10px] font-bold text-emerald-800 bg-white/80 p-2 rounded-lg border border-emerald-100">
                Produce Lot → Quality Evidence → Pricing Intelligence
              </div>
            </div>

            {/* Step 2: Buyer */}
            <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200 space-y-2 relative">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-700 text-white font-bold text-xs">2</span>
                <h3 className="font-bold text-blue-950 text-sm">Buyer Direct Procurement</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Browse available lots across Maharashtra with transparent photographic quality evidence. Submit binding digital purchasing offers and track farm-gate pickup logistics.
              </p>
              <div className="text-[10px] font-bold text-blue-800 bg-white/80 p-2 rounded-lg border border-blue-100">
                Browse Lots → Inspect Evidence → Offer &amp; Logistics
              </div>
            </div>

            {/* Step 3: State Oversight */}
            <div className="bg-purple-50/60 rounded-xl p-4 border border-purple-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-700 text-white font-bold text-xs">3</span>
                <h3 className="font-bold text-purple-950 text-sm">State Command Center</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Monitor real-time APMC arrivals, commodity price movements, buyer registry compliance, and settle farmer-buyer disputes via integrated grievance workflows.
              </p>
              <div className="text-[10px] font-bold text-purple-800 bg-white/80 p-2 rounded-lg border border-purple-100">
                Market Health → Transaction Monitoring → Grievance Redressal
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 bg-white py-8 text-xs text-gray-600">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-900">AgriLink Maharashtra Services</p>
            <p className="text-gray-500 mt-0.5">
              State Agricultural Market Intelligence &amp; Transaction Enablement Services
            </p>
          </div>
          <div className="text-gray-500 text-right">
            <p>Data Feed: AGMARKNET 2.0 Direct API</p>
            <p className="mt-0.5">Coverage: Maharashtra APMCs (Nashik, Pune, Solapur, Nagpur, Sangli, Ahilyanagar)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
