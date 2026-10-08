import React from 'react';
import {
  Archive,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle,
  Truck,
  Package,
  Layers,
  Award,
} from 'lucide-react';
import type { FertilizerOutput, FertilizerType } from '../types';

interface FertilizerViewProps {
  outputs: FertilizerOutput[];
  onOpenHarvestModal: () => void;
}

const TYPE_CONFIG: Record<FertilizerType, { label: string; icon: string; bg: string; text: string }> = {
  pellet: {
    label: 'ปุ๋ยอินทรีย์อัดเม็ด (Pellets)',
    icon: '🌾',
    bg: 'bg-emerald-500/20 border-emerald-500/30',
    text: 'text-emerald-300',
  },
  powder: {
    label: 'ปุ๋ยหมักชีวภาพผงละเอียด (Dry Powder)',
    icon: '🍂',
    bg: 'bg-amber-500/20 border-amber-500/30',
    text: 'text-amber-300',
  },
  liquid_bio: {
    label: 'น้ำหมักชีวภาพสกัดเข้มข้น (Liquid Bio-Extract)',
    icon: '🧪',
    bg: 'bg-cyan-500/20 border-cyan-500/30',
    text: 'text-cyan-300',
  },
};

const DEST_LABELS: Record<string, { label: string; icon: any }> = {
  campus_farm: { label: 'สวนเกษตรแปลงสาธิต / แปลงทดลอง', icon: Package },
  community_garden: { label: 'แจกจ่ายชุมชนท้องถิ่น', icon: Truck },
  distribution_sale: { label: 'จำหน่ายเพื่อหมุนเวียนกองทุน', icon: Award },
  storage: { label: 'คลังจัดเก็บสำรอง', icon: Archive },
};

export const FertilizerView: React.FC<FertilizerViewProps> = ({
  outputs,
  onOpenHarvestModal,
}) => {
  const totalKg = outputs.reduce((acc, o) => acc + o.quantityKg, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Archive className="w-5 h-5 text-teal-400" />
            <span>คลังผลผลิตปุ๋ยอินทรีย์คุณภาพสูง (Organic Fertilizer Inventory)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            ผลลัพธ์จากกระบวนการแปรรูปเศษอาหาร พร้อมระบุธาตุอาหาร N-P-K และปลายทางการกระจายผลผลิต
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-xl text-right">
            <span className="text-[11px] text-slate-400 block">ผลผลิตสะสมรวม</span>
            <span className="text-lg font-bold text-teal-300 font-mono">
              {totalKg.toFixed(1)} <span className="text-xs font-normal text-slate-400">กก./ลิตร</span>
            </span>
          </div>
          <button
            onClick={onOpenHarvestModal}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-md shadow-teal-950/40 border border-teal-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>+ บันทึกผลผลิตปุ๋ย</span>
          </button>
        </div>
      </div>

      {/* Grid of Harvested Outputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {outputs.map((out) => {
          const typeConf = TYPE_CONFIG[out.type] || {
            label: out.type,
            icon: '📦',
            bg: 'bg-slate-800 border-slate-700',
            text: 'text-slate-200',
          };
          const dest = DEST_LABELS[out.destination] || {
            label: out.destination,
            icon: Package,
          };
          const DestIcon = dest.icon;

          return (
            <div
              key={out.id}
              className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl hover:border-teal-500/40 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${typeConf.bg} ${typeConf.text}`}>
                  <span>{typeConf.icon}</span>
                  <span>{typeConf.label}</span>
                </span>

                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    out.qualityGrade === 'premium'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {out.qualityGrade === 'premium' ? '★ เกรดพรีเมียม' : 'เกรดมาตรฐาน'}
                </span>
              </div>

              {/* Quantity */}
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">ปริมาณที่เก็บเกี่ยวได้</span>
                  <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
                    {out.quantityKg.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-slate-400">
                      {out.type === 'liquid_bio' ? 'ลิตร (L)' : 'กก. (kg)'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">ชุดการหมัก</span>
                  <span className="font-mono text-xs text-teal-400 font-semibold">{out.batchId}</span>
                </div>
              </div>

              {/* Nutrients & Specifications */}
              <div className="space-y-2 text-xs">
                {out.npkRating && (
                  <div className="flex justify-between items-center text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400">สูตรธาตุอาหาร N-P-K:</span>
                    <span className="font-mono font-bold text-emerald-400">{out.npkRating}</span>
                  </div>
                )}
                {out.moisturePct !== undefined && (
                  <div className="flex justify-between items-center text-slate-300 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                    <span className="text-slate-400">ความชื้นคงเหลือ:</span>
                    <span className="font-mono text-cyan-300">{out.moisturePct}%</span>
                  </div>
                )}
              </div>

              {/* Destination */}
              <div className="text-xs space-y-1">
                <span className="text-slate-400">ปลายทางการนำไปใช้:</span>
                <div className="flex items-center gap-2 text-slate-200 font-medium bg-slate-800/50 p-2 rounded-lg">
                  <DestIcon className="w-4 h-4 text-teal-400 shrink-0" />
                  <span className="truncate">{dest.label}</span>
                </div>
              </div>

              {/* Harvest Date & Notes */}
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{out.harvestDate}</span>
                </div>
                {out.notes && (
                  <span className="truncate max-w-[150px] text-slate-500" title={out.notes}>
                    {out.notes}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
