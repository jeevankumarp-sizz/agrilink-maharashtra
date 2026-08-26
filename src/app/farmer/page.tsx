import { actionGetFarmerDashboard, actionLogin } from "@/actions/agri-actions";
import { DemoBanner, AppShell } from "@/components/layout/app-shell";
import { LotCard } from "@/components/agri/recommendation-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMarketsForCrop } from "@/lib/decision-engine";
import { DEMO_BUYERS } from "@/lib/demo-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ArrowRight, MapPin, Package, Search, ShoppingBag, TrendingUp, Truck, Users, Zap } from "lucide-react";
import Link from "next/link";

export default async function FarmerDashboard() {
  await actionLogin("farmer");
  const { user, lots, pendingOffers, transactions } = await actionGetFarmerDashboard();
  const tomatoMarkets = getMarketsForCrop("Tomato");

  return (
    <AppShell role="farmer" userName={user.name}>
      <DemoBanner />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name.split(" ")[0]}</h1>
          <p className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
            <MapPin className="h-4 w-4 text-emerald-700" /> {user.location}
          </p>
        </div>
        <Link href="/farmer/create-lot">
          <Button size="lg" className="w-full sm:w-auto font-bold text-base shadow-md">
            <Zap className="h-5 w-5 mr-1" />
            Find Best Selling Option
          </Button>
        </Link>
      </div>

      {/* 4 Large Farmer Touch Action Cards (Phase 5) */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          {
            title: "1. Sell My Crop",
            sub: "माझं पीक विका",
            href: "/farmer/create-lot",
            icon: Zap,
            color: "border-emerald-500 bg-emerald-50 text-emerald-950",
            iconColor: "bg-emerald-700 text-white",
          },
          {
            title: "2. Market Prices",
            sub: "बाजार भाव पाहा",
            href: "/farmer/market",
            icon: TrendingUp,
            color: "border-blue-300 bg-blue-50/60 text-blue-950",
            iconColor: "bg-blue-700 text-white",
          },
          {
            title: "3. Find Buyers",
            sub: "खरेदीदार शोधा",
            href: "/farmer/offers",
            icon: Users,
            color: "border-purple-300 bg-purple-50/60 text-purple-950",
            iconColor: "bg-purple-700 text-white",
          },
          {
            title: "4. Track My Sale",
            sub: "माझी विक्री ट्रॅक करा",
            href: "/farmer/fpo",
            icon: Truck,
            color: "border-amber-300 bg-amber-50/60 text-amber-950",
            iconColor: "bg-amber-700 text-white",
          },
        ].map((act) => (
          <Link key={act.title} href={act.href}>
            <div className={`rounded-2xl border-2 p-4 transition-all hover:shadow-md ${act.color} flex flex-col justify-between h-32`}>
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${act.iconColor} font-bold shadow-xs`}>
                  <act.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 opacity-60" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">{act.title}</p>
                <p className="text-xs opacity-75 mt-0.5">{act.sub}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Active Lots", value: lots.filter((l) => l.status !== "completed").length },
          { label: "Pending Offers", value: pendingOffers.length },
          { label: "Transactions", value: transactions.length },
          { label: "Tomato Benchmark", value: `₹${tomatoMarkets[0]?.modalPrice ?? 29}/kg` },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-emerald-800 mt-1">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active lots */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-700" /> Active Crop Lots
            </h2>
            <Link href="/farmer/create-lot" className="text-sm font-semibold text-emerald-700 hover:underline">
              + New Lot
            </Link>
          </div>
          {lots.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <p>No active lots yet. Create your first lot to get buyer offers.</p>
                <Link href="/farmer/create-lot">
                  <Button className="mt-4 font-bold">Create Lot</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {lots.slice(0, 4).map((lot) => (
                <Link key={lot.id} href={`/farmer/lots/${lot.id}`}>
                  <LotCard lot={lot} />
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Market prices */}
        <section>
          <h2 className="mb-3 font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-700" /> Current Maharashtra Mandi Prices
          </h2>
          <Card>
            <CardContent className="divide-y p-0 text-sm">
              {tomatoMarkets.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-bold text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.distanceKm} km away · {m.demandLevel} demand</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700">₹{m.modalPrice}/kg</p>
                    <Badge variant={m.demandLevel === "HIGH" ? "success" : "warning"} className="text-[10px] mt-0.5">
                      {m.arrivalVolume} q arrival
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Pending offers */}
      {pendingOffers.length > 0 && (
        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Pending Direct Buyer Offers</h2>
            <Link href="/farmer/offers" className="flex items-center gap-1 text-sm font-semibold text-emerald-700">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {pendingOffers.slice(0, 3).map((o) => (
              <Card key={o.id} className="border-emerald-200">
                <CardContent className="p-4 space-y-1">
                  <p className="font-bold text-gray-900">{o.buyerName}</p>
                  <p className="text-xl font-bold text-emerald-700">₹{o.pricePerKg}/kg</p>
                  <p className="text-xs text-gray-500">{formatNumber(o.quantity)} kg · {o.distanceKm} km away</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Recommended buyers preview */}
      <section className="mt-6">
        <h2 className="mb-3 font-bold text-gray-900">Top Verified Maharashtra Buyers</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_BUYERS.filter((b) => b.cropsRequired.includes("Tomato")).slice(0, 3).map((b, i) => (
            <Card key={b.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-bold">#{i + 1} {b.name}</CardTitle>
                  <Badge variant="verified">Verified</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-emerald-700">₹{b.priceMin}–{b.priceMax}/kg · {formatNumber(b.quantityRequired)} kg required</p>
                <p>{b.distanceKm} km · {b.paymentReliability}% payment reliability</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
