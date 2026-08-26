"use client";

import { actionAnalyzeLot, actionCreateLot } from "@/actions/agri-actions";
import { DemoBanner, AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_SCENARIO, KOLAR } from "@/lib/demo-data";
import type { CropName, LotInput, QualityGrade } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CROPS: CropName[] = ["Tomato", "Onion", "Potato"];
const GRADES: QualityGrade[] = ["Grade A", "Grade B", "Grade C"];

export default function CreateLotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<LotInput>({
    crop: "Tomato",
    quantity: 2000,
    unit: "kg",
    location: "Kolar, Karnataka",
    lat: KOLAR.lat,
    lng: KOLAR.lng,
    qualityGrade: "Grade A",
    harvestDate: new Date().toISOString().split("T")[0],
    sellingDeadlineDays: 3,
    storageAvailableDays: 2,
    notes: "",
  });

  function loadDemoValues() {
    setForm({
      crop: DEMO_SCENARIO.crop,
      quantity: DEMO_SCENARIO.quantity,
      unit: DEMO_SCENARIO.unit,
      location: DEMO_SCENARIO.location,
      lat: DEMO_SCENARIO.lat,
      lng: DEMO_SCENARIO.lng,
      qualityGrade: DEMO_SCENARIO.qualityGrade,
      harvestDate: DEMO_SCENARIO.harvestDate,
      sellingDeadlineDays: DEMO_SCENARIO.sellingDeadlineDays,
      storageAvailableDays: DEMO_SCENARIO.storageAvailableDays,
      notes: DEMO_SCENARIO.notes,
    });
  }

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { recommendations } = await actionAnalyzeLot(form);
      sessionStorage.setItem("agrilink-recommendations", JSON.stringify(recommendations));
      sessionStorage.setItem("agrilink-lot-input", JSON.stringify(form));
      router.push("/farmer/recommendations");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell role="farmer" userName="Ramesh Kumar">
      <DemoBanner />
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Crop Lot</h1>
            <p className="text-gray-500">Enter your crop details to find the best selling option</p>
          </div>
          <Button variant="demo" size="sm" onClick={loadDemoValues}>
            Load Demo Values
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crop Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyze} className="space-y-5">
              <Field label="Crop">
                <select
                  value={form.crop}
                  onChange={(e) => setForm({ ...form, crop: e.target.value as CropName })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                >
                  {CROPS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Quantity">
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
                    min={100}
                    required
                  />
                </Field>
                <Field label="Unit">
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  >
                    <option>kg</option>
                    <option>quintal</option>
                  </select>
                </Field>
              </div>

              <Field label="Location">
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  required
                />
              </Field>

              <Field label="Quality Grade">
                <div className="flex gap-2">
                  {GRADES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm({ ...form, qualityGrade: g })}
                      className={`flex-1 rounded-xl border py-3 text-sm font-medium transition-colors ${
                        form.qualityGrade === g
                          ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Harvest Date">
                  <input
                    type="date"
                    value={form.harvestDate}
                    onChange={(e) => setForm({ ...form, harvestDate: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  />
                </Field>
                <Field label="Selling Deadline (days)">
                  <input
                    type="number"
                    value={form.sellingDeadlineDays}
                    onChange={(e) => setForm({ ...form, sellingDeadlineDays: Number(e.target.value) })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3"
                    min={1}
                    max={30}
                  />
                </Field>
              </div>

              <Field label="Storage Available (days)">
                <input
                  type="number"
                  value={form.storageAvailableDays}
                  onChange={(e) => setForm({ ...form, storageAvailableDays: Number(e.target.value) })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  min={0}
                  max={14}
                />
              </Field>

              <Field label="Notes (optional)">
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3"
                  rows={2}
                />
              </Field>

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Analyzing Markets...
                  </>
                ) : (
                  "Analyze & Get Recommendation"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
