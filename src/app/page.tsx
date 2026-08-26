"use client";

import { actionLoadDemoScenario, actionLogin } from "@/actions/agri-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_DATA_LABEL } from "@/lib/demo-data";
import {
  ArrowRight,
  Leaf,
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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-amber-400 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Leaf className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold sm:text-5xl">AgriLink</h1>
              <p className="text-emerald-200">From farm-gate to the best buyer.</p>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-lg text-emerald-100 sm:text-xl">
            Don&apos;t just see today&apos;s mandi price. Know <strong>where</strong>,{" "}
            <strong>when</strong>, and <strong>to whom</strong> to sell — and your{" "}
            <strong>actual net earnings</strong> after transport and storage.
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
              {loading === "demo" ? "Loading Demo..." : "Load Demo Scenario"}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleRoleLogin("farmer")}
              disabled={!!loading}
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              Enter as Farmer
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
          <p className="mt-4 text-sm text-emerald-300">
            Demo: Ramesh · Kolar · 2,000 kg Grade A Tomato · 3-day deadline
          </p>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <Badge />
          <h2 className="mt-3 text-2xl font-bold text-gray-900">
            AI-Assisted Farm-to-Market Decision Engine
          </h2>
          <p className="mt-2 text-gray-600">
            Deterministic ranking + explainable AI. SIH26132 — Smart India Hackathon 2026
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: TrendingUp, title: "Market Intelligence", desc: "Mandi prices, trends, arrival volumes & demand" },
            { icon: Users, title: "Buyer Matching", desc: "Verified buyers ranked by net realization" },
            { icon: Truck, title: "Cost Calculator", desc: "Transport, storage & transaction costs included" },
            { icon: Sparkles, title: "Explainable AI", desc: "LLM explains — engine decides the numbers" },
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

      {/* Role selection */}
      <section className="border-t border-emerald-100 bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">Choose Your Role</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {(
              [
                { role: "farmer" as const, title: "Farmer", desc: "Create lots, get recommendations, manage offers" },
                { role: "buyer" as const, title: "Buyer", desc: "Browse lots, submit offers, track transactions" },
                { role: "admin" as const, title: "Admin", desc: "Platform overview, market trends, analytics" },
              ] as const
            ).map(({ role, title, desc }) => (
              <Card key={role} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant={role === "farmer" ? "default" : "secondary"}
                    onClick={() => handleRoleLogin(role)}
                    disabled={!!loading}
                  >
                    {loading === role ? "Entering..." : `Enter as ${title}`}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-emerald-100 py-8 text-center text-sm text-gray-500">
        <p>AgriLink · SIH26132 · {DEMO_DATA_LABEL}</p>
        <p className="mt-1">Built for Smart India Hackathon 2026</p>
      </footer>
    </div>
  );
}

function Badge() {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
      {DEMO_DATA_LABEL}
    </span>
  );
}
