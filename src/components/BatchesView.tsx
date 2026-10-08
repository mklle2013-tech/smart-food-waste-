import React from 'react';
import {
  Flame,
  Plus,
  Clock,
  Sparkles,
  ArrowRight,
  Archive,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import type { FermentationBatch } from '../types';

interface BatchesViewProps {
  batches: FermentationBatch[];
  onOpenBatchModal: () => void;
  onOpenHarvestModal: (batch: FermentationBatch) => void;
  onAdvanceProgress: (batchId: string, currentPct: number, currentStatus: FermentationBatch['status']) => void;
}

export const BatchesView: React.FC<BatchesViewProps> = ({
  batches,
  onOpenBatchModal,
  onOpenHarvestModal,
  onAdvanceProgress,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-emerald-400" />
            <span>รอบการแปรรูปเศษอาหารเป็นปุ๋ย (Fermentation Batches)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ติดตามขั้นตอนทางชีวภาพ การเติมหัวเชื้อจุลินทรีย์ และอัตราส่วนสารอาหารจนถึงการเก็บเกี่ยว
          </p>
        </div>

        <button
          onClick={onOpenBatchModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-950/40 border border-emerald-400/30"
        >
          <Plus className="w-4 h-4" />
          <span>+ เริ่มรอบการหมักใหม่</span>
        </button>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {batches.map((batch) => {
          const isCompleted = batch.status === 'completed';
          const isReadyToHarvest = batch.progressPct >= 90 && !isCompleted;

          return (
            <div
              key={batch.id}
              className={`bg-slate-900/90 border rounded-2xl p-5 shadow-xl transition-all space-y-4 ${
                isCompleted
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : isReadyToHarvest
                  ? 'border-teal-400/50 bg-teal-950/20 ring-1 ring-teal-500/30'
                  : 'border-slate-800'
              }`}
            >
              {/* Batch Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {batch.id}
                    </span>
                    <h3 className="font-bold text-white text-base">{batch.binName}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>เริ่มเมื่อ: {new Date(batch.startedAt).toLocaleDateString('th-TH')}</span>
                  </p>
                </div>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : batch.status === 'curing'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {isCompleted
                    ? '✓ เสร็จสิ้นแล้ว'
                    : batch.status === 'curing'
                    ? '🌱 ขั้นตอนบ่มแห้ง'
                    : '🔥 ย่อยสลายความร้อนสูง'}
                </span>
              </div>

              {/* Technical Bio Parameters */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">น้ำหนักเศษอาหารนำเข้า</span>
                  <span className="text-base font-bold text-white font-mono">
                    {batch.inputWeightKg.toFixed(1)} <span className="text-xs font-normal text-slate-400">กก.</span>
                  </span>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-400 block mb-1">ผลผลิตปุ๋ยคาดการณ์</span>
                  <span className="text-base font-bold text-teal-300 font-mono">
                    ~{batch.expectedYieldKg.toFixed(1)} <span className="text-xs font-normal text-slate-400">กก.</span>
                  </span>
                </div>
              </div>

              {/* Bio Inoculant Formula */}
              <div className="bg-slate-950/40 rounded-xl p-3 border border-slate-800/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">สูตรหัวเชื้อ / เอนไซม์:</span>
                  <span className="font-semibold text-emerald-400">{batch.inoculantType}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">อัตราส่วน C:N Ratio:</span>
                  <span className="font-mono text-slate-200">{batch.carbonNitrogenRatio}</span>
                </div>
              </div>

              {/* Progress & Stages */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ความคืบหน้ากระบวนการย่อย</span>
                  </span>
                  <span className="font-bold text-emerald-400 font-mono">{batch.progressPct}%</span>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${batch.progressPct}%` }}
                  />
                </div>

                {/* Micro Steps Indicator */}
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center pt-1 text-slate-400">
                  <div className={batch.progressPct >= 20 ? 'text-emerald-400 font-medium' : ''}>1. เติมเชื้อ</div>
                  <div className={batch.progressPct >= 50 ? 'text-emerald-400 font-medium' : ''}>2. ย่อยสลาย</div>
                  <div className={batch.progressPct >= 80 ? 'text-emerald-400 font-medium' : ''}>3. บ่มปุ๋ย</div>
                  <div className={batch.progressPct >= 100 ? 'text-emerald-400 font-medium' : ''}>4. พร้อมเก็บ</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                {!isCompleted ? (
                  <>
                    <button
                      onClick={() =>
                        onAdvanceProgress(
                          batch.id,
                          Math.min(100, batch.progressPct + 20),
                          batch.progressPct + 20 >= 80 ? 'curing' : 'thermophilic'
                        )
                      }
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl transition-colors border border-slate-700"
                    >
                      + เร่งรอบหมัก (+20%)
                    </button>

                    <button
                      onClick={() => onOpenHarvestModal(batch)}
                      className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-teal-950/60 active:scale-95"
                    >
                      <Archive className="w-3.5 h-3.5" />
                      <span>เก็บเกี่ยวเป็นปุ๋ย</span>
                    </button>
                  </>
                ) : (
                  <div className="w-full flex items-center justify-between text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>เก็บเกี่ยวผลผลิตเรียบร้อยแล้ว</span>
                    </div>
                    {batch.actualYieldKg && (
                      <span className="font-mono font-bold text-white">
                        {batch.actualYieldKg} กก.
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
