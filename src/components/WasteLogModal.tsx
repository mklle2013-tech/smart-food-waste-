import React, { useState } from 'react';
import {
  X,
  Leaf,
  Sparkles,
  MapPin,
  Scale,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import type { CompostBin, WasteCategory } from '../types';

interface WasteLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: WasteCategory;
    weightKg: number;
    moistureEstimate: number;
    sourceLocation: string;
    targetBinId?: string;
    notes?: string;
  }) => Promise<void>;
  bins: CompostBin[];
}

const CATEGORIES: { id: WasteCategory; label: string; desc: string; icon: string }[] = [
  { id: 'vegetable_fruit', label: 'ผักและผลไม้', desc: 'เปลือกส้ม แตงโม ผักสลัด ย่อยสลายง่าย', icon: '🥦' },
  { id: 'meat_protein', label: 'เนื้อสัตว์และโปรตีน', desc: 'เศษเนื้อ ปลา กระดูกอ่อน เพิ่มไนโตรเจนสูง', icon: '🥩' },
  { id: 'grains_bakery', label: 'ข้าว แป้ง เบเกอรี่', desc: 'ข้าวสวย ขนมปัง เพิ่มคาร์บอนปรับสมดุล C:N', icon: '🍞' },
  { id: 'coffee_eggshell', label: 'กากกาแฟ & เปลือกไข่', desc: 'แคลเซียมสูง ป้องกันแมลงและปรับโครงสร้างดิน', icon: '☕' },
  { id: 'mixed_scraps', label: 'เศษอาหารทั่วไปรวม', desc: 'เศษอาหารคละชนิด แยกบรรจุภัณฑ์ออกแล้ว', icon: '🍲' },
];

export const WasteLogModal: React.FC<WasteLogModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  bins,
}) => {
  const [category, setCategory] = useState<WasteCategory>('vegetable_fruit');
  const [weightKg, setWeightKg] = useState<number>(15.0);
  const [moistureEstimate, setMoistureEstimate] = useState<number>(55);
  const [sourceLocation, setSourceLocation] = useState<string>('โรงอาหารกลาง (Central Cafeteria)');
  const [targetBinId, setTargetBinId] = useState<string>(bins[0]?.id || 'bin-01');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const carbonOffset = (weightKg * 1.9).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (weightKg <= 0) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        category,
        weightKg: Number(weightKg),
        moistureEstimate: Number(moistureEstimate),
        sourceLocation,
        targetBinId,
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
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">บันทึกนำเข้าเศษอาหาร (Log Food Waste)</h3>
            <p className="text-xs text-slate-400">บันทึกน้ำหนักและประเภทเพื่อคำนวณการลดคาร์บอนและป้อนสู่ถังหมัก</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              ประเภทเศษอาหารที่คัดแยก:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    category === cat.id
                      ? 'bg-emerald-950/60 border-emerald-400 text-white shadow-sm'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xl shrink-0">{cat.icon}</span>
                  <div>
                    <div className="text-xs font-bold leading-tight">{cat.label}</div>
                    <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{cat.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Weight Input & Presets */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300 mb-1.5">
              <label>ปริมาณน้ำหนัก (กิโลกรัม):</label>
              <div className="flex gap-1.5">
                {[5, 10, 25, 50].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setWeightKg(preset)}
                    className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded border border-slate-700"
                  >
                    +{preset} กก.
                  </button>
                ))}
              </div>
            </div>
            <div className="relative">
              <Scale className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-12 py-2.5 text-white font-mono font-bold text-base focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">กก. (kg)</span>
            </div>
          </div>

          {/* Environmental Carbon Impact Preview */}
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>การลดก๊าซเรือนกระจกโดยประมาณ:</span>
            </div>
            <span className="font-mono font-bold text-emerald-300 text-sm">
              +{carbonOffset} kg CO₂e
            </span>
          </div>

          {/* Source Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              จุดคัดแยก / แหล่งกำเนิด (Source):
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={sourceLocation}
                onChange={(e) => setSourceLocation(e.target.value)}
                placeholder="เช่น โรงอาหารกลาง อาคาร 1, ร้านอาหารตามสั่ง, คาเฟ่"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Target Digester Unit */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              นำเข้าสู่เครื่องหมักเป้าหมาย:
            </label>
            <select
              value={targetBinId}
              onChange={(e) => setTargetBinId(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {bins.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} (ความจุเหลือ {Math.max(0, b.capacityKg - b.currentWeightKg).toFixed(1)} กก.)
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              หมายเหตุเพิ่มเติม (ถ้ามี):
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น บดละเอียดแล้ว, ปริมาณน้ำค่อนข้างสูง เติมกากกาแฟซับน้ำ..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 transition-all shadow-lg shadow-emerald-950/50"
            >
              {isSubmitting ? 'กำลังบันทึกลง Firebase...' : '✓ บันทึกลง Firebase'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
