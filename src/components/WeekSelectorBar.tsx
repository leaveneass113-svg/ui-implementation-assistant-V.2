import React from 'react';
import { WeekData } from '../types';
import { Plus, Trash2, Wand2, Layers, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { toThaiDigits } from '../utils/weekUtils';

interface Props {
  weeks: WeekData[];
  activeWeekIndex: number;
  onSelectWeek: (index: number) => void;
  onAddWeek: () => void;
  onDeleteWeek: (index: number) => void;
  onAutoGenerateWeeks: () => void;
}

export const WeekSelectorBar: React.FC<Props> = ({
  weeks,
  activeWeekIndex,
  onSelectWeek,
  onAddWeek,
  onDeleteWeek,
  onAutoGenerateWeeks,
}) => {
  const currentWeek = weeks[activeWeekIndex] || weeks[0];

  return (
    <div className="neu-flat p-4 sm:p-5 rounded-3xl border border-white/5 space-y-4 print:hidden">
      {/* Row 1: Dropdown Selector, Prev/Next buttons & Quick Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        
        {/* Left: Dropdown Selector with Prev/Next */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>

          <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
            {/* Prev Week Button */}
            <button
              type="button"
              disabled={activeWeekIndex === 0}
              onClick={() => onSelectWeek(Math.max(0, activeWeekIndex - 1))}
              className="p-2.5 rounded-2xl neu-button text-gray-300 hover:text-orange-400 disabled:opacity-25 disabled:cursor-not-allowed border border-white/5 shrink-0 transition-all active:scale-95 cursor-pointer"
              title="สัปดาห์ก่อนหน้า"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dropdown Select for Weeks */}
            <div className="relative flex-1 min-w-[220px] sm:min-w-[320px] max-w-lg">
              <select
                id="select_active_week_selector_bar"
                value={activeWeekIndex}
                onChange={(e) => onSelectWeek(Number(e.target.value))}
                className="w-full appearance-none px-4 py-2.5 pr-10 rounded-2xl bg-[#141517] text-orange-400 font-bold text-sm sm:text-base border border-orange-500/30 outline-none shadow-[inset_2px_2px_6px_#0a0b0c,inset_-2px_-2px_6px_rgba(255,255,255,0.02)] focus:border-orange-500 cursor-pointer transition-all hover:border-orange-500/50 truncate"
              >
                {weeks.map((w, idx) => {
                  const cum = w.workProgress?.cumulative ?? 0;
                  return (
                    <option key={w.id || idx} value={idx} className="bg-[#181818] text-white py-1">
                      สัปดาห์ที่ {toThaiDigits(w.weekNo || idx + 1)} {w.startDate ? `(${w.startDate} ถึง ${w.endDate})` : ''} {cum > 0 ? `[สะสม ${toThaiDigits(cum)}%]` : ''}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-orange-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Next Week Button */}
            <button
              type="button"
              disabled={activeWeekIndex >= weeks.length - 1}
              onClick={() => onSelectWeek(Math.min(weeks.length - 1, activeWeekIndex + 1))}
              className="p-2.5 rounded-2xl neu-button text-gray-300 hover:text-orange-400 disabled:opacity-25 disabled:cursor-not-allowed border border-white/5 shrink-0 transition-all active:scale-95 cursor-pointer"
              title="สัปดาห์ถัดไป"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Action Buttons & Progress Badge */}
        <div className="flex items-center gap-2 flex-wrap justify-between lg:justify-end shrink-0">
          <span className="text-[11px] sm:text-xs px-3 py-2 rounded-2xl neu-pressed text-orange-400 font-bold border border-orange-500/30">
            สะสม: {toThaiDigits(currentWeek?.workProgress?.cumulative ?? 0)}%
          </span>

          <button
            type="button"
            onClick={onAutoGenerateWeeks}
            className="neu-button px-3 py-2 rounded-2xl text-xs font-semibold text-orange-300 hover:text-orange-200 border border-orange-500/20 flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            title="คำนวณแบ่งรอบสัปดาห์ วันที่เริ่มต้น/สิ้นสุด และวันรายงานอัตโนมัติตามช่วงสัญญา"
          >
            <Wand2 className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">สร้างทุกสัปดาห์ตามสัญญา</span>
            <span className="sm:hidden">สร้างอัตโนมัติ</span>
          </button>

          <button
            type="button"
            onClick={onAddWeek}
            className="neu-orange-btn px-3.5 py-2 rounded-2xl text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
            title="เพิ่มสัปดาห์ถัดไป"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ เพิ่มสัปดาห์</span>
          </button>

          {weeks.length > 1 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`ยืนยันการลบสัปดาห์ที่ ${currentWeek?.weekNo || ''} หรือไม่?`)) {
                  onDeleteWeek(activeWeekIndex);
                }
              }}
              className="p-2.5 rounded-2xl neu-button text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-all active:scale-95 cursor-pointer"
              title="ลบสัปดาห์ปัจจุบัน"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

