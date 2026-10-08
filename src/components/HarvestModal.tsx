import React, { useState } from 'react';
import {
  X,
  Archive,
  Sparkles,
  Scale,
  Award,
  Truck,
  Package,
} from 'lucide-react';
import type {
  FermentationBatch,
  FertilizerType,
  QualityGrade,
  FertilizerDestination,
} from '../types';

interface HarvestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    batchId: string;
    type: FertilizerType;
    quantityKg: number;
    npkRating: string;
    moisturePct: number;
    qualityGrade: QualityGrade;
    destination: FertilizerDestination;
    harvestDate: string;
    notes?: string;
  }) => Promise<void>;
  batches: FermentationBatch[];
  selectedBatch?: FermentationBatch | null;
}

export const HarvestModal: React.FC<HarvestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  batches,
  selectedBatch,
}) => {
  const [batchId, setBatchId] = useState<string>(selectedBatch?.id || batches[0]?.id || 'batch-101');
  const [type, setType] = useState<FertilizerType>('pellet');
  const [quantityKg, setQuantityKg] = useState<number>(selectedBatch?.expectedYieldKg || 18.0);
  const [npkRating, setNpkRating] = useState<string>('4 - 3 - 2 + Ca 2.5%');
  const [moisturePct, setMoisturePct] = useState<number>(12);
  const [qualityGrade, setQualityGrade] = useState<QualityGrade>('premium');
  const [destination, setDestination] = useState<FertilizerDestination>('campus_farm');
  const [notes, setNotes] = useState<string>('ปุ๋ยอินทรีย์เนื้อละเอียด ไร้กลิ่น ผ่านการกำจัดเชื้อโรคด้วยความร้อนสมบูรณ์');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityKg <= 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        batchId,
        type,
        quantityKg: Number(quantityKg),
        npkRating,
        moisturePct: Number(moisturePct),
        qualityGrade,
        destination,
        harvestDate: new Date().toISOString().split('T')[0],
        notes,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-teal-500/30 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Archive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">บันทึกเก็บเกี่ยวปุ๋ยอินทรีย์ (Harvest Fertilizer)</h3>
            <p className="text-xs text-slate-400">บันทึกผลผลิตปุ๋ยที่ผ่านการย่อยสลายและบ่มเสร็จสมบูรณ์</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Target Batch */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              เลือกชุดการหมัก (Fermentation Batch):
            </label>
            <select
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} - {b.binName} ({b.progressPct}%)
                </option>
              ))}
            </select>
          </div>

          {/* Fertilizer Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              รูปแบบปุ๋ยที่แปรรูปได้:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'pellet', label: 'ปุ๋ยอัดเม็ด', icon: '🌾' },
                { id: 'powder', label: 'ปุ๋ยผงหมัก', icon: '🍂' },
                { id: 'liquid_bio', label: 'น้ำหมักชีวภาพ', icon: '🧪' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setType(t.id as FertilizerType);
                    if (t.id === 'liquid_bio') {
                      setMoisturePct(90);
                      setNpkRating('EM Bio-Extract 10x');
                    } else if (t.id === 'pellet') {
                      setMoisturePct(12);
                      setNpkRating('4 - 3 - 2 + Ca 2.5%');
                    } else {
                      setMoisturePct(15);
                      setNpkRating('3 - 2 - 3');
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    type === t.id
                      ? 'bg-teal-950/60 border-teal-400 text-teal-200 shadow-sm font-semibold'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl block mb-1">{t.icon}</span>
                  <span className="text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ปริมาณผลผลิตจริงที่เก็บเกี่ยวได้:
            </label>
            <div className="relative">
              <Scale className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="0.1"
                min="0.5"
                required
                value={quantityKg}
                onChange={(e) => setQuantityKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-14 py-2 text-white font-mono font-bold text-base focus:outline-none focus:border-teal-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                {type === 'liquid_bio' ? 'ลิตร (L)' : 'กก. (kg)'}
              </span>
            </div>
          </div>

          {/* NPK & Moisture */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                สูตรธาตุอาหาร N-P-K:
              </label>
              <input
                type="text"
                required
                value={npkRating}
                onChange={(e) => setNpkRating(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ความชื้นคงเหลือ (%):
              </label>
              <input
                type="number"
                min="5"
                max="99"
                required
                value={moisturePct}
                onChange={(e) => setMoisturePct(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {/* Quality & Destination */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                เกรดคุณภาพ:
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as QualityGrade)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="premium">เกรดพรีเมียม (Premium)</option>
                <option value="standard">เกรดมาตรฐาน (Standard)</option>
                <option value="utility">เกรดทั่วไป (Utility)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ปลายทางการส่งมอบ:
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value as FertilizerDestination)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value="campus_farm">สวนเกษตรแปลงสาธิต</option>
                <option value="community_garden">แจกจ่ายชุมชน</option>
                <option value="distribution_sale">จำหน่ายกองทุนหมุนเวียน</option>
                <option value="storage">คลังเก็บสำรอง</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              หมายเหตุ / ลักษณะทางกายภาพ:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-teal-600 hover:bg-teal-500 active:scale-95 transition-all shadow-lg"
            >
              {isSubmitting ? 'กำลังบันทึก...' : '✓ บันทึกผลผลิตเข้าคลัง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
