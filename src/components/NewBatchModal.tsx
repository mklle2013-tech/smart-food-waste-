import React, { useState } from 'react';
import {
  X,
  Flame,
  Sparkles,
  Scale,
  Calendar,
  Layers,
} from 'lucide-react';
import type { CompostBin } from '../types';

interface NewBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    binId: string;
    binName: string;
    inputWeightKg: number;
    inoculantType: string;
    carbonNitrogenRatio: string;
    expectedYieldKg: number;
  }) => Promise<void>;
  bins: CompostBin[];
  preselectedBinId?: string;
}

const INOCULANT_OPTIONS = [
  'หัวเชื้อจุลินทรีย์ทนร้อน Thermophilic Bio-Culture (TB-04)',
  'หัวเชื้อ EM-1 เข้มข้น ผสมกากน้ำตาลและรำข้าว',
  'เอนไซม์เร่งย่อยเซลลูโลส + สปอร์ Trichoderma',
  'จุลินทรีย์สังเคราะห์แสง (PSB) + ขี้เถ้าชีวมวล',
];

export const NewBatchModal: React.FC<NewBatchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bins,
  preselectedBinId,
}) => {
  const [binId, setBinId] = useState<string>(preselectedBinId || bins[0]?.id || 'bin-01');
  const [inputWeightKg, setInputWeightKg] = useState<number>(60.0);
  const [inoculantType, setInoculantType] = useState<string>(INOCULANT_OPTIONS[0]);
  const [carbonNitrogenRatio, setCarbonNitrogenRatio] = useState<string>('25:1 (รำข้าว + เศษใบไม้แห้ง)');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const selectedBin = bins.find((b) => b.id === binId) || bins[0];
  const expectedYield = Number((inputWeightKg * 0.2).toFixed(1)); // ~20% solid bio-fertilizer

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputWeightKg <= 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        binId,
        binName: selectedBin?.name || 'Compost Unit',
        inputWeightKg: Number(inputWeightKg),
        inoculantType,
        carbonNitrogenRatio,
        expectedYieldKg: expectedYield,
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
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">เริ่มรอบการหมักแปรรูปใหม่ (Start Batch)</h3>
            <p className="text-xs text-slate-400">กำหนดพารามิเตอร์การหมักและชนิดหัวเชื้อจุลินทรีย์</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Bin */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              เครื่องหมักชีวภาพเป้าหมาย:
            </label>
            <select
              value={binId}
              onChange={(e) => setBinId(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
            >
              {bins.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} (ความจุ {b.capacityKg} กก.)
                </option>
              ))}
            </select>
          </div>

          {/* Input Weight */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              น้ำหนักเศษอาหารที่บรรจุรอบนี้ (กก.):
            </label>
            <div className="relative">
              <Scale className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="0.5"
                min="1"
                required
                value={inputWeightKg}
                onChange={(e) => setInputWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-12 py-2 text-white font-mono font-bold text-base focus:outline-none focus:border-teal-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">กก.</span>
            </div>
          </div>

          {/* Inoculant */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              สูตรหัวเชื้อจุลินทรีย์ / เอนไซม์ชีวภาพ:
            </label>
            <select
              value={inoculantType}
              onChange={(e) => setInoculantType(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-teal-500"
            >
              {INOCULANT_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* C:N Ratio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              อัตราส่วนคาร์บอนต่อไนโตรเจน (C:N Ratio & สารตัวเติม):
            </label>
            <input
              type="text"
              required
              value={carbonNitrogenRatio}
              onChange={(e) => setCarbonNitrogenRatio(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Expected Yield Preview */}
          <div className="bg-teal-950/40 border border-teal-500/30 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-teal-300">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>คาดการณ์ผลผลิตปุ๋ยอินทรีย์ (~20%):</span>
            </div>
            <span className="font-mono font-bold text-teal-300 text-sm">
              ~{expectedYield} กก.
            </span>
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
              {isSubmitting ? 'กำลังสร้างรอบหมัก...' : '✓ เริ่มรอบการหมักชีวภาพ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
