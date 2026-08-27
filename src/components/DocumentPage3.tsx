import React from 'react';
import { ReportData, WeekData, LaborRow } from '../types';
import { Calendar, Users, Plus, Trash2, ChevronLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { WeatherSelector } from './WeatherSelector';
import { WeekSelectorBar } from './WeekSelectorBar';
import { toThaiDigits } from '../utils/weekUtils';

interface Props {
  data: ReportData;
  onChange?: (updatedData: ReportData) => void;
  onAddWeek?: () => void;
  onDeleteWeek?: (index: number) => void;
  onAutoGenerateWeeks?: () => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
}

export const DocumentPage3: React.FC<Props> = ({
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

  const handleSelectWeek = (idx: number) => {
    if (!onChange) return;
    onChange({ ...data, activeWeekIndex: idx });
  };

  const updateCurrentWeek = (mutator: (week: WeekData) => WeekData) => {
    if (!onChange) return;
    const updatedWeeks = weeks.map((w, idx) => (idx === activeIndex ? mutator(w) : w));
    onChange({ ...data, weeks: updatedWeeks });
  };

  const handleClearPage3 = () => {
    if (!window.confirm(`คุณต้องการล้างข้อมูลบันทึกรายวัน (สัปดาห์ที่ ${toThaiDigits(currentWeek?.weekNo || activeIndex + 1)}) ใช่หรือไม่?`)) {
      return;
    }
    updateCurrentWeek((w) => ({
      ...w,
      dailyNarrative: ['', '', '', '', '', '', ''],
      dailyWeatherMorning: ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'],
      dailyWeatherAfternoon: ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'],
      laborRows: [],
      problemAndObstacle: '',
      guidelinesAndResolutions: '',
      documentNumber: '',
    }));
  };

  // Update Daily Log field (narrative, weather, date)
  const handleUpdateDailyNarrative = (dayIndex: number, text: string) => {
    updateCurrentWeek((w) => {
      const newNarrative = Array.isArray(w.dailyNarrative) ? [...w.dailyNarrative] : ['', '', '', '', '', '', ''];
      newNarrative[dayIndex] = text;
      return { ...w, dailyNarrative: newNarrative };
    });
  };

  const handleUpdateDailyDate = (dayIndex: number, dateStr: string) => {
    updateCurrentWeek((w) => {
      const newDates = Array.isArray(w.dailyDates) ? [...w.dailyDates] : ['', '', '', '', '', '', ''];
      newDates[dayIndex] = toThaiDigits(dateStr);
      return { ...w, dailyDates: newDates };
    });
  };

  const handleUpdateDailyShortDate = (dayIndex: number, shortDateStr: string) => {
    updateCurrentWeek((w) => {
      const newShortDates = Array.isArray(w.dailyShortDates) ? [...w.dailyShortDates] : ['', '', '', '', '', '', ''];
      newShortDates[dayIndex] = toThaiDigits(shortDateStr);
      return { ...w, dailyShortDates: newShortDates };
    });
  };

  const handleUpdateWeather = (dayIndex: number, type: 'morning' | 'afternoon', val: string) => {
    updateCurrentWeek((w) => {
      if (type === 'morning') {
        const morning = Array.isArray(w.dailyWeatherMorning) ? [...w.dailyWeatherMorning] : ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'];
        morning[dayIndex] = val;
        return { ...w, dailyWeatherMorning: morning };
      } else {
        const afternoon = Array.isArray(w.dailyWeatherAfternoon) ? [...w.dailyWeatherAfternoon] : ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'];
        afternoon[dayIndex] = val;
        return { ...w, dailyWeatherAfternoon: afternoon };
      }
    });
  };

  // Labor Rows Management
  const handleAddLaborRow = () => {
    updateCurrentWeek((w) => {
      const newRow: LaborRow = {
        id: `labor-${Date.now()}`,
        category: '',
        counts: [0, 0, 0, 0, 0, 0, 0],
      };
      return {
        ...w,
        laborRows: [...(w.laborRows || []), newRow],
      };
    });
  };

  const handleUpdateLaborRow = (
    rowId: string,
    field: 'category' | 'counts',
    val: any,
    dayIndex?: number
  ) => {
    updateCurrentWeek((w) => {
      const updatedRows = (w.laborRows || []).map((row) => {
        if (row.id === rowId) {
          if (field === 'counts' && typeof dayIndex === 'number') {
            const newCounts = Array.isArray(row.counts) ? [...row.counts] : [0, 0, 0, 0, 0, 0, 0];
            newCounts[dayIndex] = val;
            return { ...row, counts: newCounts };
          }
          return { ...row, [field]: val };
        }
        return row;
      });
      return { ...w, laborRows: updatedRows };
    });
  };

  const handleDeleteLaborRow = (rowId: string) => {
    updateCurrentWeek((w) => ({
      ...w,
      laborRows: (w.laborRows || []).filter((r) => r.id !== rowId),
    }));
  };

  const handleClearAllLaborCounts = () => {
    updateCurrentWeek((w) => ({
      ...w,
      laborRows: (w.laborRows || []).map((r) => ({
        ...r,
        counts: [0, 0, 0, 0, 0, 0, 0],
      })),
    }));
  };

  const labors = currentWeek?.laborRows || [];

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
        {/* Table 1 Card: Daily Log Details & Weather */}
        <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
          <div className="flex flex-wrap items-center justify-between border-b border-white/5 pb-4 mb-2 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm sm:text-base text-orange-400 tracking-wide">
                  บันทึกรายวัน (สัปดาห์ที่ {toThaiDigits(currentWeek?.weekNo || activeIndex + 1)} — ตาราง ๗ วันคงที่)
                </h2>
                <p className="text-xs text-gray-400">
                  ระบุรายละเอียดการปฏิบัติงานประจำวัน (ข้อความจะถูกนำไปรวมในหน้าผลงานประจำสัปดาห์อัตโนมัติ)
                </p>
              </div>
            </div>

            {/* Clear Data Button */}
            <button
              type="button"
              onClick={handleClearPage3}
              className="px-3 py-2 neu-button text-rose-400 hover:text-rose-300 rounded-2xl text-xs font-bold border border-rose-500/20 hover:border-rose-500/40 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shrink-0 cursor-pointer"
              title="ล้างข้อมูลบันทึกรายวันในสัปดาห์นี้"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
              <span>ล้างข้อมูล</span>
            </button>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-[760px]">
              {/* Header without raw tags */}
              <div className="flex text-xs font-bold text-gray-400 text-center gap-2 mb-2 items-end">
                <div className="w-14 py-2.5 neu-pressed rounded-2xl border border-white/5 flex-shrink-0">
                  วัน
                </div>
                <div className="w-48 py-2.5 neu-pressed rounded-2xl border border-white/5 flex-shrink-0">
                  วัน / เดือน / ปี
                </div>
                <div className="flex-1 py-2.5 neu-pressed rounded-2xl border border-white/5 min-w-0">
                  รายละเอียดการดำเนินงาน
                </div>
                <div className="w-32 py-2.5 neu-pressed rounded-2xl border border-white/5 flex-shrink-0">
                  สภาพอากาศ (เช้า)
                </div>
                <div className="w-32 py-2.5 neu-pressed rounded-2xl border border-white/5 flex-shrink-0">
                  สภาพอากาศ (บ่าย)
                </div>
              </div>

              {/* 7 Days Rows */}
              <div className="space-y-2.5">
                {Array.from({ length: 7 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateVal = currentWeek?.dailyDates?.[idx] || '';
                  const descVal = currentWeek?.dailyNarrative?.[idx] || '';
                  const weatherM = currentWeek?.dailyWeatherMorning?.[idx] || 'แจ่มใส';
                  const weatherA = currentWeek?.dailyWeatherAfternoon?.[idx] || 'แจ่มใส';

                  return (
                    <div key={`day-${idx}`} className="flex gap-2 items-center text-sm">
                      {/* Day Number */}
                      <div className="w-14 h-11 flex items-center justify-center font-bold text-orange-400 text-xs neu-pressed rounded-2xl border border-white/5 flex-shrink-0">
                        วัน {toThaiDigits(dayNum)}
                      </div>

                      {/* Date Full String */}
                      <div className="w-48 flex-shrink-0">
                        <input
                          type="text"
                          value={dateVal}
                          onChange={(e) => handleUpdateDailyDate(idx, e.target.value)}
                          placeholder="เช่น ๓๐ มิถุนายน ๒๕๖๙"
                          className="w-full h-11 px-3.5 rounded-2xl bg-[#141517] text-slate-100 placeholder:text-zinc-500 placeholder:font-light text-xs font-bold outline-none border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] focus:border-orange-500/50 transition-all antialiased"
                        />
                      </div>

                      {/* Daily Narrative Details */}
                      <div className="flex-1 flex min-w-0">
                        <input
                          type="text"
                          value={descVal}
                          onChange={(e) => handleUpdateDailyNarrative(idx, e.target.value)}
                          placeholder="ระบุการปฏิบัติงาน หรือ ปล่อยว่าง (ไม่ปฏิบัติงาน)..."
                          className="w-full h-11 px-4 rounded-2xl bg-[#141517] text-slate-100 placeholder:text-zinc-500 placeholder:font-light text-xs sm:text-sm outline-none border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] focus:border-orange-500/50 transition-all antialiased"
                        />
                      </div>

                      {/* Morning Weather */}
                      <div className="w-32 flex-shrink-0">
                        <WeatherSelector
                          value={weatherM}
                          onChange={(val) => handleUpdateWeather(idx, 'morning', val)}
                        />
                      </div>

                      {/* Afternoon Weather */}
                      <div className="w-32 flex-shrink-0">
                        <WeatherSelector
                          value={weatherA}
                          onChange={(val) => handleUpdateWeather(idx, 'afternoon', val)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Table 2 Card: Labor and Machinery Account */}
        <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
          <div className="flex flex-wrap items-center justify-between mb-4 border-b border-white/5 pb-4 gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm sm:text-base text-orange-400 tracking-wide">
                  บัญชีแสดงจำนวนแรงงานและเครื่องจักร
                </h2>
                <p className="text-xs text-gray-400">
                  เพิ่ม/ลบประเภทแรงงานได้ตามต้องการ (ระบบจะคำนวณผลรวมรายวันอัตโนมัติ)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearAllLaborCounts}
                className="neu-button px-3.5 py-2 rounded-2xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 flex items-center gap-1.5 border border-red-500/20 transition-all cursor-pointer active:scale-95"
                title="ล้างตัวเลขแรงงานทั้งหมดของสัปดาห์นี้"
              >
                <Trash2 className="w-3.5 h-3.5" /> ล้างตัวเลข
              </button>
              <button
                type="button"
                onClick={handleAddLaborRow}
                className="neu-orange-btn px-4 py-2 rounded-2xl text-xs font-bold text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> + เพิ่มประเภทแรงงาน
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pb-4">
            <div className="min-w-[840px]">
              {/* Header Row */}
              <div className="flex text-xs font-bold gap-2 mb-3 items-center">
                <div className="w-56 py-2.5 px-3 neu-pressed rounded-2xl border border-orange-500/30 bg-orange-500/10 text-orange-400 font-bold text-center flex-shrink-0">
                  ประเภทแรงงาน / เครื่องจักร
                </div>
                {Array.from({ length: 7 }).map((_, idx) => {
                  const shortDate = currentWeek?.dailyShortDates?.[idx] || '';
                  return (
                    <div key={`head-sd-${idx}`} className="flex-1 min-w-[76px]">
                      <input
                        type="text"
                        value={shortDate}
                        onChange={(e) => handleUpdateDailyShortDate(idx, e.target.value)}
                        placeholder="ว/ด/ป ย่อ"
                        className="w-full text-center py-2 px-1 rounded-2xl bg-[#141517] text-orange-300 placeholder:text-zinc-500 placeholder:font-light font-bold text-xs outline-none border border-white/10 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] focus:border-orange-500/50 transition-all antialiased"
                      />
                    </div>
                  );
                })}
                <div className="w-10 flex-shrink-0"></div>
              </div>

              {/* Labor Rows */}
              <div className="space-y-2">
                {labors.length === 0 ? (
                  <div className="text-center py-6 text-zinc-500 text-xs neu-pressed rounded-2xl border border-white/5">
                    ยังไม่มีรายการแรงงาน (กดปุ่ม "+ เพิ่มประเภทแรงงาน" ด้านบนเพื่อเพิ่มรายการ)
                  </div>
                ) : (
                  labors.map((row) => (
                    <div key={row.id} className="flex gap-2 items-center text-xs">
                      {/* Category Input */}
                      <input
                        type="text"
                        value={row.category || ''}
                        onChange={(e) => handleUpdateLaborRow(row.id, 'category', e.target.value)}
                        placeholder="เช่น หัวหน้าคนงาน, ช่างไม้, กรรมกร..."
                        className="w-56 flex-shrink-0 h-10 px-3.5 rounded-2xl bg-[#141517] text-slate-100 placeholder:text-zinc-500 placeholder:font-light text-xs font-medium outline-none border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] focus:border-orange-500/50 transition-all antialiased"
                      />

                      {/* 7 Days Counts */}
                      {Array.from({ length: 7 }).map((_, dIdx) => (
                        <input
                          key={`count-${row.id}-${dIdx}`}
                          type="number"
                          min="0"
                          value={row.counts && row.counts[dIdx] > 0 ? row.counts[dIdx] : ''}
                          onChange={(e) =>
                            handleUpdateLaborRow(
                              row.id,
                              'counts',
                              parseInt(e.target.value, 10) || 0,
                              dIdx
                            )
                          }
                          placeholder="-"
                          className="flex-1 min-w-[76px] h-10 text-center rounded-2xl bg-[#141517] text-slate-100 placeholder:text-zinc-500 text-sm outline-none border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] focus:border-orange-500/50 font-bold transition-all antialiased px-1"
                        />
                      ))}

                      {/* Delete Row Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteLaborRow(row.id)}
                        className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 neu-pressed rounded-2xl border border-red-500/20 transition-all flex-shrink-0 cursor-pointer active:scale-95"
                        title="ลบรายการแรงงานนี้"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Total Row */}
              {labors.length > 0 && (
                <div className="flex gap-2 items-center text-xs font-bold pt-3 mt-3 border-t border-white/5">
                  <div className="w-56 text-right pr-3 text-orange-400 font-bold">
                    รวมจำนวนแรงงานรายวัน:
                  </div>
                  {Array.from({ length: 7 }).map((_, dIdx) => {
                    const total = labors.reduce(
                      (sum, r) => sum + (r.counts && r.counts[dIdx] ? r.counts[dIdx] : 0),
                      0
                    );
                    return (
                      <div
                        key={`total-labor-${dIdx}`}
                        className="flex-1 min-w-[76px] h-9 flex items-center justify-center neu-pressed rounded-2xl border border-orange-500/30 text-orange-300 font-black text-sm bg-orange-500/5"
                      >
                        {total > 0 ? toThaiDigits(total) : '-'}
                      </div>
                    );
                  })}
                  <div className="w-10 flex-shrink-0"></div>
                </div>
              )}
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
              <span>ย้อนกลับ: บันทึกสัปดาห์ (หน้า ๒)</span>
            </button>
          )}
          {onNavigateNext && (
            <button
              onClick={onNavigateNext}
              className="neu-orange-btn ml-auto px-5 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer hover:scale-[1.02]"
            >
              <span>ถัดไป: ดาวน์โหลด / พิมพ์ (หน้า ๔)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Print View: Document format conforming 100% to V2 Template1.docx */}
      <div className="hidden print:block bg-white text-black p-8 sm:p-12 shadow-none font-sarabun max-w-[210mm] min-h-[297mm] mx-auto text-[14px] leading-normal relative select-text">
        {/* Title */}
        <h2 className="text-base font-bold mb-3">บันทึกรายวันของผู้ควบคุมงาน</h2>

        {/* Table 1: Daily Log 7 Days */}
        <table className="w-full border-collapse border border-black text-center text-[13px] mb-6">
          <thead>
            <tr className="bg-gray-50 font-bold">
              <th className="border border-black p-1.5 w-[8%]">วัน</th>
              <th className="border border-black p-1.5 w-[24%]">วัน เดือน ปี</th>
              <th className="border border-black p-1.5 w-[44%] text-center">รายละเอียดการดำเนินงาน</th>
              <th className="border border-black p-1.5 w-[12%]">สภาพอากาศ (เช้า)</th>
              <th className="border border-black p-1.5 w-[12%]">สภาพอากาศ (บ่าย)</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateVal = currentWeek?.dailyDates?.[idx] || '-';
              const descVal = currentWeek?.dailyNarrative?.[idx] || 'ไม่ปฏิบัติงาน';
              const weatherM = currentWeek?.dailyWeatherMorning?.[idx] || 'แจ่มใส';
              const weatherA = currentWeek?.dailyWeatherAfternoon?.[idx] || 'แจ่มใส';

              return (
                <tr key={`print-day-${idx}`} className="min-h-[30px]">
                  <td className="border border-black p-1 font-bold">{toThaiDigits(dayNum)}</td>
                  <td className="border border-black p-1">{toThaiDigits(dateVal)}</td>
                  <td className="border border-black p-1 text-left px-2">{descVal}</td>
                  <td className="border border-black p-1">{weatherM}</td>
                  <td className="border border-black p-1">{weatherA}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Title 2 */}
        <h2 className="text-base font-bold mb-3">บัญชีแสดงจำนวนแรงงานและเครื่องจักร</h2>

        {/* Table 2: Labor Loop */}
        <table className="w-full border-collapse border border-black text-center text-[13px]">
          <thead>
            <tr className="bg-gray-50 font-bold">
              <th className="border border-black p-1.5 w-[30%]">ประเภทแรงงาน / เครื่องจักร</th>
              {Array.from({ length: 7 }).map((_, idx) => (
                <th key={`print-th-sd-${idx}`} className="border border-black p-1 w-[10%]">
                  {toThaiDigits(currentWeek?.dailyShortDates?.[idx] || `ว.${idx + 1}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labors.length === 0 ? (
              <tr>
                <td className="border border-black p-1.5 text-left pl-3">หัวหน้าคนงาน/ช่าง</td>
                {Array.from({ length: 7 }).map((_, i) => (
                  <td key={`empty-l1-${i}`} className="border border-black p-1">-</td>
                ))}
              </tr>
            ) : (
              labors.map((row) => (
                <tr key={`print-labor-${row.id}`}>
                  <td className="border border-black p-1.5 text-left pl-3 font-medium">
                    {row.category || '-'}
                  </td>
                  {Array.from({ length: 7 }).map((_, dIdx) => (
                    <td key={`print-count-${row.id}-${dIdx}`} className="border border-black p-1">
                      {row.counts && row.counts[dIdx] > 0 ? toThaiDigits(row.counts[dIdx]) : '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
            {/* Total Row */}
            <tr className="bg-gray-50 font-bold">
              <td className="border border-black p-1.5 text-center">รวม</td>
              {Array.from({ length: 7 }).map((_, dIdx) => {
                const total = labors.reduce(
                  (sum, r) => sum + (r.counts && r.counts[dIdx] ? r.counts[dIdx] : 0),
                  0
                );
                return (
                  <td key={`print-total-${dIdx}`} className="border border-black p-1 font-bold">
                    {total > 0 ? toThaiDigits(total) : '-'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
