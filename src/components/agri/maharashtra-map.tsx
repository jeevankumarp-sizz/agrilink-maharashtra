"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, MapPin, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

export interface DistrictInfo {
  id: string;
  name: string;
  region: string;
  status: "HEALTHY" | "HOTSPOT" | "ATTENTION" | "ANOMALY";
  crop: string;
  modalPrice: number;
  priceTrend: string;
  arrivalVolume: number;
  demandLevel: "HIGH" | "MEDIUM" | "LOW";
  storageAvailableDays: number;
  topBuyer: string;
  suggestedAction: string;
}

const MAHARASHTRA_DISTRICTS: DistrictInfo[] = [
  {
    id: "nashik",
    name: "Nashik",
    region: "North Maharashtra",
    status: "HEALTHY",
    crop: "Tomato",
    modalPrice: 29,
    priceTrend: "+4.5%",
    arrivalVolume: 450,
    demandLevel: "HIGH",
    storageAvailableDays: 3,
    topBuyer: "Sahyadri Farmers Producer Co",
    suggestedAction: "Direct farm-gate procurement active. Optimal sell window 24-48 hours.",
  },
  {
    id: "pune",
    name: "Pune",
    region: "Paschim Maharashtra",
    status: "HOTSPOT",
    crop: "Tomato",
    modalPrice: 34,
    priceTrend: "+1.2%",
    arrivalVolume: 920,
    demandLevel: "HIGH",
    storageAvailableDays: 2,
    topBuyer: "Mahafresh Logistics Pvt Ltd",
    suggestedAction: "High buyer demand hotspot. Institutional buyers offering premium quotes for Grade A.",
  },
  {
    id: "nagpur",
    name: "Nagpur",
    region: "Vidarbha",
    status: "ATTENTION",
    crop: "Onion",
    modalPrice: 21,
    priceTrend: "-2.1%",
    arrivalVolume: 340,
    demandLevel: "MEDIUM",
    storageAvailableDays: 5,
    topBuyer: "Orange City Farmers FPO",
    suggestedAction: "Moderate price stability. Utilize warehouse storage for 3-5 days.",
  },
  {
    id: "solapur",
    name: "Solapur",
    region: "Solapur / Marathwada",
    status: "ANOMALY",
    crop: "Tomato",
    modalPrice: 25,
    priceTrend: "-14.2%",
    arrivalVolume: 680,
    demandLevel: "LOW",
    storageAvailableDays: 4,
    topBuyer: "Solapur Kisan FPO",
    suggestedAction: "Alert: Arrival volume surge (+28%). Advise farmers to re-route lots to Pune Gultekdi APMC.",
  },
  {
    id: "sangli",
    name: "Sangli",
    region: "Paschim Maharashtra",
    status: "HEALTHY",
    crop: "Tomato",
    modalPrice: 28,
    priceTrend: "+1.2%",
    arrivalVolume: 310,
    demandLevel: "HIGH",
    storageAvailableDays: 4,
    topBuyer: "Sangli Tomato Processors",
    suggestedAction: "Processing units acquiring bulk inventory. FPO aggregation enabled.",
  },
  {
    id: "kolhapur",
    name: "Kolhapur",
    region: "Paschim Maharashtra",
    status: "HEALTHY",
    crop: "Potato",
    modalPrice: 20,
    priceTrend: "+1.2%",
    arrivalVolume: 290,
    demandLevel: "HIGH",
    storageAvailableDays: 6,
    topBuyer: "Kolhapur Fresh Retail Chain",
    suggestedAction: "Retail chains purchasing at steady rate. Direct pickup scheduled.",
  },
  {
    id: "ahilyanagar",
    name: "Ahilyanagar",
    region: "Central Maharashtra",
    status: "ATTENTION",
    crop: "Onion",
    modalPrice: 22,
    priceTrend: "0.0%",
    arrivalVolume: 410,
    demandLevel: "MEDIUM",
    storageAvailableDays: 5,
    topBuyer: "Ahilyanagar Wholesale Hub",
    suggestedAction: "Stable arrivals. Monitor Lasalgaon APMC auction trends.",
  },
  {
    id: "satara",
    name: "Satara",
    region: "Paschim Maharashtra",
    status: "HEALTHY",
    crop: "Tomato",
    modalPrice: 30,
    priceTrend: "+2.5%",
    arrivalVolume: 260,
    demandLevel: "HIGH",
    storageAvailableDays: 3,
    topBuyer: "Mahafresh Logistics",
    suggestedAction: "Strong consumer demand. Fast clear-out expected.",
  },
];

export function MaharashtraMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictInfo>(MAHARASHTRA_DISTRICTS[0]);

  const statusColors: Record<DistrictInfo["status"], "success" | "info" | "warning" | "danger"> = {
    HEALTHY: "success",
    HOTSPOT: "info",
    ATTENTION: "warning",
    ANOMALY: "danger",
  };

  const statusIcons = {
    HEALTHY: "🟢 Healthy",
    HOTSPOT: "🔵 Buyer Hotspot",
    ATTENTION: "🟡 Attention",
    ANOMALY: "🔴 Price Anomaly",
  };

  return (
    <Card className="border border-emerald-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-emerald-50/50 pb-3 border-b border-emerald-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-700" />
              Maharashtra State Market Command Map (APMC Regional Hubs)
            </CardTitle>
            <p className="text-xs text-gray-500">
              Interactive district market health, arrival volumes, and buyer demand monitoring
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full w-fit">
            Source: AGMARKNET 2.0 &amp; Regional Data
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6 space-y-6">
        {/* District Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MAHARASHTRA_DISTRICTS.map((d) => {
            const isSelected = selectedDistrict.id === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDistrict(d)}
                className={`p-3 rounded-2xl text-left border-2 transition-all ${
                  isSelected
                    ? "border-emerald-600 bg-emerald-50 shadow-md ring-2 ring-emerald-200"
                    : "border-gray-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-sm">{d.name}</p>
                  <span className="text-[10px]">{statusIcons[d.status].slice(0, 2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{d.crop}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-emerald-700 text-sm">₹{d.modalPrice}/kg</span>
                  <span className={`text-[11px] font-semibold ${d.priceTrend.startsWith("+") ? "text-emerald-600" : d.priceTrend.startsWith("-") ? "text-red-600" : "text-gray-500"}`}>
                    {d.priceTrend}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected District Detail Card */}
        {selectedDistrict && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-gray-900">{selectedDistrict.name} District Market Detail</h3>
                  <Badge variant={statusColors[selectedDistrict.status]}>
                    {statusIcons[selectedDistrict.status]}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">{selectedDistrict.region} Demo Zone</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Benchmark Modal Price</p>
                <p className="text-2xl font-bold text-emerald-800">₹{selectedDistrict.modalPrice}/kg</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <p className="text-gray-500">Crop Monitored</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{selectedDistrict.crop}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <p className="text-gray-500">Arrival Volume</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{selectedDistrict.arrivalVolume} quintals</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <p className="text-gray-500">Buyer Demand</p>
                <p className="font-bold text-emerald-700 text-sm mt-0.5">{selectedDistrict.demandLevel}</p>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-200">
                <p className="text-gray-500">Storage Capacity</p>
                <p className="font-bold text-gray-800 text-sm mt-0.5">{selectedDistrict.storageAvailableDays} days avail.</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-800 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-emerald-700" />
                  Top Region Buyer: {selectedDistrict.topBuyer}
                </span>
                <Badge variant="verified">Verified Buyer</Badge>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed border-t border-gray-100 pt-2">
                <strong>Government Command Action:</strong> {selectedDistrict.suggestedAction}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
