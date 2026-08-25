import React from 'react';
import { ReportData, MonthlyProgressEntry } from '../types';
import { resetPage6Data } from '../utils/pageResetHelpers';
import { ClearPageButton } from './ClearPageButton';
import {
  CalendarDays,
  Plus,
  Trash2,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  ArrowRight,
} from 'lucide-react';
import { toThaiDigits } from '../utils/weekUtils';

interface Props {
  data: ReportData;
  onChange?: (updatedData: ReportData) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
}

export const DocumentPage6MonthlyLog: React.FC<Props> = ({
  data,
  onChange,
  onNavigatePrev,
  onNavigateNext,
}) => {
  const currentLogs: MonthlyProgressEntry[] =
    data.monthlyProgressLogs && data.monthlyProgressLogs.length > 0
      ? data.monthlyProgressLogs
      : [
          {
            id: 'm-1',
            monthName: 'กรกฎาคม พ.ศ. ๒๕๖๙',
            activitiesText: '- เตรียมพื้นที่และปรับระดับคันทางเดิม\n- ลงหินคลุกและบดอัดแน่น',
            weightPct: 45,
            prevMonthPct: 0,
            inMonthPct: 45,
            accumulatedPct: 45,
            totalWorkPct: 45,
          },
          {
            id: 'm-2',
            monthName: 'สิงหาคม พ.ศ. ๒๕๖๙',
            activitiesText: '- เทคอนกรีตผิวจราจร คอร. หนา 0.15 ม.\n- ถมไหล่ทางหินคลุกข้างละ 0.20 ม. และเก็บกวาดทำความสะอาด',
            weightPct: 55,
            prevMonthPct: 45,
            inMonthPct: 55,
            accumulatedPct: 100,
            totalWorkPct: 100,
          },
        ];

  const handleClearPage6 = () => {
    if (onChange) {
      onChange(resetPage6Data(data));
    }
  };

  const recalculateLogs = (logs: MonthlyProgressEntry[]): MonthlyProgressEntry[] => {
    let runningAccumulated = 0;
    return logs.map((item) => {
      const weightVal = Number(item.weightPct) || 0;
      const prevVal = runningAccumulated;
      const inMonthVal = weightVal;
      const accVal = Number((prevVal + inMonthVal).toFixed(2));
      const totalWorkVal = accVal;
      runningAccumulated = accVal;

      return {
        ...item,
        prevMonthPct: prevVal,
        inMonthPct: inMonthVal,
        accumulatedPct: accVal,
        totalWorkPct: totalWorkVal,
      };
    });
  };

  const handleEntryChange = (idx: number, field: keyof MonthlyProgressEntry, value: any) => {
    if (!onChange) return;
    const updated = currentLogs.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: value };
      }
      return item;
    });
    const recalculated = recalculateLogs(updated);
    onChange({ ...data, monthlyProgressLogs: recalculated });
  };

  const handleAddMonth = () => {
    if (!onChange) return;
    const newMonthNo = currentLogs.length + 1;
    const newEntry: MonthlyProgressEntry = {
      id: `m-${Date.now()}`,
      monthName: `เดือนที่ ${toThaiDigits(newMonthNo)}`,
      activitiesText: '',
      weightPct: 0,
      prevMonthPct: 0,
      inMonthPct: 0,
      accumulatedPct: 0,
      totalWorkPct: 0,
    };
    const recalculated = recalculateLogs([...currentLogs, newEntry]);
    onChange({ ...data, monthlyProgressLogs: recalculated });
  };

  const handleDeleteMonth = (idx: number) => {
    if (!onChange) return;
    if (currentLogs.length <= 1) {
      alert('ต้องมีอย่างน้อย 1 แถวรายการ');
      return;
    }
    const updated = currentLogs.filter((_, i) => i !== idx);
    const recalculated = recalculateLogs(updated);
    onChange({ ...data, monthlyProgressLogs: recalculated });
  };

  const totalWeight = Number(
    currentLogs.reduce((sum, item) => sum + (Number(item.weightPct) || 0), 0).toFixed(2)
  );
  const grandTotalWork = currentLogs.length > 0
    ? currentLogs[currentLogs.length - 1].totalWorkPct || 0
    : 0;

  return (
    <div id="page-6-monthly-log" className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Clear Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                ตารางผลการดำเนินงานสะสมรายเดือน (หน้า ๖)
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full neu-pressed text-orange-400 font-bold border border-orange-500/30">
                Monthly Progress Log
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              ติดตามสัดส่วนงาน ผลงานสะสมต่อเนื่อง และส่งต่อสะสมอัตโนมัติ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddMonth}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1.5 hover:bg-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + เพิ่มแถวเดือน
          </button>
          <ClearPageButton pageNumber={6} onClear={handleClearPage6} />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>ตารางผลการดำเนินงานสะสมต่อเนื่องรายเดือน</span>
          </div>

          <div className="text-xs text-slate-300 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>คำนวณสะสมส่งต่ออัตโนมัติ</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[840px] space-y-2">
            {/* Table Header */}
            <div className="flex text-xs font-bold text-gray-400 text-center gap-2 mb-2 items-end">
              <div className="w-12 py-2.5 neu-pressed rounded-xl border border-white/5 flex-shrink-0">
                ที่
              </div>
              <div className="flex-1 py-2.5 neu-pressed rounded-xl border border-white/5">
                งานที่ดำเนินการ (ประจำเดือน)
              </div>
              <div className="w-24 py-2 neu-pressed rounded-xl border border-orange-500/30 text-orange-400 flex-shrink-0 leading-tight">
                สัดส่วนงาน<br />%
              </div>
              <div className="flex flex-col w-64 gap-1 flex-shrink-0">
                <div className="py-1 neu-pressed rounded-xl border border-white/5 text-[11px]">
                  ผลงาน (%)
                </div>
                <div className="flex gap-1 text-[11px]">
                  <div className="flex-1 py-1 neu-pressed rounded-xl border border-white/5 text-gray-400 leading-tight">
                    ถึงเดือนก่อน
                  </div>
                  <div className="flex-1 py-1 neu-pressed rounded-xl border border-orange-500/30 text-orange-300 leading-tight">
                    ในเดือนนี้
                  </div>
                  <div className="flex-1 py-1 neu-pressed rounded-xl border border-white/5 text-emerald-400 font-bold leading-tight">
                    สะสม
                  </div>
                </div>
              </div>
              <div className="w-24 py-2 neu-pressed rounded-xl border border-emerald-500/30 text-emerald-400 font-bold flex-shrink-0 leading-tight">
                ผลงานรวม<br />%
              </div>
              <div className="w-10 py-2.5 neu-pressed rounded-xl border border-white/5 flex-shrink-0">
                ลบ
              </div>
            </div>

            {/* Table Rows */}
            {currentLogs.map((item, idx) => (
              <div key={item.id || idx} className="flex gap-2 items-start text-xs sm:text-sm">
                {/* 1. ลำดับที่ */}
                <div className="w-12 h-14 flex items-center justify-center text-orange-400 font-bold flex-shrink-0 neu-pressed rounded-xl border border-white/5 select-none text-base">
                  {toThaiDigits(idx + 1)}
                </div>

                {/* 2. งานที่ดำเนินการ */}
                <div className="flex-1 rounded-xl bg-[#141517] border border-white/5 p-2.5 space-y-1.5 shadow-inner">
                  <input
                    type="text"
                    value={item.monthName || ''}
                    onChange={(e) => handleEntryChange(idx, 'monthName', e.target.value)}
                    placeholder="เช่น กรกฎาคม พ.ศ. ๒๕๖๙"
                    className="w-full bg-transparent text-xs font-bold text-orange-300 outline-none placeholder:text-gray-600"
                  />
                  <textarea
                    rows={2}
                    value={item.activitiesText || ''}
                    onChange={(e) => handleEntryChange(idx, 'activitiesText', e.target.value)}
                    placeholder="ระบุรายละเอียดงานที่ดำเนินการในเดือนนี้..."
                    className="w-full bg-transparent text-[11px] text-gray-300 outline-none resize-none leading-relaxed placeholder:text-gray-600"
                  />
                </div>

                {/* 3. สัดส่วนของงาน % */}
                <div className="w-24 h-14 flex-shrink-0">
                  <input
                    type="number"
                    step="0.01"
                    value={item.weightPct !== undefined && item.weightPct !== 0 ? item.weightPct : (item.weightPct === 0 ? '' : '')}
                    onChange={(e) => handleEntryChange(idx, 'weightPct', parseFloat(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full h-full text-center rounded-xl bg-[#141517] border border-orange-500/40 bg-orange-500/5 px-1 text-white font-bold text-sm outline-none focus:border-orange-500 transition-all shadow-inner"
                  />
                </div>

                {/* 4-6. ผลงาน 3 ช่อง */}
                <div className="w-64 h-14 flex gap-1 flex-shrink-0 select-none">
                  {/* ถึงเดือนก่อน */}
                  <div className="flex-1 h-full flex flex-col items-center justify-center text-xs text-gray-400 font-semibold rounded-xl bg-[#141517] border border-white/5 shadow-inner">
                    <span>{toThaiDigits(item.prevMonthPct || 0)}</span>
                    <span className="text-[9px] text-zinc-500">สะสมก่อน</span>
                  </div>

                  {/* ในเดือนนี้ */}
                  <div className="flex-1 h-full flex flex-col items-center justify-center text-xs text-orange-300 font-bold rounded-xl bg-[#141517] border border-orange-500/30 bg-orange-500/5 shadow-inner">
                    <span>{toThaiDigits(item.inMonthPct || 0)}</span>
                    <span className="text-[9px] text-orange-400">เดือนนี้</span>
                  </div>

                  {/* สะสม */}
                  <div className="flex-1 h-full flex flex-col items-center justify-center text-xs text-emerald-400 font-bold rounded-xl bg-[#141517] border border-emerald-500/30 bg-emerald-500/5 shadow-inner">
                    <span>{toThaiDigits(item.accumulatedPct || 0)}</span>
                    <span className="text-[9px] text-emerald-500">รวมสะสม</span>
                  </div>
                </div>

                {/* 7. ผลงานรวม % */}
                <div className="w-24 h-14 flex items-center justify-center flex-shrink-0 text-emerald-400 font-black text-sm rounded-xl bg-[#141517] border border-emerald-500/20 bg-emerald-500/5 shadow-inner select-none">
                  {toThaiDigits(item.totalWorkPct || 0)}%
                </div>

                {/* 8. ปุ่มลบ */}
                <div className="w-10 h-14 flex flex-shrink-0 items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteMonth(idx)}
                    className="w-8 h-8 rounded-xl neu-button flex items-center justify-center text-rose-400 hover:text-rose-300 border border-white/5 hover:border-rose-500/30 transition-colors cursor-pointer"
                    title="ลบแถวนี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Table Footer Total */}
            <div className="flex gap-2 items-center text-xs sm:text-sm font-bold pt-4 pb-2 border-t-2 border-white/10 select-none">
              <div className="w-12 flex-shrink-0"></div>
              <div className="flex-1 text-right text-gray-300 pr-4">รวมยอดสุทธิ:</div>
              <div className={`w-24 h-12 flex items-center justify-center rounded-xl bg-[#141517] border border-orange-500/30 font-black flex-shrink-0 text-sm ${totalWeight === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {toThaiDigits(totalWeight)}%
              </div>
              <div className="w-64 flex-shrink-0 text-right pr-2 text-gray-400 text-xs">
                ผลงานสะสมรวมทั้งสิ้น:
              </div>
              <div className="w-24 h-12 flex items-center justify-center text-emerald-400 rounded-xl bg-[#141517] border border-emerald-500/30 font-black flex-shrink-0 text-base">
                {toThaiDigits(grandTotalWork)}%
              </div>
              <div className="w-10 flex-shrink-0"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        {onNavigatePrev && (
          <button
            type="button"
            onClick={onNavigatePrev}
            className="px-4 py-2.5 rounded-2xl neu-button text-gray-300 hover:text-white text-xs font-bold flex items-center gap-2 border border-white/5 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ย้อนกลับ: รายละเอียดโครงการ (หน้า ๕)</span>
          </button>
        )}

        {onNavigateNext && (
          <button
            type="button"
            onClick={onNavigateNext}
            className="px-5 py-2.5 rounded-2xl neu-orange-btn text-white text-xs font-bold flex items-center gap-2 active:scale-95 shadow-md transition-all cursor-pointer ml-auto"
          >
            <span>ถัดไป: งวดงานและวัสดุ (หน้า ๗)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
