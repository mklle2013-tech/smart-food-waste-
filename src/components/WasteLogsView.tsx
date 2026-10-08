import React, { useState } from 'react';
import {
  Leaf,
  Plus,
  Trash2,
  Search,
  Filter,
  Download,
  Calendar,
  MapPin,
  Flame,
  Info,
} from 'lucide-react';
import type { FoodWasteLog, WasteCategory } from '../types';

interface WasteLogsViewProps {
  logs: FoodWasteLog[];
  onOpenModal: () => void;
  onDeleteLog: (id: string) => Promise<void>;
  currentUserEmail?: string | null;
}

const CATEGORY_NAMES: Record<WasteCategory, { label: string; badge: string; icon: string }> = {
  vegetable_fruit: { label: 'ผักและผลไม้', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: '🥦' },
  meat_protein: { label: 'เนื้อสัตว์/โปรตีน', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30', icon: '🥩' },
  grains_bakery: { label: 'ข้าว/แป้ง/เบเกอรี่', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30', icon: '🍞' },
  coffee_eggshell: { label: 'กากกาแฟ/เปลือกไข่', badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30', icon: '☕' },
  mixed_scraps: { label: 'เศษอาหารทั่วไปรวม', badge: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: '🍲' },
};

export const WasteLogsView: React.FC<WasteLogsViewProps> = ({
  logs,
  onOpenModal,
  onDeleteLog,
  currentUserEmail,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesSearch =
      log.sourceLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.recordedByName && log.recordedByName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Category', 'Weight_KG', 'Source_Location', 'Target_Bin', 'Carbon_Offset_CO2e', 'Recorded_By', 'Notes'];
    const rows = filteredLogs.map((l) => [
      l.id,
      new Date(l.createdAt).toLocaleString('th-TH'),
      CATEGORY_NAMES[l.category]?.label || l.category,
      l.weightKg,
      `"${l.sourceLocation.replace(/"/g, '""')}"`,
      l.targetBinId || '-',
      l.carbonOffsetKg,
      `"${(l.recordedByName || l.recordedByEmail || '-').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `food_waste_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <span>ประวัติการนำเข้าและบันทึกเศษอาหาร (Food Waste Logs)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            บันทึกการคัดแยกเศษอาหารจากโรงอาหาร ร้านค้า และแหล่งกำเนิดเพื่อป้อนสู่ระบบถังหมัก
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>ส่งออก CSV</span>
          </button>
          <button
            onClick={onOpenModal}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-md shadow-emerald-950/40 border border-emerald-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>+ บันทึกเศษอาหารใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row items-center gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาจุดคัดแยก, แหล่งกำเนิด, หรือหมายเหตุ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <button
            onClick={() => setSelectedCategory('all')}
            className={`text-xs px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white font-medium'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            ทั้งหมด ({logs.length})
          </button>
          {Object.entries(CATEGORY_NAMES).map(([key, item]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`text-xs px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedCategory === key
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">วันที่ / เวลา</th>
                <th className="py-3.5 px-4">ประเภทเศษอาหาร</th>
                <th className="py-3.5 px-4">น้ำหนัก</th>
                <th className="py-3.5 px-4">แหล่งที่มา</th>
                <th className="py-3.5 px-4">ถังเป้าหมาย</th>
                <th className="py-3.5 px-4">ลดคาร์บอน (CO₂e)</th>
                <th className="py-3.5 px-4">ผู้บันทึก</th>
                <th className="py-3.5 px-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Leaf className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-500" />
                    <span>ไม่พบรายการบันทึกเศษอาหารตรงกับเงื่อนไข</span>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const cat = CATEGORY_NAMES[log.category] || {
                    label: log.category,
                    badge: 'bg-slate-700 text-slate-300',
                    icon: '📦',
                  };
                  return (
                    <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{new Date(log.createdAt).toLocaleDateString('th-TH')}</span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {new Date(log.createdAt).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${cat.badge}`}>
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-white">
                        <span className="text-base text-emerald-400 font-mono">{log.weightKg.toFixed(1)}</span>
                        <span className="text-xs text-slate-400 ml-1">กก.</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[160px]">{log.sourceLocation}</span>
                        </div>
                        {log.notes && (
                          <p className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5" title={log.notes}>
                            {log.notes}
                          </p>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {log.targetBinId ? (
                          <span className="bg-slate-800 text-emerald-300 px-2 py-0.5 rounded text-xs font-mono border border-slate-700">
                            {log.targetBinId}
                          </span>
                        ) : (
                          <span className="text-slate-500 text-xs">-</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="text-cyan-400 font-semibold font-mono">+{log.carbonOffsetKg.toFixed(2)}</span>
                        <span className="text-[11px] text-slate-500 ml-1">kg CO₂e</span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400">
                        <span className="text-slate-300">{log.recordedByName || 'เจ้าหน้าที่'}</span>
                        {log.recordedByEmail && (
                          <span className="block text-[10px] text-slate-500 truncate max-w-[120px]">
                            {log.recordedByEmail}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => {
                            if (window.confirm('คุณต้องการลบรายการบันทึกนี้ใช่หรือไม่?')) {
                              onDeleteLog(log.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="ลบรายการ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
