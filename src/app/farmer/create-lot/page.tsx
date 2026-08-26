"use client";

import { actionAnalyzeLot } from "@/actions/agri-actions";
import { DemoBanner, AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_SCENARIO, NASHIK } from "@/lib/demo-data";
import type { CropName, LotInput, QualityGrade } from "@/lib/types";
import { Loader2, Mic, MicOff, Sparkles, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CROPS: CropName[] = ["Tomato", "Onion", "Potato"];
const GRADES: QualityGrade[] = ["Grade A", "Grade B", "Grade C"];

export default function CreateLotPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [form, setForm] = useState<LotInput>({
    crop: "Tomato",
    quantity: 2000,
    unit: "kg",
    location: "Nashik, Maharashtra",
    lat: NASHIK.lat,
    lng: NASHIK.lng,
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

  function handleVoiceInput() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice input is not supported in your browser. Loading demo voice prompt: '2000 kg Grade A Tomatoes in Nashik'");
      setForm({
        ...form,
        crop: "Tomato",
        quantity: 2000,
        qualityGrade: "Grade A",
        location: "Nashik, Maharashtra",
      });
      setVoiceText("Recognized: 2000 kg Grade A Tomatoes in Nashik, Maharashtra");
      return;
    }

    try {
      const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceText("Listening... Speak crop, quantity and location.");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setVoiceText(`Recognized: "${transcript}"`);
        setIsListening(false);

        const lower = transcript.toLowerCase();
        if (lower.includes("onion")) setForm(prev => ({ ...prev, crop: "Onion" }));
        if (lower.includes("potato")) setForm(prev => ({ ...prev, crop: "Potato" }));
        if (lower.includes("tomato")) setForm(prev => ({ ...prev, crop: "Tomato" }));

        const qtyMatch = transcript.match(/\d+/);
        if (qtyMatch) {
          setForm(prev => ({ ...prev, quantity: parseInt(qtyMatch[0], 10) }));
        }

        if (lower.includes("grade b") || lower.includes("b grade")) setForm(prev => ({ ...prev, qualityGrade: "Grade B" }));
        if (lower.includes("grade c") || lower.includes("c grade")) setForm(prev => ({ ...prev, qualityGrade: "Grade C" }));
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceText("Voice error. Loaded default demo fields.");
        loadDemoValues();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      loadDemoValues();
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Sell My Crop</h1>
            <p className="text-gray-500 text-sm">Enter crop details to calculate your best selling option</p>
          </div>
          <Button variant="demo" size="sm" onClick={loadDemoValues}>
            Load Demo Values
          </Button>
        </div>

        {/* Voice Input Assist Bar */}
        <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold transition-all shadow-sm ${
                isListening
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-emerald-700 text-white hover:bg-emerald-800"
              }`}
            >
              {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
            </button>
            <div>
              <p className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-emerald-700" />
                Farmer Voice Assistant
              </p>
              <p className="text-xs text-gray-600">
                {voiceText || "Tap mic and say e.g. '2000 kg Grade A Tomatoes in Nashik'"}
              </p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crop Lot Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAnalyze} className="space-y-5">
              <Field label="Crop">
                <select
                  value={form.crop}
                  onChange={(e) => setForm({ ...form, crop: e.target.value as CropName })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:outline-none"
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

              <Field label="Quality Grade (AI-Assisted Self Assessment)">
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
                <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl flex items-center gap-1.5 border border-gray-100">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Grade A: Firm, uniform color, &lt;5% defect. Accepted by Sahyadri FPO &amp; exporters.
                  </span>
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

              <Button type="submit" size="lg" className="w-full font-bold text-base shadow-md" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Analyzing Options...
                  </>
                ) : (
                  "Calculate Net Realization & Find Buyers"
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
