import React from 'react';
import {
  Leaf,
  Archive,
  CloudRain,
  Flame,
  Thermometer,
  Droplets,
  TrendingUp,
  ShieldCheck,
  Trees,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import type {
  FoodWasteLog,
  CompostBin,
  FermentationBatch,
  FertilizerOutput,
} from '../types';

interface DashboardViewProps {
  wasteLogs: FoodWasteLog[];
  compostBins: CompostBin[];
  batches: FermentationBatch[];
  fertilizerOutputs: FertilizerOutput[];
  onOpenWasteModal: () => void;
  onOpenBatchModal: () => void;
  onOpenHarvestModal: () => void;
  onSelectTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  wasteLogs,
  compostBins,
  batches,
  fertilizerOutputs,
  onOpenWasteModal,
  onOpenBatchModal,
  onOpenHarvestModal,
  onSelectTab,
}) => {
  // Aggregate Metrics
  const totalWasteKg = wasteLogs.reduce((acc, log) => acc + log.weightKg, 0);
  const totalFertilizerKg = fertilizerOutputs.reduce((acc, f) => acc + f.quantityKg, 0);
  const totalCo2Avoided = wasteLogs.reduce((acc, log) => acc + log.carbonOffsetKg, 0);
  // Methane averted: roughly 0.25 kg CH4 avoided per kg food waste diverted
  const methaneAvoided = (totalWasteKg * 0.25).toFixed(1);
  // Equivalent tree seedlings grown for 10 years (approx 21.77 kg CO2 per tree/year)
  const treesEquivalent = Math.max(1, Math.round(totalCo2Avoided / 21.7));

  // Conversion efficiency percentage
  const conversionRate = totalWasteKg > 0
    ? ((totalFertilizerKg / totalWasteKg) * 100).toFixed(1)
    : '21.5';

  // Category breakdown
  const categoryCounts: Record<string, number> = {
    vegetable_fruit: 0,
    meat_protein: 0,
    grains_bakery: 0,
    coffee_eggshell: 0,
    mixed_scraps: 0,
  };
  wasteLogs.forEach((log) => {
    if (categoryCounts[log.category] !== undefined) {
      categoryCounts[log.category] += log.weightKg;
    }
  });

  const categoryLabels: Record<string, { label: string; color: string; bg: string }> = {
    vegetable_fruit: { label: 'ผักและผลไม้', color: 'text-emerald-400', bg: 'bg-emerald-500' },
    grains_bakery: { label: 'ข้าว/แป้ง/เบเกอรี่', color: 'text-amber-400', bg: 'bg-amber-500' },
    meat_protein: { label: 'เนื้อสัตว์/โปรตีน', color: 'text-rose-400', bg: 'bg-rose-500' },
    coffee_eggshell: { label: 'กากกาแฟ/เปลือกไข่', color: 'text-orange-400', bg: 'bg-orange-500' },
    mixed_scraps: { label: 'เศษอาหารทั่วไป', color: 'text-blue-400', bg: 'bg-blue-500' },
  };

  const activeProcessingBins = compostBins.filter((b) => b.status === 'processing').length;
  const activeCuringBins = compostBins.filter((b) => b.status === 'curing').length;

  return (
    <div className="space-y-6">
      {/* Hero Banner with Summary & Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart IoT Zero-Waste Circular Economy Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              ระบบติดตามการหมักและแปรรูปเศษอาหารเป็นปุ๋ยชีวภาพ
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              ติดตามเส้นทางวงจรปิดของขยะเศษอาหารตั้งแต่จุดคัดแยก
              สู่เครื่องหมักย่อยสลายอุณหภูมิสูงแบบเติมอากาศ (Aerobic Digesters)
              จนได้ปุ๋ยอินทรีย์คุณภาพสูงพร้อมลดการปล่อยก๊าซเรือนกระจก
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenWasteModal}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-medium text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-950/60 active:scale-95 transition-all border border-emerald-400/40"
            >
              <Leaf className="w-4 h-4" />
              <span>+ บันทึกเศษอาหาร</span>
            </button>
            <button
              onClick={onOpenBatchModal}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-medium text-sm px-4 py-2.5 rounded-xl border border-emerald-500/30 active:scale-95 transition-all"
            >
              <Flame className="w-4 h-4 text-emerald-400" />
              <span>+ เริ่มรอบหมักใหม่</span>
            </button>
            <button
              onClick={onOpenHarvestModal}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-teal-300 font-medium text-sm px-4 py-2.5 rounded-xl border border-teal-500/30 active:scale-95 transition-all"
            >
              <Archive className="w-4 h-4 text-teal-400" />
              <span>+ บันทึกเก็บเกี่ยวปุ๋ย</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Waste Diverted */}
        <div className="bg-slate-900/80 border border-emerald-900/40 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-400">เศษอาหารที่นำเข้าจัดการ</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {totalWasteKg.toLocaleString('th-TH', { maximumFractionDigits: 1 })}
            </span>
            <span className="text-sm font-semibold text-slate-400">กิโลกรัม (kg)</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 inline" />
            <span>แยกขยะจากแหล่งกำเนิด</span>
          </p>
        </div>

        {/* Bio-Fertilizer Harvested */}
        <div className="bg-slate-900/80 border border-teal-900/40 rounded-2xl p-5 relative overflow-hidden group hover:border-teal-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-teal-400">ปุ๋ยอินทรีย์ที่ผลิตได้</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20">
              <Archive className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {totalFertilizerKg.toLocaleString('th-TH', { maximumFractionDigits: 1 })}
            </span>
            <span className="text-sm font-semibold text-slate-400">กก. (kg / L)</span>
          </div>
          <p className="mt-2 text-xs text-teal-300/80 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-400 inline" />
            <span>อัตราส่วนเปลี่ยนเป็นปุ๋ย ~{conversionRate}%</span>
          </p>
        </div>

        {/* Carbon Offset Avoided */}
        <div className="bg-slate-900/80 border border-cyan-900/40 rounded-2xl p-5 relative overflow-hidden group hover:border-cyan-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-cyan-400">ลดการปล่อยคาร์บอน (CO₂e)</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
              <Trees className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {totalCo2Avoided.toLocaleString('th-TH', { maximumFractionDigits: 1 })}
            </span>
            <span className="text-sm font-semibold text-slate-400">kg CO₂e</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span>เทียบเท่าการปลูกต้นไม้</span>
            <span className="text-cyan-300 font-semibold">{treesEquivalent} ต้น</span>
          </p>
        </div>

        {/* Active IoT Digesters */}
        <div className="bg-slate-900/80 border border-indigo-900/40 rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-400">สถานะเครื่องหมักชีวภาพ</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {activeProcessingBins + activeCuringBins} / {compostBins.length}
            </span>
            <span className="text-sm font-semibold text-slate-400">เครื่องกำลังทำงาน</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ย่อยสลาย {activeProcessingBins} | บ่มปุ๋ย {activeCuringBins}</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Machine Telemetry & Waste Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* IoT Composting Units Status (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-emerald-400" />
                <span>สถานะเครื่องหมัก & เซนเซอร์ IoT เรียลไทม์</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ติดตามอุณหภูมิช่วงทนความร้อนสูง (Thermophilic 55–65°C) และความชื้น
              </p>
            </div>
            <button
              onClick={() => onSelectTab('compostBins')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <span>จัดการเครื่องทั้งหมด</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compostBins.map((bin) => {
              const capacityPct = Math.min(100, Math.round((bin.currentWeightKg / bin.capacityKg) * 100));
              const isHot = bin.temperatureC >= 55;
              return (
                <div
                  key={bin.id}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-emerald-500/30 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold text-slate-200 text-sm line-clamp-1">
                        {bin.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{bin.model}</p>
                    </div>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                        bin.status === 'processing'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : bin.status === 'curing'
                          ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {bin.status === 'processing' ? '🔥 กำลังย่อยสลาย' : bin.status === 'curing' ? '🌱 กำลังบ่มปุ๋ย' : 'สแตนด์บาย'}
                    </span>
                  </div>

                  {/* Telemetry Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                      <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                        <Thermometer className="w-3 h-3 text-rose-400" />
                        <span>อุณหภูมิ</span>
                      </div>
                      <div className={`text-sm font-bold mt-0.5 ${isHot ? 'text-amber-300 font-mono' : 'text-slate-200 font-mono'}`}>
                        {bin.temperatureC.toFixed(1)}°C
                      </div>
                    </div>

                    <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                      <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                        <Droplets className="w-3 h-3 text-cyan-400" />
                        <span>ความชื้น</span>
                      </div>
                      <div className="text-sm font-bold text-cyan-300 font-mono mt-0.5">
                        {bin.moisturePct}%
                      </div>
                    </div>

                    <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                      <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                        <span>pH</span>
                      </div>
                      <div className="text-sm font-bold text-emerald-300 font-mono mt-0.5">
                        {bin.phLevel.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>ความจุบรรจุ ({bin.currentWeightKg.toFixed(1)} / {bin.capacityKg} กก.)</span>
                      <span className="font-semibold text-slate-300">{capacityPct}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          capacityPct > 85
                            ? 'bg-rose-500'
                            : capacityPct > 60
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${capacityPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Waste Category Composition Breakdown (1 Col) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>สัดส่วนประเภทเศษอาหาร</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              สมดุล C:N และอินทรียวัตถุส่งผลต่อคุณภาพปุ๋ย
            </p>

            <div className="space-y-3">
              {Object.entries(categoryCounts).map(([catKey, weight]) => {
                const conf = categoryLabels[catKey] || {
                  label: catKey,
                  color: 'text-slate-300',
                  bg: 'bg-slate-500',
                };
                const percentage = totalWasteKg > 0 ? ((weight / totalWasteKg) * 100).toFixed(1) : '0';
                return (
                  <div key={catKey} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className={`font-medium ${conf.color}`}>{conf.label}</span>
                      <span className="text-slate-400">
                        {weight.toFixed(1)} กก. ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${conf.bg} rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 bg-slate-950/40 rounded-xl p-3 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>เกร็ดความรู้ C:N Ratio ที่เหมาะสม</span>
            </div>
            <p>
              สูตรปุ๋ยคุณภาพสูงต้องการคาร์บอน (ข้าว/กากกาแฟ/ใบไม้) และไนโตรเจน (เศษผัก/เนื้อ)
              ในอัตราส่วน 25-30:1 เพื่อให้จุลินทรีย์ย่อยสลายได้เร็วที่สุดโดยไร้กลิ่นรบกวน
            </p>
          </div>
        </div>
      </div>

      {/* Conversion Pipeline Timeline Summary */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              <span>รอบการหมักชีวภาพที่กำลังดำเนินการ (Active Batches)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              กระบวนการย่อยสลายและการแปรสภาพสารอาหาร
            </p>
          </div>
          <button
            onClick={() => onSelectTab('batches')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
          >
            <span>ดูรอบการหมักทั้งหมด</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {batches.slice(0, 3).map((batch) => (
            <div
              key={batch.id}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-emerald-400 font-semibold">{batch.id}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    batch.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : batch.status === 'curing'
                      ? 'bg-teal-500/20 text-teal-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {batch.status === 'completed' ? 'เสร็จสิ้น' : batch.status === 'curing' ? 'ขั้นตอนบ่ม' : 'ย่อยความร้อนสูง'}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400">เครื่องหมัก:</p>
                <p className="text-sm font-medium text-slate-200 line-clamp-1">{batch.binName}</p>
              </div>

              <div className="flex justify-between text-xs text-slate-400">
                <span>ปริมาณนำเข้า: {batch.inputWeightKg} กก.</span>
                <span>คาดการณ์ผลผลิต: ~{batch.expectedYieldKg} กก.</span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-400">
                  <span>ความคืบหน้า</span>
                  <span className="font-bold text-emerald-400">{batch.progressPct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                    style={{ width: `${batch.progressPct}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
