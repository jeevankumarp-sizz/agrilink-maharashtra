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
  Leaf,
  MapPin,
  Package,
  Scale,
  Shield,
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-amber-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Leaf className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">AgriLink</h1>
              <p className="text-sm text-emerald-200">SIH26132 · Smart India Hackathon 2026</p>
            </div>
          </div>
          <h2 className="mt-4 max-w-3xl text-2xl font-bold leading-tight sm:text-4xl">
            Don&apos;t just know today&apos;s price.
            <br />
            <span className="text-amber-300">
              Know where, when &amp; to whom to sell.
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-base text-emerald-100 sm:text-lg">
            AgriLink combines market prices, buyer demand, logistics, storage
            and buyer reliability to recommend the best farm-to-market decision
            &mdash; with your <strong>actual net earnings</strong> calculated
            upfront.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="demo"
              size="lg"
              onClick={handleDemo}
              disabled={!!loading}
              className="text-base"
            >
              <Zap className="h-5 w-5" />
              {loading === "demo" ? "Loading Demo..." : "Try Farmer Demo"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleRoleLogin("farmer")}
              disabled={!!loading}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <TrendingUp className="h-5 w-5" />
              Explore Market Intelligence
            </Button>
          </div>
          <p className="mt-4 text-sm text-emerald-300">
            Demo: Ramesh · Kolar, Karnataka · 2,000 kg Grade A Tomato · 3-day selling deadline
          </p>
        </div>
      </section>

      {/* Flow Diagram */}
      <section className="border-b border-gray-100 bg-emerald-50/30 py-12">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-emerald-700 mb-6">
            How AgriLink Works
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { icon: Users, label: "Farmer" },
              { icon: TrendingUp, label: "Market Intelligence" },
              { icon: Sparkles, label: "AI Decision Engine" },
              { icon: BarChart3, label: "Best Selling Option" },
              { icon: Shield, label: "Verified Buyer" },
              { icon: Package, label: "Transaction" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex items-center gap-2 sm:gap-3">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 text-center max-w-[80px]">{label}</span>
                </div>
                {i < 5 && (
                  <ArrowRight className="h-4 w-4 text-emerald-400 hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Value Props */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
            {DEMO_DATA_LABEL}
          </span>
          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            AI-Assisted Farm-to-Market Decision Engine
          </h2>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Not just another price board. AgriLink answers: Where, When, To Whom, and How Much after costs.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: TrendingUp,
              title: "Market Intelligence",
              desc: "Live mandi prices, trends, arrival volumes & demand levels across 10 Karnataka markets",
            },
            {
              icon: Users,
              title: "Buyer Matching",
              desc: "18 verified buyers ranked by net realization — not just price, but actual earnings",
            },
            {
              icon: Truck,
              title: "Cost Calculator",
              desc: "Transport + storage + transaction costs deducted upfront. No surprises.",
            },
            {
              icon: Sparkles,
              title: "Explainable AI",
              desc: "Deterministic engine decides, LLM explains. Zero price hallucination.",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardContent className="p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="mt-1 text-sm text-gray-500">{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Architecture — for Judges */}
      <section className="border-t border-b border-gray-100 bg-gray-50/50 py-14">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-center text-sm font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            System Architecture
          </p>
          <h2 className="text-center text-xl font-bold text-gray-900 mb-8">
            Five-Layer Design
          </h2>
          <div className="space-y-3">
            {[
              {
                layer: "DATA LAYER",
                desc: "Market prices + Buyer demand + Logistics + Storage costs",
                color: "bg-blue-50 border-blue-200 text-blue-800",
                iconColor: "bg-blue-100 text-blue-700",
              },
              {
                layer: "DECISION ENGINE",
                desc: "Net realization scoring + Multi-factor matching + Sale window",
                color: "bg-emerald-50 border-emerald-200 text-emerald-800",
                iconColor: "bg-emerald-100 text-emerald-700",
              },
              {
                layer: "AI LAYER",
                desc: "Explainable recommendations + Natural language advisory",
                color: "bg-purple-50 border-purple-200 text-purple-800",
                iconColor: "bg-purple-100 text-purple-700",
              },
              {
                layer: "TRANSACTION LAYER",
                desc: "Digital lots + Offers + Logistics + Payment tracking",
                color: "bg-amber-50 border-amber-200 text-amber-800",
                iconColor: "bg-amber-100 text-amber-700",
              },
              {
                layer: "IMPACT LAYER",
                desc: "Farmer realization + Transparency + Reduced costs + FPO aggregation",
                color: "bg-rose-50 border-rose-200 text-rose-800",
                iconColor: "bg-rose-100 text-rose-700",
              },
            ].map(({ layer, desc, color, iconColor }, i) => (
              <div key={layer}>
                <div className={`flex items-center gap-4 rounded-xl border px-4 py-3 ${color}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconColor} text-sm font-bold`}>
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{layer}</p>
                    <p className="text-xs opacity-80">{desc}</p>
                  </div>
                </div>
                {i < 4 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-4 w-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SIH PS Checklist */}
      <section className="mx-auto max-w-4xl px-4 py-14">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-emerald-700 mb-2">
          Problem Statement SIH26132
        </p>
        <h2 className="text-center text-xl font-bold text-gray-900 mb-8">
          Every PS Requirement — Addressed
        </h2>
        <div className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {[
            "Mandi price intelligence",
            "Buyer demand aggregation",
            "Quality requirements & grading",
            "Arrival volume tracking",
            "Transport cost calculation",
            "Storage cost calculation",
            "Localized price trends",
            "Sale-window recommendation",
            "Verified buyer matching",
            "Digital lot creation",
            "Digital offer system",
            "Logistics coordination",
            "Payment tracking",
            "Grievance / dispute support",
            "FPO aggregation",
            "Explainable decision engine",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 py-1.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Role selection */}
      <section className="border-t border-emerald-100 bg-white py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-xl font-bold text-gray-900 mb-6">
            Choose Your Role
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                role: "farmer" as const,
                title: "👨‍🌾 Farmer",
                desc: "Sell my crop, check prices, find buyers, track my sale",
                color: "border-emerald-200 hover:border-emerald-400",
              },
              {
                role: "buyer" as const,
                title: "🏢 Buyer",
                desc: "Browse lots, submit offers, track transactions",
                color: "border-blue-200 hover:border-blue-400",
              },
              {
                role: "admin" as const,
                title: "📊 Admin",
                desc: "Platform analytics, market trends, grievances",
                color: "border-purple-200 hover:border-purple-400",
              },
            ].map(({ role, title, desc, color }) => (
              <button
                key={role}
                onClick={() => handleRoleLogin(role)}
                disabled={!!loading}
                className={`rounded-2xl border-2 bg-white p-5 text-left transition-all hover:shadow-md ${color}`}
              >
                <p className="text-lg font-bold text-gray-900">{title}</p>
                <p className="mt-1 text-sm text-gray-500">{desc}</p>
                {loading === role && (
                  <p className="mt-2 text-xs text-emerald-600">Entering...</p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Story */}
      <section className="border-t border-gray-100 bg-emerald-50/30 py-14">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700 mb-2">
            SIH Demo Flow
          </p>
          <h2 className="text-xl font-bold text-gray-900 mb-8">
            Complete Workflow in One Click
          </h2>
          <div className="text-left space-y-2">
            {[
              "Farmer Ramesh has 2,000 kg Grade A tomatoes in Kolar",
              "AgriLink analyzes price, demand, transport, storage & buyer reliability",
              "Shows top 3 selling options with expected net realization",
              "Recommends optimal selling window based on market signals",
              "Shows \"What if I wait?\" comparison",
              "Creates digital lot and matches with verified buyers",
              "Buyer makes offer → Farmer compares and accepts",
              "Tracks logistics, delivery, and payment",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-white px-4 py-3 border border-gray-100">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
          <Button
            variant="demo"
            size="lg"
            onClick={handleDemo}
            disabled={!!loading}
            className="mt-8 text-base"
          >
            <Zap className="h-5 w-5" />
            {loading === "demo" ? "Loading..." : "Run Full Demo →"}
          </Button>
        </div>
      </section>

      <footer className="border-t border-emerald-100 py-8 text-center text-sm text-gray-500">
        <p className="font-medium text-gray-700">
          &ldquo;Farmers don&apos;t just need today&apos;s price. They need the best selling decision.&rdquo;
        </p>
        <p className="mt-2">AgriLink · SIH26132 · {DEMO_DATA_LABEL}</p>
        <p className="mt-1">Built for Smart India Hackathon 2026</p>
      </footer>
    </div>
  );
}
