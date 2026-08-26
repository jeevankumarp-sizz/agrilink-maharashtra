"use client";

import { actionLoadDemoScenario, actionLogin } from "@/actions/agri-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_DATA_LABEL } from "@/lib/demo-data";
import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  CheckSquare,
  Globe,
  Layers,
  Leaf,
  MapPin,
  Package,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleRoleLogin(role: "farmer" | "buyer" | "admin") {
    setLoading(role);
    await actionLogin(role);
    router.push(`/${role}`);
  }

  async function handleDemo() {
    setLoading("demo");
    const result = await actionLoadDemoScenario();
    if (result.success) {
      router.push(`/farmer/recommendations?lotId=${result.lotId}&demo=1`);
    }
    setLoading(null);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Government & Sponsor Header Bar */}
      <div className="bg-emerald-950 text-emerald-200 text-xs px-4 py-2 border-b border-emerald-800">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-emerald-800 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">SIH26132</span>
            <span>Government of Maharashtra · SIH 2026 Prototype</span>
          </div>
          <div className="text-emerald-300 text-[11px] flex items-center gap-3">
            <span>State Agricultural Market Intelligence &amp; Transaction Enablement Platform</span>
            <Link href="/sih-coverage" className="underline font-bold text-amber-300 flex items-center gap-1">
              <CheckSquare className="h-3 w-3" /> Requirement Coverage
            </Link>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur shadow-inner">
              <Leaf className="h-7 w-7 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl tracking-tight">AgriLink Maharashtra</h1>
              <p className="text-sm text-emerald-200">Prototype developed for SIH 2026 PS 26132</p>
            </div>
          </div>

          <h2 className="mt-4 max-w-3xl text-2xl font-extrabold leading-tight sm:text-4xl">
            Don&apos;t just know the price.
            <br />
            <span className="text-amber-300">
              Know where, when &amp; to whom to sell.
            </span>
          </h2>

          <p className="mt-4 max-w-2xl text-base text-emerald-100 sm:text-lg leading-relaxed">
            AgriLink Maharashtra combines market intelligence, arrivals, buyer demand, quality, logistics, storage and buyer reliability to recommend the best farm-to-market decision — with your <strong>actual net earnings</strong> calculated upfront.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="demo"
              size="lg"
              onClick={handleDemo}
              disabled={!!loading}
              className="text-base shadow-lg font-bold"
            >
              <Zap className="h-5 w-5 mr-1" />
              {loading === "demo" ? "Loading Demo..." : "LOAD SIH MAHARASHTRA DEMO"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleRoleLogin("farmer")}
              disabled={!!loading}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 text-base"
            >
              <TrendingUp className="h-5 w-5 mr-1" />
              Explore Market Intelligence
            </Button>
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-emerald-300 bg-white/5 w-fit px-3.5 py-1.5 rounded-full border border-white/10">
            <MapPin className="h-3.5 w-3.5 text-amber-400" />
            <span>SIH Demo Scenario: Ramesh Kumar · Nashik, Maharashtra · 2,000 kg Grade A Tomato · 3-day deadline</span>
          </div>
        </div>
      </section>

      {/* Visual Flow Diagram */}
      <section className="border-b border-gray-100 bg-emerald-50/40 py-10">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-emerald-800 mb-6">
            AgriLink Maharashtra Decision &amp; Transaction Flow
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {[
              { icon: Users, label: "FARMER / FPO" },
              { icon: TrendingUp, label: "MARKET INTELLIGENCE" },
              { icon: Sparkles, label: "AI DECISION ENGINE" },
              { icon: BarChart3, label: "BEST SELLING OPTION" },
              { icon: ShieldCheck, label: "VERIFIED BUYER" },
              { icon: Package, label: "TRANSACTION" },
              { icon: Scale, label: "PAYMENT" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-white border border-emerald-200 text-emerald-700 shadow-xs">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-800 text-center max-w-[85px] leading-tight">{label}</span>
                </div>
                {i < 6 && (
                  <ArrowRight className="h-4 w-4 text-emerald-500 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Value Proposition Cards */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-10 text-center space-y-2">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300">
            {DEMO_DATA_LABEL}
          </span>
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            AI-Assisted Farm-to-Market Decision Engine
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            Not just another price board. AgriLink Maharashtra converts fragmented market signals into actionable decisions.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: TrendingUp,
              title: "Market Intelligence",
              desc: "Current market snapshot across Nashik, Pune, Nagpur, Solapur, Sangli, Kolhapur & Ahilyanagar APMCs",
            },
            {
              icon: Users,
              title: "Verified Buyer Network",
              desc: "18 verified buyers (Sahyadri FPO, Mahafresh, Reliance Hub) ranked by actual net realization",
            },
            {
              icon: Truck,
              title: "Net Realization Engine",
              desc: "Upfront transport, storage and transaction fee deductions. No hidden costs.",
            },
            {
              icon: Sparkles,
              title: "Explainable AI",
              desc: "Deterministic mathematical scoring engine + LLM natural language decision explanation.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border border-emerald-100 hover:shadow-md transition-all">
              <CardContent className="p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-gray-900">{title}</h3>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Government Ecosystem Positioning */}
      <section className="border-t border-b border-gray-100 bg-gray-50/80 py-14">
        <div className="mx-auto max-w-5xl px-4 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Government Ecosystem Alignment
            </span>
            <h2 className="text-2xl font-bold text-gray-900">
              How AgriLink Fits Into Maharashtra&apos;s Agricultural Ecosystem
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              AgriLink is designed as an intelligence and decision-support layer that can integrate existing agricultural market ecosystems rather than replace them.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-5 text-center font-semibold text-xs">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col items-center justify-center">
              <span className="text-emerald-700 font-bold mb-1">1. Market Systems</span>
              <span className="text-gray-600">APMC Mandis &amp; e-NAM Feeds</span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-950 flex flex-col items-center justify-center">
              <span className="text-emerald-800 font-bold mb-1">2. Data Layer</span>
              <span>Price, Arrival &amp; Demand Aggregation</span>
            </div>
            <div className="bg-emerald-700 text-white p-4 rounded-xl shadow-md flex flex-col items-center justify-center">
              <span className="font-bold mb-1">3. AgriLink Engine</span>
              <span>Net Realization &amp; Sale Window Scoring</span>
            </div>
            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-emerald-950 flex flex-col items-center justify-center">
              <span className="text-emerald-800 font-bold mb-1">4. Buyer Matching</span>
              <span>Sahyadri FPOs &amp; Verified Processors</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-xs flex flex-col items-center justify-center">
              <span className="text-emerald-700 font-bold mb-1">5. Farmer Impact</span>
              <span className="text-gray-600">+12.6% Price Realization</span>
            </div>
          </div>
        </div>
      </section>

      {/* SIH PS Checklist */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <div className="flex flex-col items-center mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Problem Statement SIH26132 Compliance
          </span>
          <h2 className="text-center text-xl font-bold text-gray-900">
            SIH26132 Requirement Coverage
          </h2>
          <Link href="/sih-coverage" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
            View Complete Requirement Matrix &amp; Feature Links <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
          {[
            "🟢 Mandi price intelligence & arrivals",
            "🟢 Buyer demand aggregation",
            "🟡 Quality requirements & grading (Grade A/B/C)",
            "🟢 Arrival volume tracking & anomaly alerts",
            "🟢 Transport cost calculator",
            "🟢 Storage cost calculator",
            "🟢 Localized price trends across Maharashtra",
            "🟢 Sale-window recommendation (24-48 hrs)",
            "🟢 Verified buyer trust profiles & reliability scores",
            "🟢 Farmer & FPO lot creation",
            "🟢 Digital offer system (accept/reject)",
            "🟡 Logistics coordination & tracking",
            "🟡 Payment tracking & visual transaction timeline",
            "🟢 Dispute / grievance resolution workflow",
            "🟢 FPO aggregation dashboard (bulk lots)",
            "🟢 Buyer-side lot aggregation",
            "🟢 Explainable decision engine (deterministic + LLM)",
            "🟢 Maharashtra state command center dashboard",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 py-1">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="text-xs font-medium text-gray-800">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Role Selection */}
      <section className="border-t border-emerald-100 bg-white py-14">
        <div className="mx-auto max-w-4xl px-4 space-y-6">
          <h2 className="text-center text-xl font-bold text-gray-900">
            Select User Role for Demonstration
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                role: "farmer" as const,
                title: "👨‍🌾 Farmer / FPO",
                desc: "Sell my crop, check mandi prices, find buyers, track my sale",
                color: "border-emerald-200 hover:border-emerald-400 bg-emerald-50/30",
              },
              {
                role: "buyer" as const,
                title: "🏢 Verified Buyer",
                desc: "Browse lots, submit offers, aggregate farmer supply",
                color: "border-blue-200 hover:border-blue-400 bg-blue-50/30",
              },
              {
                role: "admin" as const,
                title: "📊 State Command Center",
                desc: "Maharashtra market command map, anomaly alerts, platform analytics",
                color: "border-purple-200 hover:border-purple-400 bg-purple-50/30",
              },
            ].map(({ role, title, desc, color }) => (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleLogin(role)}
                disabled={!!loading}
                className={`rounded-2xl border-2 p-5 text-left transition-all hover:shadow-md ${color}`}
              >
                <p className="text-base font-bold text-gray-900">{title}</p>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">{desc}</p>
                {loading === role && (
                  <p className="mt-2 text-xs font-bold text-emerald-700">Entering role...</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-emerald-100 py-8 text-center text-xs text-gray-500 bg-gray-50/50 space-y-2">
        <p className="font-semibold text-gray-800 text-sm">
          &ldquo;Farmers don&apos;t just need today&apos;s price. They need the best selling decision.&rdquo;
        </p>
        <p>AgriLink Maharashtra · Problem Statement SIH26132 · Prototype developed for SIH 2026 PS 26132</p>
        <p>Government of Maharashtra Demonstration Prototype</p>
      </footer>
    </div>
  );
}
