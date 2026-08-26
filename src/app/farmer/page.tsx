import { actionGetFarmerDashboard, actionLogin } from "@/actions/agri-actions";
import { DemoBanner, AppShell } from "@/components/layout/app-shell";
import { LotCard } from "@/components/agri/recommendation-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMarketsForCrop } from "@/lib/decision-engine";
import { DEMO_BUYERS } from "@/lib/demo-data";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ArrowRight, MapPin, Package, TrendingUp, Zap } from "lucide-react";
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
          <p className="flex items-center gap-1 text-gray-500">
            <MapPin className="h-4 w-4" /> {user.location}
          </p>
        </div>
        <Link href="/farmer/create-lot">
          <Button size="lg" className="w-full sm:w-auto">
            <Zap className="h-5 w-5" />
            Find Best Selling Option
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Active Lots", value: lots.filter((l) => l.status !== "completed").length },
          { label: "Pending Offers", value: pendingOffers.length },
          { label: "Transactions", value: transactions.length },
          { label: "Tomato Price", value: `₹${tomatoMarkets[0]?.modalPrice ?? 28}/kg` },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-xl font-bold text-emerald-800">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active lots */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Package className="h-4 w-4" /> Active Lots
            </h2>
            <Link href="/farmer/create-lot" className="text-sm text-emerald-700 hover:underline">
              + New Lot
            </Link>
          </div>
          {lots.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <p>No lots yet. Create one to get started.</p>
                <Link href="/farmer/create-lot">
                  <Button className="mt-4">Create Lot</Button>
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
          <h2 className="mb-3 font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Current Tomato Prices
          </h2>
          <Card>
            <CardContent className="divide-y p-0">
              {tomatoMarkets.slice(0, 5).map((m) => (
                <div key={m.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-800">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.distanceKm} km · {m.demandLevel} demand</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700">₹{m.modalPrice}/kg</p>
                    <Badge variant={m.demandLevel === "HIGH" ? "success" : "warning"} className="text-xs">
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
            <h2 className="font-semibold text-gray-900">Pending Offers</h2>
            <Link href="/farmer/offers" className="flex items-center gap-1 text-sm text-emerald-700">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {pendingOffers.slice(0, 3).map((o) => (
              <Card key={o.id}>
                <CardContent className="p-4">
                  <p className="font-medium">{o.buyerName}</p>
                  <p className="text-lg font-bold text-emerald-700">₹{o.pricePerKg}/kg</p>
                  <p className="text-xs text-gray-500">{formatNumber(o.quantity)} kg · {o.distanceKm} km</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Recommended buyers preview */}
      <section className="mt-6">
        <h2 className="mb-3 font-semibold text-gray-900">Top Verified Buyers</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_BUYERS.filter((b) => b.cropsRequired.includes("Tomato")).slice(0, 3).map((b, i) => (
            <Card key={b.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">#{i + 1} {b.name}</CardTitle>
                  <Badge variant="verified">Verified</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-sm text-gray-600 space-y-1">
                <p>₹{b.priceMin}–{b.priceMax}/kg · {formatNumber(b.quantityRequired)} kg req.</p>
                <p>{b.distanceKm} km · {b.paymentReliability}% reliability</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
