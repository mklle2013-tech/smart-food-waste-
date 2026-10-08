import React from 'react';
import {
  Cpu,
  Thermometer,
  Droplets,
  Wind,
  Flame,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Power,
  RotateCcw,
} from 'lucide-react';
import type { CompostBin } from '../types';

interface CompostBinsViewProps {
  bins: CompostBin[];
  onUpdateBin: (binId: string, updates: Partial<CompostBin>) => Promise<void>;
  onOpenBatchModal: (preselectedBinId?: string) => void;
}

export const CompostBinsView: React.FC<CompostBinsViewProps> = ({
  bins,
  onUpdateBin,
  onOpenBatchModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>ระบบถังหมักอัจฉริยะ & เซนเซอร์ IoT (Smart Digester Units)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ควบคุมกระบวนการย่อยสลายแบบใช้ออกซิเจน (Aerobic) ด้วยระบบควบคุมอุณหภูมิและความชื้นอัตโนมัติ
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/70 border border-slate-800 px-3.5 py-2 rounded-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>IoT Controller Telemetry: เชื่อมต่อสมบูรณ์ (Active)</span>
        </div>
      </div>

      {/* Thermophilic Composting Info Banner */}
      <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-4 text-xs text-emerald-300 flex items-start gap-3">
        <Activity className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-emerald-200">
            มาตรฐานอุณหภูมิการหมักชีวภาพ (Thermophilic Phase 55°C - 65°C)
          </p>
          <p className="text-emerald-300/80 leading-relaxed">
            อุณหภูมิที่สูงกว่า 55°C ต่อเนื่องอย่างน้อย 48 ชั่วโมง จะช่วยกำจัดเชื้อโรค พยาธิ และเมล็ดวัชพืชในเศษอาหารจนหมดสิ้น
            พร้อมเร่งการย่อยสลายให้เร็วขึ้น 10 เท่าเมื่อเทียบกับการหมักแบบธรรมดา
          </p>
        </div>
      </div>

      {/* Grid of Digester Units */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {bins.map((bin) => {
          const capacityPct = Math.min(100, Math.round((bin.currentWeightKg / bin.capacityKg) * 100));
          const isOptimalTemp = bin.temperatureC >= 55 && bin.temperatureC <= 65;
          const isHighTemp = bin.temperatureC > 65;

          return (
            <div
              key={bin.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-emerald-500/40 transition-all space-y-5"
            >
              {/* Unit Title and Status */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-800 text-emerald-400 font-mono text-xs px-2 py-0.5 rounded font-bold border border-slate-700">
                      {bin.id}
                    </span>
                    <h3 className="font-bold text-white text-base">{bin.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">รุ่นเครื่อง: {bin.model}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                      bin.status === 'processing'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : bin.status === 'curing'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : bin.status === 'maintenance'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {bin.status === 'processing'
                      ? '⚡ กำลังย่อยสลาย'
                      : bin.status === 'curing'
                      ? '🌱 ขั้นตอนบ่มปุ๋ย'
                      : bin.status === 'maintenance'
                      ? '🔧 ซ่อมบำรุง'
                      : '💤 สแตนด์บาย'}
                  </span>
                </div>
              </div>

              {/* Sensor Readouts */}
              <div className="grid grid-cols-3 gap-3">
                {/* Temperature */}
                <div
                  className={`p-3 rounded-xl border text-center transition-all ${
                    isOptimalTemp
                      ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                      : isHighTemp
                      ? 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    <span>อุณหภูมิ</span>
                  </div>
                  <div className="text-xl font-bold font-mono">
                    {bin.temperatureC.toFixed(1)}°C
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {isOptimalTemp ? '✓ เหมาะสมสูง' : bin.temperatureC < 50 ? 'ระยะปรับตัว' : 'สูงเกินเกณฑ์'}
                  </span>
                </div>

                {/* Moisture */}
                <div className="p-3 rounded-xl border bg-slate-950/60 border-slate-800 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    <span>ความชื้น</span>
                  </div>
                  <div className="text-xl font-bold text-cyan-300 font-mono">
                    {bin.moisturePct}%
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {bin.moisturePct >= 50 && bin.moisturePct <= 65 ? '✓ สมดุล 50-65%' : 'ควรปรับความชื้น'}
                  </span>
                </div>

                {/* pH */}
                <div className="p-3 rounded-xl border bg-slate-950/60 border-slate-800 text-center">
                  <div className="flex items-center justify-center gap-1 text-xs text-slate-400 mb-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ค่า pH</span>
                  </div>
                  <div className="text-xl font-bold text-emerald-300 font-mono">
                    {bin.phLevel.toFixed(1)}
                  </div>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    {bin.phLevel >= 6.5 && bin.phLevel <= 7.5 ? '✓ สภาพเป็นกลาง' : 'กรด/ด่างอ่อน'}
                  </span>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>ปริมาณที่บรรจุ ({bin.currentWeightKg.toFixed(1)} / {bin.capacityKg} กก.)</span>
                  <span className="font-bold font-mono">{capacityPct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      capacityPct > 85 ? 'bg-rose-500' : capacityPct > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${capacityPct}%` }}
                  />
                </div>
              </div>

              {/* Hardware / IoT Controls */}
              <div className="pt-2 border-t border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>แผงควบคุมระบบกลไก (IoT Actuators)</span>
                  <span className="text-[11px] text-slate-500">ควบคุมทางไกล</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Aeration toggle */}
                  <button
                    onClick={() =>
                      onUpdateBin(bin.id, {
                        aerationActive: !bin.aerationActive,
                        // If turning aeration on, slightly increase temp
                        temperatureC: !bin.aerationActive ? Math.min(68, bin.temperatureC + 1.2) : bin.temperatureC,
                      })
                    }
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                      bin.aerationActive
                        ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Wind className={`w-4 h-4 ${bin.aerationActive ? 'text-cyan-400 animate-spin' : 'text-slate-500'}`} />
                      <span>มอเตอร์เติมอากาศ</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        bin.aerationActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {bin.aerationActive ? 'เปิด' : 'ปิด'}
                    </span>
                  </button>

                  {/* Heating toggle */}
                  <button
                    onClick={() =>
                      onUpdateBin(bin.id, {
                        heatingActive: !bin.heatingActive,
                        temperatureC: !bin.heatingActive ? Math.min(65, bin.temperatureC + 3.0) : Math.max(35, bin.temperatureC - 2.0),
                      })
                    }
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition-all ${
                      bin.heatingActive
                        ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Flame className={`w-4 h-4 ${bin.heatingActive ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span>ขดลวดฮีตเตอร์</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        bin.heatingActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {bin.heatingActive ? 'เปิด' : 'ปิด'}
                    </span>
                  </button>
                </div>

                {/* Simulation adjustment buttons */}
                <div className="flex items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
                  <span>จำลองการเปลี่ยนแปลงเซนเซอร์:</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() =>
                        onUpdateBin(bin.id, {
                          temperatureC: Math.min(72, Number((bin.temperatureC + 2.5).toFixed(1))),
                          moisturePct: Math.max(20, bin.moisturePct - 2),
                        })
                      }
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700"
                    >
                      +2.5°C
                    </button>
                    <button
                      onClick={() =>
                        onUpdateBin(bin.id, {
                          temperatureC: Math.max(25, Number((bin.temperatureC - 2.5).toFixed(1))),
                        })
                      }
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700"
                    >
                      -2.5°C
                    </button>
                    <button
                      onClick={() =>
                        onUpdateBin(bin.id, {
                          moisturePct: Math.min(90, bin.moisturePct + 5),
                        })
                      }
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 border border-slate-700"
                    >
                      +ความชื้น
                    </button>
                  </div>
                </div>

                {/* Start batch from bin */}
                {bin.status === 'idle' && (
                  <button
                    onClick={() => onOpenBatchModal(bin.id)}
                    className="w-full mt-2 bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/40 py-2 rounded-xl text-xs font-semibold transition-all"
                  >
                    + เริ่มรอบการหมักในเครื่องนี้
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
