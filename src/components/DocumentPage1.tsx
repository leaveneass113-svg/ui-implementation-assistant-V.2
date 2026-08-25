import React, { useState } from 'react';
import { ReportData, WeekData } from '../types';
import {
  Building,
  ScrollText,
  UserCheck,
  TrendingUp,
  Sparkles,
  Layers,
  UploadCloud,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { GarudaEmblem } from './GarudaEmblem';
import {
  getLatestCumulativeProgress,
  getFirstWeekSunday,
  getNextMonday,
  parseThaiDate,
  formatThaiDateFull,
  formatThaiDateShort,
  toThaiDigits,
  bahttext,
} from '../utils/weekUtils';

interface Props {
  data: ReportData;
  onChange?: (updatedData: ReportData) => void;
  onNavigateToUpload?: () => void;
  onNavigateNext?: () => void;
  onLoadSample?: () => void;
}

export const DocumentPage1: React.FC<Props> = ({
  data,
  onChange,
  onNavigateToUpload,
  onNavigateNext,
  onLoadSample,
}) => {
  const updateField = (field: keyof ReportData, value: any) => {
    if (onChange) {
      onChange({ ...data, [field]: value });
    }
  };

  // Derive current cumulative % from latest week in state (using Thai digits)
  const currentPctDisplay = getLatestCumulativeProgress(data.weeks || [], true);

  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const activeIndex = data.activeWeekIndex ?? 0;
  const activeWeek = (data.weeks && data.weeks[activeIndex]) || data.weeks?.[0];

  const isDataEmpty = !data.projectName && !data.contractNo;

  const updateActiveWeekField = (field: keyof WeekData, value: any) => {
    if (!onChange) return;
    const weeks = data.weeks || [];
    const updatedWeeks = weeks.map((w, idx) => {
      if (idx === activeIndex) {
        return { ...w, [field]: value };
      }
      return w;
    });
    onChange({
      ...data,
      weeks: updatedWeeks,
    });
  };

  const handleStartDateChange = (val: string) => {
    if (!onChange) return;
    const startDate = parseThaiDate(val);
    let end: Date;
    if (activeIndex === 0) {
      end = getFirstWeekSunday(startDate);
    } else {
      end = new Date(startDate);
      end.setDate(end.getDate() + 6);
    }
    const reportDate = getNextMonday(end);

    const dailyDates: string[] = [];
    const dailyShortDates: string[] = [];
    const weekSunday = new Date(end);
    const weekMonday = new Date(weekSunday);
    weekMonday.setDate(weekMonday.getDate() - 6);

    for (let i = 0; i < 7; i++) {
      const d = new Date(weekMonday);
      d.setDate(d.getDate() + i);
      dailyDates.push(formatThaiDateFull(d, true));
      dailyShortDates.push(formatThaiDateShort(d, true));
    }

    const formattedStart = formatThaiDateFull(startDate, true);
    const formattedEnd = formatThaiDateFull(end, true);
    const formattedReport = formatThaiDateFull(reportDate, true);

    const weeks = data.weeks || [];
    const updatedWeeks = weeks.map((w, idx) => {
      if (idx === activeIndex) {
        return {
          ...w,
          startDate: val.includes('มิถุนายน') || val.includes('กรกฎาคม') || val.includes('สิงหาคม') ? toThaiDigits(val) : formattedStart,
          endDate: formattedEnd,
          reportDate: formattedReport,
          dailyDates,
          dailyShortDates,
        };
      }
      return w;
    });

    onChange({
      ...data,
      startDate: toThaiDigits(val),
      endDate: formattedEnd,
      reportDate: formattedReport,
      weeks: updatedWeeks,
    });
  };

  const handleEndDateChange = (val: string) => {
    if (!onChange) return;
    const endDate = parseThaiDate(val);
    const reportDate = getNextMonday(endDate);
    const formattedReport = formatThaiDateFull(reportDate, true);

    const weeks = data.weeks || [];
    const updatedWeeks = weeks.map((w, idx) => {
      if (idx === activeIndex) {
        return {
          ...w,
          endDate: toThaiDigits(val),
          reportDate: formattedReport,
        };
      }
      return w;
    });

    onChange({
      ...data,
      endDate: toThaiDigits(val),
      reportDate: formattedReport,
      weeks: updatedWeeks,
    });
  };

  // Convert all numbers in the project to Thai Numerals (1-click)
  const handleConvertAllToThaiDigits = () => {
    if (!onChange) return;

    const convertedWeeks = (data.weeks || []).map((w) => ({
      ...w,
      weekNo: toThaiDigits(w.weekNo),
      startDate: toThaiDigits(w.startDate),
      endDate: toThaiDigits(w.endDate),
      reportDate: toThaiDigits(w.reportDate),
      remainingDays: toThaiDigits(w.remainingDays),
      dailyDates: (w.dailyDates || []).map((d) => toThaiDigits(d)),
      dailyShortDates: (w.dailyShortDates || []).map((d) => toThaiDigits(d)),
    }));

    onChange({
      ...data,
      docNo: toThaiDigits(data.docNo),
      reportDate: toThaiDigits(data.reportDate),
      weekNo: toThaiDigits(data.weekNo),
      startDate: toThaiDigits(data.startDate),
      endDate: toThaiDigits(data.endDate),
      contractNo: toThaiDigits(data.contractNo),
      contractDate: toThaiDigits(data.contractDate),
      contractEndDate: toThaiDigits(data.contractEndDate),
      totalDays: toThaiDigits(data.totalDays),
      constructionCost: toThaiDigits(data.constructionCost),
      finePerDay: toThaiDigits(data.finePerDay),
      budgetAmount: toThaiDigits(data.budgetAmount),
      budgetYear: toThaiDigits(data.budgetYear || '2569'),
      remainingDays: toThaiDigits(data.remainingDays),
      weeks: convertedWeeks,
    });
  };

  const inputClass =
    'w-full px-4 py-2.5 rounded-2xl bg-[#141517] text-slate-100 placeholder:text-zinc-500 placeholder:font-light text-sm outline-none border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] focus:border-orange-500/50 transition-all antialiased';

  const textareaClass =
    'w-full px-4 py-2.5 rounded-2xl bg-[#141517] text-slate-100 placeholder:text-zinc-500 placeholder:font-light text-sm outline-none border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] focus:border-orange-500/50 resize-none transition-all antialiased leading-relaxed';

  return (
    <div className="w-full space-y-6">
      {/* Screen View: Dark Neumorphism Bento Cards Form Input */}
      <div className="print:hidden space-y-6">

        {/* 1. Empty State Prompt Banner (แสดงเมื่อยังไม่มีข้อมูลโครงการ และยังไม่ได้กดปิด) */}
        {!isBannerDismissed && isDataEmpty && (
          <div className="relative p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 neu-flat flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all animate-fadeIn">
            <div className="flex items-start gap-3 pr-8 sm:pr-0">
              <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                  เริ่มต้นจัดทำรายงานสัญญาจ้าง
                </h3>
                <p className="text-xs text-gray-300 mt-0.5">
                  เริ่มต้นใช้งานโดยกดปุ่ม <span className="text-orange-400 font-semibold">"อัปโหลด & สแกน"</span> เพื่อดึงข้อมูลสัญญาอัตโนมัติด้วย AI หรือกรอกข้อมูลด้วยตนเองด้านล่าง
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 self-end sm:self-center shrink-0">
              {onNavigateToUpload && (
                <button
                  onClick={onNavigateToUpload}
                  className="px-3.5 py-2 neu-orange-btn text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  <span>อัปโหลด & สแกน</span>
                </button>
              )}
              {onLoadSample && (
                <button
                  onClick={onLoadSample}
                  className="px-3.5 py-2 neu-button text-gray-300 hover:text-white rounded-2xl text-xs font-medium border border-white/5 active:scale-95"
                >
                  <span>โหลดตัวอย่างสัญญา ๓๐/๒๕๖๙</span>
                </button>
              )}
              <button
                onClick={() => setIsBannerDismissed(true)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                title="ปิดแบนเนอร์คำแนะนำ"
                aria-label="ปิดแบนเนอร์คำแนะนำ"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Top Control Bar: Active Week Selector (Dropdown List) & Actions */}
        <div className="neu-flat p-3.5 sm:p-4 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Week Selector Dropdown */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            
            <div className="flex items-center gap-2 flex-1 min-w-0 flex-wrap sm:flex-nowrap">
              {/* Prev Week Button */}
              <button
                type="button"
                disabled={activeIndex === 0}
                onClick={() => onChange && onChange({ ...data, activeWeekIndex: Math.max(0, activeIndex - 1) })}
                className="p-2.5 rounded-2xl neu-button text-gray-300 hover:text-orange-400 disabled:opacity-25 disabled:cursor-not-allowed border border-white/5 shrink-0 transition-all active:scale-95 cursor-pointer"
                title="สัปดาห์ก่อนหน้า"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dropdown Select for Weeks */}
              <div className="relative flex-1 min-w-[220px] sm:min-w-[320px] max-w-lg">
                <select
                  id="select_active_week_page1"
                  value={activeIndex}
                  onChange={(e) => onChange && onChange({ ...data, activeWeekIndex: Number(e.target.value) })}
                  className="w-full appearance-none px-4 py-2.5 pr-10 rounded-2xl bg-[#141517] text-orange-400 font-bold text-sm sm:text-base border border-orange-500/30 outline-none shadow-[inset_2px_2px_6px_#0a0b0c,inset_-2px_-2px_6px_rgba(255,255,255,0.02)] focus:border-orange-500 cursor-pointer transition-all hover:border-orange-500/50 truncate"
                >
                  {data.weeks && data.weeks.map((w, idx) => {
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
                disabled={!data.weeks || activeIndex >= data.weeks.length - 1}
                onClick={() => onChange && onChange({ ...data, activeWeekIndex: Math.min(data.weeks.length - 1, activeIndex + 1) })}
                className="p-2.5 rounded-2xl neu-button text-gray-300 hover:text-orange-400 disabled:opacity-25 disabled:cursor-not-allowed border border-white/5 shrink-0 transition-all active:scale-95 cursor-pointer"
                title="สัปดาห์ถัดไป"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Action & Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end shrink-0">
            <span className="text-[11px] sm:text-xs px-2.5 py-1.5 rounded-xl neu-pressed text-orange-400 font-bold border border-orange-500/30">
              สะสม: {toThaiDigits(activeWeek?.workProgress?.cumulative ?? 0)}%
            </span>

            <span className="hidden sm:inline-block text-[11px] bg-orange-500/15 text-orange-400 px-2.5 py-1.5 rounded-xl border border-orange-500/30 font-medium">
              ตัวเลขไทย ๑๐๐%
            </span>

            {/* Convert All to Thai Numerals Button */}
            <button
              onClick={handleConvertAllToThaiDigits}
              className="px-3 py-2 neu-button text-orange-400 hover:text-orange-300 rounded-2xl text-xs font-bold border border-orange-500/20 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shrink-0 cursor-pointer"
              title="แปลงตัวเลขทั้งหมดในโครงการเป็นตัวเลขไทย (๐-๙) อัตโนมัติ"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>แปลงเลขไทย</span>
            </button>
          </div>
        </div>

        {/* Bento Cards Grid: 2 Columns on PC, 1 Column on Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Bento Card 1: โครงการ (Project Card) */}
          <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-orange-400 tracking-wide">
                      Card โครงการ & หนังสือราชการ
                    </h3>
                    <p className="text-[11px] text-gray-400">ข้อมูลหนังสือ โครงการ และสถานที่</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 text-xs">
                {/* Row 1: Short Fields (DOC_NO, R_DATE, WEEK) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* DOC_NO */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{DOC_NO}}">
                      เลขที่หนังสือ (ที่)
                    </label>
                    <input
                      type="text"
                      id="field_doc_no"
                      name="doc_no"
                      value={data.docNo || ''}
                      onChange={(e) => updateField('docNo', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๐๒/๒๕๖๙ หรือ สถ ๐๐๒๓.๓/ว ๑๒๔"
                      className={inputClass}
                    />
                  </div>

                  {/* R_DATE */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{R_DATE}}">
                      วันที่รายงาน (วันจันทร์)
                      <span className="text-orange-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="field_r_date"
                      name="r_date"
                      value={activeWeek?.reportDate || data.reportDate || ''}
                      onChange={(e) => {
                        const val = toThaiDigits(e.target.value);
                        updateField('reportDate', val);
                        updateActiveWeekField('reportDate', val);
                      }}
                      placeholder="เช่น ๖ กรกฎาคม ๒๕๖๙"
                      className={`${inputClass} text-orange-300 font-bold`}
                    />
                  </div>

                  {/* WEEK */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{WEEK}}">
                      รายงานครั้งที่ / สัปดาห์ที่
                      <span className="text-orange-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="field_week_no"
                      name="week_no"
                      value={toThaiDigits(activeWeek?.weekNo || data.weekNo || '')}
                      onChange={(e) => {
                        const val = toThaiDigits(e.target.value);
                        updateField('weekNo', val);
                        updateActiveWeekField('weekNo', val);
                      }}
                      placeholder="เช่น ๑"
                      className={`${inputClass} text-center font-bold`}
                    />
                  </div>
                </div>

                {/* Row 2: Short Date Range Fields (START, END) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* START */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{START}}">
                      ตั้งแต่วันที่
                      <span className="text-orange-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="field_start_date"
                      name="start_date"
                      value={activeWeek?.startDate || data.startDate || ''}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      placeholder="เช่น ๓๐ มิถุนายน ๒๕๖๙"
                      className={inputClass}
                    />
                  </div>

                  {/* END */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{END}}">
                      ถึงวันที่ (วันอาทิตย์)
                      <span className="text-orange-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="field_end_date"
                      name="end_date"
                      value={activeWeek?.endDate || data.endDate || ''}
                      onChange={(e) => handleEndDateChange(e.target.value)}
                      placeholder="เช่น ๕ กรกฎาคม ๒๕๖๙"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* PROJECT */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{PROJECT}}">
                    งานก่อสร้าง / ชื่อโครงการ
                    <span className="text-orange-500 font-bold">*</span>
                  </label>
                  <textarea
                    rows={2}
                    id="field_project_name"
                    name="project_name"
                    value={data.projectName || ''}
                    onChange={(e) => updateField('projectName', e.target.value)}
                    placeholder="กรอกชื่องานก่อสร้าง หรือรอผลการสแกน..."
                    className={textareaClass}
                  />
                </div>

                {/* LOCATION */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{LOCATION}}">
                    สถานที่ก่อสร้าง
                  </label>
                  <textarea
                    rows={2}
                    id="field_location"
                    name="location"
                    value={data.location || ''}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="ระบุสถานที่ก่อสร้าง (เช่น บ้านทุ่งขามใต้ หมู่ที่ ๙ ตำบลใหม่พัฒนา)..."
                    className={textareaClass}
                  />
                </div>

                {/* QTY */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{QTY}}">
                    ปริมาณงาน (ขนาดและสเปก)
                  </label>
                  <textarea
                    rows={2}
                    id="field_quantity"
                    name="quantity"
                    value={data.quantity || ''}
                    onChange={(e) => updateField('quantity', toThaiDigits(e.target.value))}
                    placeholder="ระบุปริมาณงาน เช่น กว้าง ๓.๐๐ เมตร ยาว ๑๕๐.๐๐ เมตร หนา ๐.๑๕ เมตร หรือมีพื้นที่รวมไม่น้อยกว่า ๔๕๐.๐๐ ตร.ม..."
                    className={textareaClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 2: สัญญา (Contract Card) */}
          <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                    <ScrollText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-orange-400 tracking-wide">
                      Card สัญญา & ผลงาน (เลขไทย)
                    </h3>
                    <p className="text-[11px] text-gray-400">สัญญาจ้าง ระยะเวลา ค่าก่อสร้าง และความก้าวหน้า</p>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4 text-xs">
                {/* Row 1: Contract Numbers & Dates (C_NO, C_DATE, WS_DATE, C_END) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  
                  {/* C_NO */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{C_NO}}">
                      สัญญาจ้างเลขที่
                      <span className="text-orange-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="field_contract_no"
                      name="contract_no"
                      value={data.contractNo || ''}
                      onChange={(e) => updateField('contractNo', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๓๐/๒๕๖๙"
                      className={inputClass}
                    />
                  </div>

                  {/* C_DATE */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{C_DATE}}">
                      ลงวันที่สัญญา
                      <span className="text-orange-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="field_contract_date"
                      name="contract_date"
                      value={data.contractDate || ''}
                      onChange={(e) => updateField('contractDate', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๒๙ มิถุนายน ๒๕๖๙"
                      className={inputClass}
                    />
                  </div>

                  {/* WS_DATE */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{WS_DATE}}">
                      วันเริ่มงานตามสัญญา
                    </label>
                    <input
                      type="text"
                      id="field_ws_date"
                      name="ws_date"
                      value={data.wsDate || ''}
                      onChange={(e) => updateField('wsDate', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๓๐ มิถุนายน ๒๕๖๙"
                      className={inputClass}
                    />
                  </div>

                  {/* C_END */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{C_END}}">
                      แล้วเสร็จวันที่
                      <span className="text-orange-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="field_contract_end_date"
                      name="contract_end_date"
                      value={data.contractEndDate || ''}
                      onChange={(e) => updateField('contractEndDate', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๒๘ สิงหาคม ๒๕๖๙"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Row 2: Metrics (DAYS, COST, FINE, INSTALL_N) */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  
                  {/* DAYS */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{DAYS}}">
                      รวมระยะเวลา (วัน)
                      <span className="text-orange-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="field_total_days"
                      name="total_days"
                      value={toThaiDigits(data.totalDays || '')}
                      onChange={(e) => updateField('totalDays', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๖๐"
                      className={`${inputClass} text-center font-bold`}
                    />
                  </div>

                  {/* COST */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{COST}}">
                      ค่าก่อสร้าง (บาท)
                      <span className="text-orange-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="field_construction_cost"
                      name="construction_cost"
                      value={data.constructionCost || ''}
                      onChange={(e) => updateField('constructionCost', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๒๗๗,๐๐๐.๐๐"
                      className={`${inputClass} font-bold text-orange-200`}
                    />
                  </div>

                  {/* FINE */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{FINE}}">
                      ค่าปรับวันละ (บาท)
                    </label>
                    <input
                      type="text"
                      id="field_fine_per_day"
                      name="fine_per_day"
                      value={data.finePerDay || ''}
                      onChange={(e) => updateField('finePerDay', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๖๙๓.๐๐"
                      className={`${inputClass} font-bold`}
                    />
                  </div>

                  {/* INSTALL_N */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{INSTALL_N}}">
                      งวดงานที่
                    </label>
                    <input
                      type="text"
                      id="field_install_n"
                      name="install_n"
                      value={toThaiDigits(data.installN || '๑')}
                      onChange={(e) => updateField('installN', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๑"
                      className={`${inputClass} text-center font-bold`}
                    />
                  </div>
                </div>

                {/* Auto BahtText Preview Display */}
                {(data.constructionCost || data.finePerDay) && (
                  <div className="p-3 rounded-2xl bg-[#141517] border border-white/5 space-y-1.5 text-[11px] shadow-[inset_2px_2px_5px_#0a0b0c]">
                    {data.constructionCost && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-orange-400 font-semibold shrink-0">ตัวหนังสือค่าจ้าง (COST_TEXT):</span>
                        <span className="text-gray-200 italic font-medium">{bahttext(data.constructionCost)}</span>
                      </div>
                    )}
                    {data.finePerDay && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <span className="text-orange-400 font-semibold shrink-0">ตัวหนังสือค่าปรับ (FINE_TEXT):</span>
                        <span className="text-gray-200 italic font-medium">{bahttext(data.finePerDay)}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* CONTRACTOR & CTR_ADDR */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{CONTRACTOR}}">
                      ชื่อผู้รับจ้าง
                      <span className="text-orange-500 font-bold">*</span>
                    </label>
                    <input
                      type="text"
                      id="field_contractor_name"
                      name="contractor_name"
                      value={data.contractorName || ''}
                      onChange={(e) => updateField('contractorName', e.target.value)}
                      placeholder="เช่น ห้างหุ้นส่วนจำกัด ชัยยุทธ ธุรกิจการโยธา"
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{CTR_ADDR}}">
                      ที่อยู่ผู้รับจ้าง (CTR_ADDR)
                    </label>
                    <input
                      type="text"
                      id="field_contractor_addr"
                      name="contractor_addr"
                      value={data.contractorAddress || ''}
                      onChange={(e) => updateField('contractorAddress', e.target.value)}
                      placeholder="เช่น บ้านปงยางคก เลขที่ ๕๒/๑ หมู่ ๙ ตำบลปงยางคก..."
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* REP_1 & REP_2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{REP_1}}">
                      ผู้แทนผู้รับจ้าง คนที่ 1 (REP_1)
                    </label>
                    <input
                      type="text"
                      id="field_rep1_name"
                      name="rep1_name"
                      value={data.rep1Name || ''}
                      onChange={(e) => updateField('rep1Name', e.target.value)}
                      placeholder="เช่น นายพรหมมินทร์ ปะระมา"
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{REP_2}}">
                      ผู้แทนผู้รับจ้าง คนที่ 2 (REP_2)
                    </label>
                    <input
                      type="text"
                      id="field_rep2_name"
                      name="rep2_name"
                      value={data.rep2Name || '-'}
                      onChange={(e) => updateField('rep2Name', e.target.value)}
                      placeholder="ระบุชื่อ หรือใส่ -"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Section Divider: Progress */}
                <div className="pt-3 border-t border-white/5 space-y-3">
                  <div className="flex items-center gap-1.5 text-orange-400 font-bold text-xs">
                    <TrendingUp className="w-4 h-4" />
                    <span>ข้อมูลผลงานและความก้าวหน้า (คำนวณจากสัปดาห์ล่าสุดอัตโนมัติ)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* CURRENT_PCT */}
                    <div className="p-4 rounded-2xl bg-[#141517] border border-orange-500/30 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)]">
                      <label className="block text-orange-300 font-bold mb-1 text-xs">
                        %ผลงานปัจจุบัน (ดึงจากสะสม WC)
                      </label>
                      <div id="field_percent" className="text-2xl font-black text-orange-400">
                        {currentPctDisplay}
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-1">
                        อัปเดตอัตโนมัติจากแท็บบันทึกประจำสัปดาห์
                      </span>
                    </div>

                    {/* REMAIN */}
                    <div className="p-4 rounded-2xl bg-[#141517] border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)]">
                      <label className="block text-gray-300 font-semibold mb-1 text-xs">
                        ระยะเวลาก่อสร้างคงเหลือ
                      </label>
                      <div id="field_remain" className="text-2xl font-bold text-white">
                        {activeWeek?.remainingDays || data.remainingDays ? (
                          <>
                            {toThaiDigits(activeWeek?.remainingDays || data.remainingDays)} <span className="text-xs font-normal text-gray-400">วัน</span>
                          </>
                        ) : (
                          <span className="text-gray-400 text-xl">- วัน</span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-1">
                        {data.totalDays
                          ? `คำนวณจาก ${toThaiDigits(data.totalDays)} วัน ลบด้วยวันที่ทำไปแล้ว`
                          : 'รอข้อมูลวันที่สิ้นสุดสัญญา'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Card 3: บุคลากร (Staff Card) - Full Width */}
          <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-5 flex flex-col justify-between lg:col-span-2">
            <div className="space-y-4">
              {/* Card Header */}
              <div className="flex items-center gap-3 border-b border-white/5 pb-3.5 mb-4">
                <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-orange-400 tracking-wide">
                    Card บุคลากร & คณะกรรมการตรวจรับพัสดุ
                  </h3>
                  <p className="text-[11px] text-gray-400">ผู้ควบคุมงาน และ คณะกรรมการตรวจรับพัสดุ</p>
                </div>
              </div>

              {/* Form Fields: 2 Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Supervisor */}
                <div className="space-y-3.5 pb-4 md:pb-0 border-b md:border-b-0 md:border-r border-white/5 md:pr-6">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                    <UserCheck className="w-4 h-4" />
                    <span>ผู้ควบคุมงาน</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{SUP_NAME}}">
                        ชื่อ-นามสกุล
                        <span className="text-orange-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        id="field_supervisor_name"
                        name="supervisor_name"
                        value={data.supervisorName || ''}
                        onChange={(e) => updateField('supervisorName', e.target.value)}
                        placeholder="เช่น นายธนิส บุญเป็ง"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{SUP_POS}}">
                        ตำแหน่ง
                      </label>
                      <input
                        type="text"
                        id="field_supervisor_pos"
                        name="supervisor_pos"
                        value={data.supervisorPos || ''}
                        onChange={(e) => updateField('supervisorPos', e.target.value)}
                        placeholder="เช่น นายช่างโยธาอาวุโส"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Committee Chair */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                    <UserCheck className="w-4 h-4" />
                    <span>ประธานกรรมการตรวจรับพัสดุ</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{COM_P_NAME}}">
                        ชื่อ-นามสกุล
                        <span className="text-orange-500 font-bold">*</span>
                      </label>
                      <input
                        type="text"
                        id="field_committee_chair_name"
                        name="committee_chair_name"
                        value={data.committeeChairName || ''}
                        onChange={(e) => updateField('committeeChairName', e.target.value)}
                        placeholder="เช่น นายมนตรี ฟูฟ่า"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{COM_P_POS}}">
                        ตำแหน่ง
                      </label>
                      <input
                        type="text"
                        id="field_committee_chair_pos"
                        name="committee_chair_pos"
                        value={data.committeeChairPos || ''}
                        onChange={(e) => updateField('committeeChairPos', e.target.value)}
                        placeholder="เช่น ผู้อำนวยการกองช่าง"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Committee Member 1 */}
                <div className="space-y-3.5 pt-4 border-t border-white/5 md:pr-6 md:border-r">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                    <UserCheck className="w-4 h-4" />
                    <span>กรรมการตรวจรับพัสดุ (คนที่ ๑)</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{COM_1_NAME}}">
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        id="field_committee1_name"
                        name="committee1_name"
                        value={data.committee1Name || ''}
                        onChange={(e) => updateField('committee1Name', e.target.value)}
                        placeholder="เช่น นางสาวธัญญารัตน์ กันทาสุข"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{COM_1_POS}}">
                        ตำแหน่ง
                      </label>
                      <input
                        type="text"
                        id="field_committee1_pos"
                        name="committee1_pos"
                        value={data.committee1Pos || ''}
                        onChange={(e) => updateField('committee1Pos', e.target.value)}
                        placeholder="เช่น นักวิชาการเงินและบัญชีชำนาญการ"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>

                {/* Committee Member 2 */}
                <div className="space-y-3.5 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                    <UserCheck className="w-4 h-4" />
                    <span>กรรมการตรวจรับพัสดุ (คนที่ ๒)</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{COM_2_NAME}}">
                        ชื่อ-นามสกุล
                      </label>
                      <input
                        type="text"
                        id="field_committee2_name"
                        name="committee2_name"
                        value={data.committee2Name || ''}
                        onChange={(e) => updateField('committee2Name', e.target.value)}
                        placeholder="เช่น นายศราวุฒิ ทรายใจ"
                        className={inputClass}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1" title="แมปกับตัวแปร Word: {{COM_2_POS}}">
                        ตำแหน่ง
                      </label>
                      <input
                        type="text"
                        id="field_committee2_pos"
                        name="committee2_pos"
                        value={data.committee2Pos || ''}
                        onChange={(e) => updateField('committee2Pos', e.target.value)}
                        placeholder="เช่น นักวิชาการศึกษาชำนาญการ"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Navigation Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5 gap-3">
          {onNavigateToUpload && (
            <button
              onClick={onNavigateToUpload}
              className="neu-button px-4 py-2.5 rounded-2xl text-xs font-semibold text-gray-300 hover:text-white border border-white/5 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>ย้อนกลับ: อัปโหลด & สแกน</span>
            </button>
          )}
          {onNavigateNext && (
            <button
              onClick={onNavigateNext}
              className="neu-orange-btn ml-auto px-5 py-2.5 rounded-2xl text-xs font-bold text-white flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer hover:scale-[1.02]"
            >
              <span>ถัดไป: บันทึกสัปดาห์ (หน้า ๒)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Print View: Document format conforming 100% to V2 Template1.docx */}
      <div className="hidden print:block bg-white text-black p-8 sm:p-12 shadow-none font-sarabun max-w-[210mm] min-h-[297mm] mx-auto text-[15px] leading-relaxed relative select-text">
        {/* Garuda Emblem Header */}
        <div className="flex items-start justify-between relative mb-3">
          <div className="absolute left-1/2 -translate-x-1/2 top-0">
            <GarudaEmblem className="w-[3cm] h-[3cm]" />
          </div>
          <div className="font-bold text-2xl tracking-wider pt-2">บันทึกข้อความ</div>
        </div>

        {/* Memo Header Details */}
        <div className="space-y-1 mt-6 text-[15px]">
          <div className="flex items-baseline">
            <span className="font-bold w-28 shrink-0">ส่วนราชการ</span>
            <span className="flex-1 border-b border-dotted border-gray-400 pb-0.5">
              องค์การบริหารส่วนตำบลใหม่พัฒนา อำเภอเกาะคา จังหวัดลำปาง
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            <div className="flex items-baseline flex-1">
              <span className="font-bold w-12 shrink-0">ที่</span>
              <span className="flex-1 border-b border-dotted border-gray-400 pb-0.5 font-bold">
                {toThaiDigits(data.docNo) || '...........................'}
              </span>
            </div>
            <div className="flex items-baseline flex-1">
              <span className="font-bold w-12 shrink-0">วันที่</span>
              <span className="flex-1 border-b border-dotted border-gray-400 pb-0.5 font-bold">
                {toThaiDigits(activeWeek?.reportDate || data.reportDate) || '...........................'}
              </span>
            </div>
          </div>
          <div className="flex items-baseline">
            <span className="font-bold w-14 shrink-0">เรื่อง</span>
            <span className="flex-1 border-b border-dotted border-gray-400 pb-0.5 font-bold">
              รายงานผลการปฏิบัติงานของผู้ควบคุมงาน ประจำสัปดาห์ที่ {toThaiDigits(activeWeek?.weekNo || data.weekNo || '๑')}
            </span>
          </div>
        </div>

        {/* Recipient */}
        <div className="mt-4 font-bold">
          เรียน ประธานกรรมการตรวจรับพัสดุ
        </div>

        {/* Body Content */}
        <div className="mt-3 space-y-2 text-justify text-[15px] indent-8">
          <p>
            ตามคำสั่งองค์การบริหารส่วนตำบลใหม่พัฒนา ที่ ๒/๒๕๖๙ ลงวันที่ ๙ มิถุนายน ๒๕๖๙ ได้แต่งตั้งข้าพเจ้า{' '}
            <span className="font-bold">{data.supervisorName || '...........................'}</span> ตำแหน่ง{' '}
            <span>{data.supervisorPos || '...........................'}</span> เป็นผู้ควบคุมงานจ้าง{' '}
            <span className="font-bold">{data.projectName || '...........................'}</span> สถานที่ก่อสร้าง{' '}
            <span>{data.location || '...........................'}</span> ปริมาณงาน{' '}
            <span>{toThaiDigits(data.quantity) || '...........................'}</span>
          </p>
          <p className="indent-8">
            ตามสัญญาจ้างเลขที่ <span className="font-bold">{toThaiDigits(data.contractNo) || '...........................'}</span> ลงวันที่{' '}
            <span>{toThaiDigits(data.contractDate) || '...........................'}</span> สิ้นสุดสัญญาวันที่{' '}
            <span>{toThaiDigits(data.contractEndDate) || '...........................'}</span> รวมระยะเวลาทำการ{' '}
            <span className="font-bold">{toThaiDigits(data.totalDays) || '......'}</span> วัน ค่าจ้างเป็นเงิน{' '}
            <span className="font-bold">{toThaiDigits(data.constructionCost) || '...........................'}</span> บาท ค่าปรับวันละ{' '}
            <span>{toThaiDigits(data.finePerDay) || '..........'}</span> บาท โดยมี{' '}
            <span className="font-bold">{data.contractorName || '...........................'}</span> เป็นผู้รับจ้าง นั้น
          </p>
          <p className="indent-8">
            บัดนี้ ผู้ควบคุมงานได้ควบคุมงานก่อสร้าง ประจำสัปดาห์ที่{' '}
            <span className="font-bold">{toThaiDigits(activeWeek?.weekNo || data.weekNo || '๑')}</span> ตั้งแต่วันที่{' '}
            <span className="font-bold">{toThaiDigits(activeWeek?.startDate || data.startDate || '...........................')}</span> ถึงวันที่{' '}
            <span className="font-bold">{toThaiDigits(activeWeek?.endDate || data.endDate || '...........................')}</span> ผลงานก่อสร้างสะสมคิดเป็นร้อยละ{' '}
            <span className="font-bold">{currentPctDisplay}</span> ระยะเวลาก่อสร้างคงเหลือ{' '}
            <span className="font-bold">{toThaiDigits(activeWeek?.remainingDays || data.remainingDays || '..')}</span> วัน รายละเอียดตามเอกสารแนบท้ายนี้
          </p>
        </div>

        {/* Signatures */}
        <div className="mt-8 grid grid-cols-2 gap-6 text-center text-[14px]">
          <div className="space-y-1">
            <p className="font-bold mb-8">ลงชื่อ................................................ผู้ควบคุมงาน</p>
            <p className="font-bold">({data.supervisorName || '................................................'})</p>
            <p className="text-gray-700">{data.supervisorPos || '................................................'}</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold mb-8">ลงชื่อ................................................ประธานกรรมการ</p>
            <p className="font-bold">({data.committeeChairName || '................................................'})</p>
            <p className="text-gray-700">{data.committeeChairPos || '................................................'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
