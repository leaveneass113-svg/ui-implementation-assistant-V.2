import React from 'react';
import { ReportData, WeekData } from '../types';
import { BarChart2, Info, ChevronLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { buildDailyWorkSummary, recalculateWeekProgress, toThaiDigits } from '../utils/weekUtils';
import { WeekSelectorBar } from './WeekSelectorBar';

interface Props {
  data: ReportData;
  onChange?: (updatedData: ReportData) => void;
  onAddWeek?: () => void;
  onDeleteWeek?: (index: number) => void;
  onAutoGenerateWeeks?: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
}

export const DocumentPage2: React.FC<Props> = ({
  data,
  onChange,
  onAddWeek,
  onDeleteWeek,
  onAutoGenerateWeeks,
  onNavigatePrev,
  onNavigateNext,
}) => {
  const weeks = data.weeks && data.weeks.length > 0 ? data.weeks : [];
  const activeIndex = Math.min(Math.max(0, data.activeWeekIndex ?? 0), Math.max(0, weeks.length - 1));
  const currentWeek: WeekData = weeks[activeIndex] || {
    id: 'w-default',
    weekNo: '๑',
    startDate: '',
    endDate: '',
    reportDate: '',
    remainingDays: '',
    dailyDates: ['', '', '', '', '', '', ''],
    dailyShortDates: ['', '', '', '', '', '', ''],
    dailyNarrative: ['', '', '', '', '', '', ''],
    dailyWeatherMorning: ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'],
    dailyWeatherAfternoon: ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'],
    laborRows: [],
    workProgress: {
      weight: 100,
      prevPercent: 0,
      thisWeek: 0,
      cumulative: 0,
      rowTotal: 0,
    },
  };

  const wp = currentWeek?.workProgress || {
    weight: 100,
    prevPercent: 0,
    thisWeek: 0,
    cumulative: 0,
    rowTotal: 0,
  };

  // WD calculation: auto-generate clean multi-line summary from dailyNarrative (without dates)
  const wdAutoText = buildDailyWorkSummary(currentWeek?.dailyNarrative || []);

  const handleSelectWeek = (idx: number) => {
    if (!onChange) return;
    onChange({ ...data, activeWeekIndex: idx });
  };

  const handleClearPage2 = () => {
    if (!window.confirm(`คุณต้องการล้างข้อมูลความก้าวหน้าในสัปดาห์ที่ ${toThaiDigits(currentWeek?.weekNo || activeIndex + 1)} ใช่หรือไม่?`)) {
      return;
    }
    if (!onChange) return;
    const updatedWeeks = weeks.map((w, idx) => {
      if (idx === activeIndex) {
        return {
          ...w,
          workProgress: {
            weight: 0,
            prevPercent: 0,
            thisWeek: 0,
            cumulative: 0,
            rowTotal: 0,
          },
        };
      }
      return w;
    });
    const recalculated = recalculateWeekProgress(updatedWeeks);
    onChange({ ...data, weeks: recalculated });
  };

  const handleUpdateProgressField = (field: 'weight' | 'thisWeek' | 'rowTotal', value: number) => {
    if (!onChange) return;

    const updatedWeeks = weeks.map((w, idx) => {
      if (idx === activeIndex) {
        const weightVal = (field === 'weight' || field === 'thisWeek') ? value : (w.workProgress?.weight ?? 0);
        // ในช่องของ "ในสัปดาห์นี้" ให้ใช้ค่าตัวเลขของ "สัดส่วนของ" เสมอ
        const thisW = weightVal;
        const rowTotalVal = field === 'rowTotal' ? value : (w.workProgress?.rowTotal ?? 0);

        return {
          ...w,
          workProgress: {
            ...w.workProgress,
            weight: weightVal,
            thisWeek: thisW,
            rowTotal: rowTotalVal,
          },
        };
      }
      return w;
    });

    // Recalculate carry-forward across all weeks sequentially
    const recalculated = recalculateWeekProgress(updatedWeeks);
    onChange({ ...data, weeks: recalculated });
  };

  const formatNum = (val: number | undefined | null) => {
    if (val === undefined || val === null || val === 0) return '-';
    return Number.isInteger(val) ? String(val) : String(Number(val.toFixed(2)));
  };

  return (
    <div className="space-y-6">
      {/* Week Selector Bar */}
      <WeekSelectorBar
        weeks={weeks}
        activeWeekIndex={activeIndex}
        onSelectWeek={handleSelectWeek}
        onAddWeek={onAddWeek || (() => {})}
        onDeleteWeek={onDeleteWeek || (() => {})}
        onAutoGenerateWeeks={onAutoGenerateWeeks || (() => {})}
      />

      {/* Screen View: Dark Neumorphism Form */}
      <div className="print:hidden space-y-6">
        {/* Table Card */}
        <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-4 mb-2 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                <BarChart2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm sm:text-base text-white tracking-wide flex items-center gap-2">
                  ผลการดำเนินงานสัปดาห์ {toThaiDigits(currentWeek?.weekNo || activeIndex + 1)}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  ตารางสรุปผลงานประจำสัปดาห์ (งานที่ดำเนินการดึงจากบันทึกรายวันอัตโนมัติ)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="hidden sm:flex items-center gap-2 text-xs text-orange-300 bg-orange-500/10 px-3.5 py-2 rounded-2xl border border-orange-500/20">
                <Info className="w-4 h-4 text-orange-400 shrink-0" />
                <span>คำนวณผลงานสะสมส่งต่อจากสัปดาห์ก่อนหน้าอัตโนมัติ</span>
              </div>

              {/* Clear Data Button */}
              <button
                type="button"
                onClick={handleClearPage2}
                className="px-3 py-2 neu-button text-rose-400 hover:text-rose-300 rounded-2xl text-xs font-bold border border-rose-500/20 hover:border-rose-500/40 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shrink-0 cursor-pointer"
                title="ล้างข้อมูลผลงานในสัปดาห์นี้"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>ล้างข้อมูล</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-[820px]">
              {/* Table Header without raw variable tags */}
              <div className="flex text-xs font-bold text-gray-400 text-center gap-2 mb-2 items-end">
                <div className="w-12 py-2.5 neu-pressed rounded-2xl border border-white/5 flex-shrink-0">
                  ที่
                </div>
                <div className="flex-1 py-2.5 neu-pressed rounded-2xl border border-white/5">
                  งานที่ดำเนินการ (ดึงจากบันทึกรายวันอัตโนมัติ)
                </div>
                <div className="w-24 py-2 neu-pressed rounded-2xl border border-white/5 flex-shrink-0 leading-tight">
                  สัดส่วนของ<br />งาน (%)
                </div>
                <div className="flex flex-col w-56 gap-1 flex-shrink-0">
                  <div className="py-1 neu-pressed rounded-2xl border border-white/5 text-[11px]">
                    ผลงาน (%)
                  </div>
                  <div className="flex gap-1 text-[11px]">
                    <div className="flex-1 py-1.5 neu-pressed rounded-2xl border border-white/5 leading-tight text-gray-400" title="คำนวณส่งต่อจากสัปดาห์ก่อนอัตโนมัติ">
                      ถึงสัปดาห์<br />ก่อน
                    </div>
                    <div className="flex-1 py-1.5 neu-pressed rounded-2xl border border-orange-500/30 text-orange-300 leading-tight">
                      ในสัปดาห์<br />นี้
                    </div>
                    <div className="flex-1 py-1.5 neu-pressed rounded-2xl border border-white/5 leading-tight text-emerald-300 font-bold" title="สะสม = ถึงสัปดาห์ก่อน + ในสัปดาห์นี้">
                      สะสม
                    </div>
                  </div>
                </div>
                <div className="w-24 py-2 neu-pressed rounded-2xl border border-white/5 flex-shrink-0 leading-tight">
                  ผลงานรวม<br />(%)
                </div>
              </div>

              {/* Single Data Row */}
              <div className="flex gap-2 items-start text-sm my-2.5">
                {/* ที่ - Week No */}
                <div className="w-12 h-14 flex items-center justify-center text-orange-400 font-bold flex-shrink-0 neu-pressed rounded-2xl border border-white/5 text-base">
                  {toThaiDigits(currentWeek?.weekNo || activeIndex + 1)}
                </div>

                {/* งานที่ดำเนินการ - Multi-line auto-generate preview box */}
                <div className="flex-1 rounded-2xl bg-[#141517] border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] px-4 py-2.5 text-xs text-gray-200 min-h-[56px] flex flex-col justify-start select-none">
                  {wdAutoText ? (
                    <div className="space-y-1.5 py-0.5">
                      {wdAutoText.split('\n').map((line, idx) => (
                        <div key={idx} className="leading-relaxed text-gray-200 flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0"></span>
                          <span className="text-gray-200">{line.replace(/^-\s*/, '')}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-zinc-500 italic text-xs py-2">
                      (ไม่ปฏิบัติงาน — หากต้องการระบุรายละเอียด ให้กรอกในแท็บบันทึกรายวัน)
                    </span>
                  )}
                </div>

                {/* สัดส่วนของงาน (%) - Input */}
                <div className="w-24 flex-shrink-0">
                  <input
                    type="number"
                    step="0.01"
                    value={wp.weight !== undefined && wp.weight !== 0 ? wp.weight : (wp.weight === 0 ? '' : 0)}
                    onChange={(e) => handleUpdateProgressField('weight', parseFloat(e.target.value) || 0)}
                    placeholder="100"
                    className="w-full h-14 text-center rounded-2xl bg-[#141517] text-slate-100 placeholder:text-zinc-500 text-sm outline-none border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] focus:border-orange-500/50 font-bold transition-all antialiased px-2"
                  />
                </div>

                {/* ผลงาน (%) 3 ช่อง (ถึงสัปดาห์ก่อน, ในสัปดาห์นี้, สะสม) */}
                <div className="flex w-56 gap-1 flex-shrink-0">
                  {/* ถึงสัปดาห์ก่อน - Auto Carry Display */}
                  <div className="flex-1 h-14 text-center text-gray-400 font-bold px-1 text-xs sm:text-sm flex flex-col items-center justify-center rounded-2xl bg-[#141517] border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)]">
                    <span className="text-gray-300">{formatNum(wp.prevPercent)}</span>
                    <span className="text-[9px] text-zinc-500 font-normal">อัตโนมัติ</span>
                  </div>

                  {/* ในสัปดาห์นี้ - Editable Input */}
                  <div className="flex-1">
                    <input
                      type="number"
                      step="0.01"
                      value={wp.thisWeek !== undefined && wp.thisWeek !== 0 ? wp.thisWeek : ''}
                      onChange={(e) => handleUpdateProgressField('thisWeek', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full h-14 text-center rounded-2xl bg-[#141517] border border-orange-500/40 bg-orange-500/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] px-1 text-orange-300 font-black text-sm focus:outline-none focus:border-orange-500 transition-all antialiased"
                    />
                  </div>

                  {/* สะสม - Auto Sum */}
                  <div className="flex-1 h-14 text-center text-emerald-400 font-black px-1 text-xs sm:text-sm flex flex-col items-center justify-center rounded-2xl bg-[#141517] border border-emerald-500/30 bg-emerald-500/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)]">
                    <span>{formatNum(wp.cumulative)}</span>
                    <span className="text-[9px] text-emerald-500 font-normal">รวมสะสม</span>
                  </div>
                </div>

                {/* ผลงานรวม (%) - Editable Input */}
                <div className="w-24 flex-shrink-0">
                  <input
                    type="number"
                    step="0.01"
                    value={wp.rowTotal !== undefined && wp.rowTotal !== 0 ? wp.rowTotal : ''}
                    onChange={(e) => handleUpdateProgressField('rowTotal', parseFloat(e.target.value) || 0)}
                    placeholder={String(wp.cumulative || 0)}
                    className="w-full h-14 text-center rounded-2xl bg-[#141517] text-slate-100 placeholder:text-zinc-500 text-sm outline-none border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] focus:border-orange-500/50 font-bold transition-all antialiased px-2"
                  />
                </div>
              </div>

              {/* Summary Row */}
              <div className="flex gap-2 items-center text-sm pt-4 border-t border-white/5">
                <div className="w-12 flex-shrink-0"></div>
                <div className="flex-1 text-right text-gray-400 text-xs font-semibold pr-2">
                  แถวสรุปผลงาน:
                </div>
                <div className="w-24 text-center text-gray-300 font-bold neu-pressed py-2.5 rounded-2xl border border-white/5 flex-shrink-0 text-sm">
                  {formatNum(wp.weight)}
                </div>
                <div className="w-56 text-center text-gray-300 font-bold neu-pressed py-2.5 rounded-2xl border border-white/5 flex-shrink-0 tracking-wider">
                  รวม
                </div>
                <div className="w-24 text-center text-gray-300 font-bold neu-pressed py-2.5 rounded-2xl border border-white/5 flex-shrink-0 text-sm">
                  {formatNum(wp.rowTotal || wp.cumulative)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 gap-3">
          {onNavigatePrev && (
            <button
              onClick={onNavigatePrev}
              className="neu-button px-4 py-2.5 rounded-2xl text-xs font-semibold text-gray-300 hover:text-white border border-white/5 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ย้อนกลับ: ข้อมูลสัญญา</span>
            </button>
          )}
          {onNavigateNext && (
            <button
              onClick={onNavigateNext}
              className="neu-orange-btn ml-auto px-5 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer hover:scale-[1.02]"
            >
              <span>ถัดไป: บันทึกรายวัน</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Print View: Document format conforming 100% to V2 Template1.docx */}
      <div className="hidden print:flex bg-white text-black p-8 sm:p-12 shadow-none font-sarabun max-w-[210mm] min-h-[297mm] mx-auto text-[15px] leading-relaxed relative flex-col justify-between select-text">
        <div>
          {/* Title */}
          <h2 className="text-base font-bold mb-3">ผลการดำเนินงานในสัปดาห์</h2>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-black text-center text-[13px] leading-tight">
              <thead>
                <tr className="bg-gray-50">
                  <th rowSpan={2} className="border border-black p-2 font-bold w-[6%]">
                    ที่
                  </th>
                  <th rowSpan={2} className="border border-black p-2 font-bold w-[42%] text-center">
                    งานที่ดำเนินการ
                  </th>
                  <th rowSpan={2} className="border border-black p-2 font-bold w-[12%]">
                    สัดส่วนของงาน%
                  </th>
                  <th colSpan={3} className="border border-black p-1.5 font-bold">
                    ผลงาน%
                  </th>
                  <th rowSpan={2} className="border border-black p-2 font-bold w-[12%]">
                    ผลงานรวม%
                  </th>
                </tr>
                <tr className="bg-gray-50 text-[12px]">
                  <th className="border border-black p-1.5 font-bold w-[12%] leading-normal">
                    ถึงสัปดาห์ก่อน
                  </th>
                  <th className="border border-black p-1.5 font-bold w-[12%] leading-normal">
                    ในสัปดาห์
                  </th>
                  <th className="border border-black p-1.5 font-bold w-[12%] leading-normal">
                    สะสม
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* 1 Main Weekly Task Row */}
                <tr className="min-h-[44px]">
                  <td className="border border-black p-2 align-top font-bold">
                    {toThaiDigits(currentWeek?.weekNo || '๑')}
                  </td>
                  <td className="border border-black p-2 align-top text-left font-medium whitespace-pre-line leading-relaxed">
                    {wdAutoText || 'ไม่ปฏิบัติงาน'}
                  </td>
                  <td className="border border-black p-2 align-top font-medium">
                    {formatNum(wp.weight)}
                  </td>
                  <td className="border border-black p-2 align-top font-medium">
                    {formatNum(wp.prevPercent)}
                  </td>
                  <td className="border border-black p-2 align-top font-medium">
                    {formatNum(wp.thisWeek)}
                  </td>
                  <td className="border border-black p-2 align-top font-medium">
                    {formatNum(wp.cumulative)}
                  </td>
                  <td className="border border-black p-2 align-top font-medium">
                    {formatNum(wp.rowTotal || wp.cumulative)}
                  </td>
                </tr>

                {/* Summary Total Row */}
                <tr className="font-bold bg-gray-50 h-9">
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2"></td>
                  <td className="border border-black p-2">
                    {formatNum(wp.weight)}
                  </td>
                  <td colSpan={3} className="border border-black p-2 text-center font-bold">
                    รวม
                  </td>
                  <td className="border border-black p-2">
                    {formatNum(wp.rowTotal || wp.cumulative)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
