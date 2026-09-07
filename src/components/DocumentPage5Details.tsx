import React, { useState } from 'react';
import { ReportData } from '../types';
import { resetPage5Data } from '../utils/pageResetHelpers';
import { ClearPageButton } from './ClearPageButton';
import {
  FileSpreadsheet,
  Building,
  Users,
  HardHat,
  UserCheck,
  ChevronLeft,
  ArrowRight,
  DollarSign,
  Sparkles,
  Layers,
  MapPin,
  Calendar,
  Clock,
  Ruler,
  FileText,
  Printer,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { toThaiDigits, bahttext } from '../utils/weekUtils';

interface Props {
  data: ReportData;
  onChange?: (updatedData: ReportData) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
}

export const DocumentPage5Details: React.FC<Props> = ({
  data,
  onChange,
  onNavigatePrev,
  onNavigateNext,
}) => {
  // Mode switcher: 'form' for Bento Grid, 'a4' for exact document paper preview
  const [viewMode, setViewMode] = useState<'form' | 'a4'>('form');

  const updateField = (field: keyof ReportData, value: any) => {
    if (onChange) {
      onChange({ ...data, [field]: value });
    }
  };

  const handleClearPage5 = () => {
    if (onChange) {
      onChange(resetPage5Data(data));
    }
  };

  // Convert all numbers in Page 5 to Thai Numerals
  const handleConvertAllToThaiDigits = () => {
    if (!onChange) return;
    onChange({
      ...data,
      contractNo: toThaiDigits(data.contractNo),
      contractDate: toThaiDigits(data.contractDate),
      wsDate: toThaiDigits(data.wsDate || data.startDate),
      startDate: toThaiDigits(data.startDate),
      contractEndDate: toThaiDigits(data.contractEndDate),
      totalDays: toThaiDigits(data.totalDays),
      installN: toThaiDigits(data.installN || '๑'),
      extendedEndDate: toThaiDigits(data.extendedEndDate),
      extendedDays: toThaiDigits(data.extendedDays),
      constructionCost: toThaiDigits(data.constructionCost),
      finePerDay: toThaiDigits(data.finePerDay),
      dimensionWidth: toThaiDigits(data.dimensionWidth),
      dimensionLength: toThaiDigits(data.dimensionLength),
      dimensionThickness: toThaiDigits(data.dimensionThickness),
      dimensionArea: toThaiDigits(data.dimensionArea),
    });
  };

  // Auto-compose dimensions into quantity description
  const handleComposeDimensions = () => {
    if (!onChange) return;
    const parts: string[] = [];
    if (data.dimensionWidth) parts.push(`กว้าง ${toThaiDigits(data.dimensionWidth)} เมตร`);
    if (data.dimensionLength) parts.push(`ยาว ${toThaiDigits(data.dimensionLength)} เมตร`);
    if (data.dimensionThickness) parts.push(`หนา ${toThaiDigits(data.dimensionThickness)} เมตร`);
    if (data.dimensionArea) parts.push(`หรือมีพื้นที่คอนกรีตไม่น้อยกว่า ${toThaiDigits(data.dimensionArea)} ตารางเมตร`);

    if (parts.length > 0) {
      const composed = parts.join(' ');
      const existing = data.quantity ? `${data.quantity.trim()} ` : '';
      onChange({
        ...data,
        quantity: `${existing}${composed}`,
      });
    }
  };

  // Live Bahttext calculations
  const costTextCalculated = bahttext(data.constructionCost);
  const fineTextCalculated = bahttext(data.finePerDay);

  // Live full scope calculation for 1.3: {{PROJECT}}{{LOCATION}}{{QTY}}
  const fullScopeSummary = [data.projectName, data.location, data.quantity].filter(Boolean).join(' ');

  // Compact input styling
  const inputBase =
    'px-3.5 py-2 rounded-xl bg-[#141517] text-slate-100 placeholder:text-zinc-600 placeholder:font-light text-xs sm:text-sm outline-none border border-white/5 shadow-[inset_2px_2px_5px_#0a0b0c,inset_-1px_-1px_3px_rgba(255,255,255,0.02)] focus:border-orange-500/60 transition-all antialiased';

  const textareaBase =
    'px-3.5 py-2 rounded-xl bg-[#141517] text-slate-100 placeholder:text-zinc-600 placeholder:font-light text-xs sm:text-sm outline-none border border-white/5 shadow-[inset_2px_2px_5px_#0a0b0c,inset_-1px_-1px_3px_rgba(255,255,255,0.02)] focus:border-orange-500/60 resize-none transition-all antialiased leading-relaxed';

  return (
    <div id="page-5-project-details" className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Top Control Bar: Header, Mode Switcher & Action Controls */}
      <div className="neu-flat p-4 sm:p-5 rounded-3xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3.5 print:hidden">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                ๑. ข้อมูลเกี่ยวกับงาน
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                หน้า ๕
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] bg-orange-500/15 text-orange-400 px-2.5 py-0.5 rounded-xl border border-orange-500/30 font-semibold">
                ข้อ ๑.๑ – ๑.๖
              </span>
              {data.contractNo && (
                <span className="hidden sm:inline-flex items-center text-[11px] font-medium px-2.5 py-0.5 rounded-xl neu-pressed text-slate-300 border border-white/5">
                  สัญญา: <span className="text-orange-400 font-bold ml-1">{data.contractNo}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              ข้อมูลตามเอกสารสัญญาจ้าง: ผู้ดำเนินการ สัญญาจ้าง ขอบเขตงาน คณะกรรมการ และผู้ควบคุมงาน
            </p>
          </div>
        </div>

        {/* View Mode Toggle & Actions */}
        <div className="flex items-center gap-2 flex-wrap self-end md:self-center shrink-0">
          {/* View Mode Segmented Control */}
          <div className="flex items-center p-1 rounded-2xl neu-pressed border border-white/5 bg-[#141517]">
            <button
              type="button"
              onClick={() => setViewMode('form')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'form'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="โหมดฟอร์มกรอกข้อมูลแบบ Bento Grid"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>ฟอร์ม Bento</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('a4')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'a4'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="โหมดหน้ากระดาษ A4 เสมือนจริงตรงตามแบบพิมพ์ราชการ"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>หน้ากระดาษ A4</span>
            </button>
          </div>

          {/* Thai Numeral Converter */}
          <button
            type="button"
            onClick={handleConvertAllToThaiDigits}
            className="px-3 py-2 neu-button text-orange-400 hover:text-orange-300 rounded-2xl text-xs font-bold border border-orange-500/20 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shrink-0 cursor-pointer"
            title="แปลงตัวเลขในหน้านี้เป็นตัวเลขไทย (๐-๙) ทั้งหมด"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="hidden sm:inline">แปลงเลขไทย</span>
          </button>

          {/* Quick Print Button */}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-2 neu-button text-slate-300 hover:text-white rounded-2xl text-xs font-bold border border-white/10 flex items-center gap-1.5 transition-all active:scale-95 shadow-sm shrink-0 cursor-pointer"
            title="สั่งพิมพ์หน้ากระดาษราชการ A4 หน้านี้"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">พิมพ์หน้านี้</span>
          </button>

          <ClearPageButton pageNumber={5} onClear={handleClearPage5} />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MODE A: BENTO GRID FORM VIEW (สำหรับกรอกและตรวจแก้ข้อมูล) */}
      {/* ========================================================================= */}
      {viewMode === 'form' && (
        <div className="space-y-6 print:hidden">
          {/* CARD 1: ๑.๑ ผู้ดำเนินการ (Full Width, Balanced 2x2 Grid) */}
          <div className="neu-flat p-5 sm:p-6 rounded-3xl border border-white/5 space-y-4" id="card-operator-info">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-orange-400 tracking-wide">
                    ๑.๑ ผู้ดำเนินการ
                  </h3>
                  <p className="text-[11px] text-gray-400">ผู้ว่าจ้าง ผู้ออกแบบ ผู้รับจ้าง และที่อยู่สำนักงาน</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-lg neu-pressed text-orange-400 font-semibold border border-orange-500/20">
                คู่สัญญา
              </span>
            </div>

            {/* Form Fields: Proportional & Symmetrical 2x2 Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <label htmlFor="field-p5-employer" className="text-[11px] font-semibold text-slate-300">
                  ผู้ว่าจ้าง:
                </label>
                <input
                  id="field-p5-employer"
                  type="text"
                  value={data.employerName || 'องค์การบริหารส่วนตำบลใหม่พัฒนา'}
                  onChange={(e) => updateField('employerName', e.target.value)}
                  placeholder="เช่น องค์การบริหารส่วนตำบลใหม่พัฒนา"
                  className={`${inputBase} w-full`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="field-p5-designer" className="text-[11px] font-semibold text-slate-300">
                  ผู้ออกแบบ:
                </label>
                <input
                  id="field-p5-designer"
                  type="text"
                  value={data.designerName || 'กองช่างองค์การบริหารส่วนตำบลใหม่พัฒนา'}
                  onChange={(e) => updateField('designerName', e.target.value)}
                  placeholder="เช่น กองช่างองค์การบริหารส่วนตำบลใหม่พัฒนา"
                  className={`${inputBase} w-full`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="field-p5-contractor" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <span>ชื่อผู้รับจ้าง (Contractor)</span>
                  <span className="text-orange-500 font-bold">*</span>
                </label>
                <input
                  id="field-p5-contractor"
                  type="text"
                  value={data.contractorName || ''}
                  onChange={(e) => updateField('contractorName', e.target.value)}
                  placeholder="เช่น ห้างหุ้นส่วนจำกัด ชัยยุทธ ธุรกิจการโยธา"
                  className={`${inputBase} w-full text-orange-300 font-bold`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="field-p5-ctr-addr" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-400" />
                  <span>ที่อยู่สำนักงานใหญ่</span>
                </label>
                <input
                  id="field-p5-ctr-addr"
                  type="text"
                  value={data.contractorAddress || ''}
                  onChange={(e) => updateField('contractorAddress', e.target.value)}
                  placeholder="เช่น บ้านเลขที่ ๑๒/๓ หมู่ที่ ๔ ตำบลดอนไฟ อำเภอแม่ทะ จังหวัดลำปาง"
                  className={`${inputBase} w-full`}
                />
              </div>
            </div>
          </div>

          {/* CARD 2: ๑.๒ สัญญาจ้าง (Full Width, Balanced Multi-Column Grid) */}
          <div className="neu-flat p-5 sm:p-6 rounded-3xl border border-white/5 space-y-4" id="card-contract-info">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-orange-400 tracking-wide">
                    ๑.๒ สัญญาจ้าง
                  </h3>
                  <p className="text-[11px] text-gray-400">เลขที่สัญญา วันที่ วงเงิน ค่าปรับ ระยะเวลา และงวดงาน</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-lg neu-pressed text-orange-400 font-semibold border border-orange-500/20">
                สัญญาหลัก
              </span>
            </div>

            {/* Form Fields: Proportional & Structured */}
            <div className="space-y-3.5 text-xs">
              {/* Row 1: ชื่อสัญญา & สถานที่ก่อสร้าง */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-project" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <span>ชื่อสัญญา / งานก่อสร้าง</span>
                    <span className="text-orange-500 font-bold">*</span>
                  </label>
                  <input
                    id="field-p5-project"
                    type="text"
                    value={data.projectName || ''}
                    onChange={(e) => updateField('projectName', e.target.value)}
                    placeholder="เช่น โครงการก่อสร้างถนนคอนกรีตเสริมเหล็ก ซอย ๕"
                    className={`${inputBase} w-full text-orange-300 font-semibold`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-location" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" />
                    <span>สถานที่ก่อสร้าง</span>
                    <span className="text-orange-500 font-bold">*</span>
                  </label>
                  <input
                    id="field-p5-location"
                    type="text"
                    value={data.location || ''}
                    onChange={(e) => updateField('location', e.target.value)}
                    placeholder="เช่น หมู่ที่ ๔ ตำบลดอนไฟ อำเภอแม่ทะ จังหวัดลำปาง"
                    className={`${inputBase} w-full`}
                  />
                </div>
              </div>

              {/* Row 2: สัญญาจ้าง เลขที่ | ลงวันที่ | เริ่มสัญญาจ้าง | สิ้นสุดสัญญาจ้าง (4 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-cno" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <span>สัญญาจ้าง เลขที่</span>
                    <span className="text-orange-500 font-bold">*</span>
                  </label>
                  <input
                    id="field-p5-cno"
                    type="text"
                    value={data.contractNo || ''}
                    onChange={(e) => updateField('contractNo', toThaiDigits(e.target.value))}
                    placeholder="เช่น ๓๐/๒๕๖๙"
                    className={`${inputBase} w-full text-orange-300 font-bold`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-cdate" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <span>ลงวันที่</span>
                    <span className="text-orange-500 font-bold">*</span>
                  </label>
                  <input
                    id="field-p5-cdate"
                    type="text"
                    value={data.contractDate || ''}
                    onChange={(e) => updateField('contractDate', toThaiDigits(e.target.value))}
                    placeholder="เช่น ๒๙ มิถุนายน ๒๕๖๙"
                    className={`${inputBase} w-full`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-wsdate" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    <span>เริ่มสัญญาจ้าง ลงวันที่</span>
                  </label>
                  <input
                    id="field-p5-wsdate"
                    type="text"
                    value={data.wsDate || data.startDate || ''}
                    onChange={(e) => {
                      const val = toThaiDigits(e.target.value);
                      updateField('wsDate', val);
                      updateField('startDate', val);
                    }}
                    placeholder="เช่น ๓๐ มิถุนายน ๒๕๖๙"
                    className={`${inputBase} w-full`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-cend" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    <span>สิ้นสุดสัญญาจ้าง ลงวันที่</span>
                  </label>
                  <input
                    id="field-p5-cend"
                    type="text"
                    value={data.contractEndDate || ''}
                    onChange={(e) => updateField('contractEndDate', toThaiDigits(e.target.value))}
                    placeholder="เช่น ๒๘ สิงหาคม ๒๕๖๙"
                    className={`${inputBase} w-full`}
                  />
                </div>
              </div>

              {/* Row 3: ระยะเวลาก่อสร้าง & จำนวนงวดงาน & ต่อสัญญา (4 cols) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-days" className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-orange-400" />
                    <span>ระยะเวลา (วัน)</span>
                  </label>
                  <input
                    id="field-p5-days"
                    type="text"
                    value={data.totalDays || ''}
                    onChange={(e) => updateField('totalDays', toThaiDigits(e.target.value))}
                    placeholder="๖๐"
                    className={`${inputBase} w-full text-center font-bold text-orange-300`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-install-n" className="text-[10px] font-semibold text-slate-400">
                    งวดงานตามสัญญา:
                  </label>
                  <input
                    id="field-p5-install-n"
                    type="text"
                    value={toThaiDigits(data.installN || '๑')}
                    onChange={(e) => updateField('installN', toThaiDigits(e.target.value))}
                    placeholder="๑"
                    className={`${inputBase} w-full text-center font-bold`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-ext-date" className="text-[10px] font-semibold text-slate-400">
                    ต่อสัญญาถึง:
                  </label>
                  <input
                    id="field-p5-ext-date"
                    type="text"
                    value={data.extendedEndDate || ''}
                    onChange={(e) => updateField('extendedEndDate', toThaiDigits(e.target.value))}
                    placeholder="ระบุวันที่ หรือ -"
                    className={`${inputBase} w-full text-center`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-ext-days" className="text-[10px] font-semibold text-slate-400">
                    รวมต่อสัญญา (วัน):
                  </label>
                  <input
                    id="field-p5-ext-days"
                    type="text"
                    value={data.extendedDays || ''}
                    onChange={(e) => updateField('extendedDays', toThaiDigits(e.target.value))}
                    placeholder="-"
                    className={`${inputBase} w-full text-center`}
                  />
                </div>
              </div>

              {/* Row 4: ราคาก่อสร้าง & ค่าปรับรายวัน (2 cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-cost" className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <span>ราคาก่อสร้าง (บาท)</span>
                      <span className="text-orange-500 font-bold">*</span>
                    </span>
                  </label>
                  <input
                    id="field-p5-cost"
                    type="text"
                    value={data.constructionCost || ''}
                    onChange={(e) => updateField('constructionCost', toThaiDigits(e.target.value))}
                    placeholder="เช่น ๒๗๗,๐๐๐.๐๐"
                    className={`${inputBase} w-full text-orange-400 font-bold`}
                  />
                  {costTextCalculated && (
                    <span className="text-[10px] text-orange-400/90 font-medium truncate">
                      ({costTextCalculated})
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="field-p5-fine" className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                    <span>ค่าปรับวันละ (บาท)</span>
                  </label>
                  <input
                    id="field-p5-fine"
                    type="text"
                    value={data.finePerDay || ''}
                    onChange={(e) => updateField('finePerDay', toThaiDigits(e.target.value))}
                    placeholder="เช่น ๖๙๓.๐๐"
                    className={`${inputBase} w-full text-rose-400 font-semibold`}
                  />
                  {fineTextCalculated && (
                    <span className="text-[10px] text-rose-400/90 font-medium truncate">
                      ({fineTextCalculated})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: ๑.๓ ลักษณะและขอบเขตงาน (Full Width) */}
          <div className="neu-flat p-5 sm:p-6 rounded-3xl border border-white/5 space-y-3.5" id="card-dimension-scope">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-orange-400 tracking-wide">
                    ๑.๓ ลักษณะและขอบเขตงาน
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    ข้อความรวมในรายงาน: ชื่องานก่อสร้าง + สถานที่ก่อสร้าง + รายละเอียดปริมาณงาน
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-lg neu-pressed text-orange-400 font-semibold border border-orange-500/20">
                ปริมาณงาน
              </span>
            </div>

            {/* Compact Dimension Calculator Bar - Unified Snug Toolbar (Zero Empty Void) */}
            <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 shrink-0">
                <Ruler className="w-3.5 h-3.5" />
                <span>ตัวช่วยคำนวณมิติ:</span>
              </div>

              {/* Compact Dimension Inputs in a snug inline row */}
              <div className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400">กว้าง:</span>
                <input
                  type="text"
                  value={data.dimensionWidth || ''}
                  onChange={(e) => updateField('dimensionWidth', toThaiDigits(e.target.value))}
                  placeholder="๔.๐๐"
                  className={`${inputBase} w-16 sm:w-20 text-center text-xs py-1 px-1.5`}
                />
                <span className="text-[11px] text-slate-400">ม.</span>
              </div>

              <div className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400">ยาว:</span>
                <input
                  type="text"
                  value={data.dimensionLength || ''}
                  onChange={(e) => updateField('dimensionLength', toThaiDigits(e.target.value))}
                  placeholder="๒๕๐.๐๐"
                  className={`${inputBase} w-16 sm:w-24 text-center text-xs py-1 px-1.5`}
                />
                <span className="text-[11px] text-slate-400">ม.</span>
              </div>

              <div className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400">หนา:</span>
                <input
                  type="text"
                  value={data.dimensionThickness || ''}
                  onChange={(e) => updateField('dimensionThickness', toThaiDigits(e.target.value))}
                  placeholder="๐.๑๕"
                  className={`${inputBase} w-16 sm:w-20 text-center text-xs py-1 px-1.5`}
                />
                <span className="text-[11px] text-slate-400">ม.</span>
              </div>

              <div className="flex items-center gap-1 bg-black/20 px-2.5 py-1 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400">พื้นที่:</span>
                <input
                  type="text"
                  value={data.dimensionArea || ''}
                  onChange={(e) => updateField('dimensionArea', toThaiDigits(e.target.value))}
                  placeholder="๑,๐๐๐.๐๐"
                  className={`${inputBase} w-20 sm:w-28 text-center text-xs py-1 px-1.5 font-bold text-orange-400`}
                />
                <span className="text-[11px] text-slate-400">ตร.ม.</span>
              </div>

              <button
                type="button"
                onClick={handleComposeDimensions}
                className="px-3 py-1.5 rounded-xl neu-button text-orange-400 hover:text-orange-300 text-xs font-bold border border-orange-500/25 flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm"
                title="รวมขนาดมิติข้างต้นเข้าสู่ช่องรายละเอียดปริมาณงาน"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ ใส่ในปริมาณงาน</span>
              </button>
            </div>

            {/* QTY Textarea: Compact & Ergonomic */}
            <div className="space-y-1.5">
              <label htmlFor="field-p5-qty" className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span>รายละเอียดปริมาณงานและขนาดก่อสร้าง</span>
                  <span className="text-orange-500 font-bold">*</span>
                </span>
                <span className="text-[10px] text-gray-400">
                  (เฉพาะขนาดและปริมาณงาน ไม่ต้องพิมพ์ชื่อโครงการซ้ำ)
                </span>
              </label>
              <textarea
                id="field-p5-qty"
                rows={2}
                value={data.quantity || ''}
                onChange={(e) => updateField('quantity', e.target.value)}
                placeholder="เช่น กว้าง ๔.๐๐ เมตร ยาว ๒๕๐.๐๐ เมตร หนา ๐.๑๕ เมตร หรือมีพื้นที่คอนกรีตไม่น้อยกว่า ๑,๐๐๐.๐๐ ตารางเมตร ไหล่ทางหินคลุกข้างละ ๐.๒๐ เมตร..."
                className={`${textareaBase} w-full`}
              />
            </div>

            {/* Live Preview of Section 1.3 */}
            <div className="p-3 rounded-2xl neu-pressed border border-white/5 space-y-1">
              <div className="text-[11px] font-bold text-orange-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ตัวอย่างข้อความรวมในรายงานจริง (ชื่อสัญญา + สถานที่ + ปริมาณงาน):</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-light">
                {fullScopeSummary || (
                  <span className="text-zinc-500 italic text-[11px]">
                    (กรอกชื่อสัญญา สถานที่ และปริมาณงาน เพื่อดูข้อความรวมที่นี่)
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Row 3: CARD 4: ๑.๔ คณะกรรมการตรวจรับพัสดุ */}
          <div className="neu-flat p-5 sm:p-6 rounded-3xl border border-white/5 space-y-4" id="card-committee-section">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-orange-400 tracking-wide">
                    ๑.๔ คณะกรรมการตรวจรับพัสดุ
                  </h3>
                  <p className="text-[11px] text-gray-400">คณะกรรมการตรวจรับพัสดุตามคำสั่งแต่งตั้ง (๓ ท่าน)</p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-lg neu-pressed text-orange-400 font-semibold border border-orange-500/20">
                ๓ ท่าน
              </span>
            </div>

            {/* 3 Committee Members: Compact, Balanced & Symmetrical */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* ๑. ประธานกรรมการ */}
              <div className="neu-flat p-3.5 sm:p-4 rounded-2xl border border-orange-500/25 space-y-2.5 bg-gradient-to-b from-orange-500/[0.04] to-transparent">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-orange-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    ๑. ประธานกรรมการ
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md neu-pressed text-orange-400 border border-orange-500/30">
                    ประธาน
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="field-com-p-name" className="text-[10px] font-medium text-slate-300">
                      ชื่อ-นามสกุล:
                    </label>
                    <input
                      id="field-com-p-name"
                      type="text"
                      value={data.committeeChairName || ''}
                      onChange={(e) => updateField('committeeChairName', e.target.value)}
                      placeholder="เช่น นายมนตรี ฟูฟ้า"
                      className={`${inputBase} w-full py-1.5`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="field-com-p-pos" className="text-[10px] font-medium text-slate-300">
                      ตำแหน่ง:
                    </label>
                    <input
                      id="field-com-p-pos"
                      type="text"
                      value={data.committeeChairPos || ''}
                      onChange={(e) => updateField('committeeChairPos', e.target.value)}
                      placeholder="เช่น ผู้อำนวยการกองช่าง"
                      className={`${inputBase} w-full py-1.5`}
                    />
                  </div>
                </div>
              </div>

              {/* ๒. กรรมการ ๑ */}
              <div className="neu-flat p-3.5 sm:p-4 rounded-2xl border border-white/5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    ๒. กรรมการตรวจรับพัสดุ ๑
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md neu-pressed text-slate-400 border border-white/10">
                    กรรมการ
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="field-com-1-name" className="text-[10px] font-medium text-slate-300">
                      ชื่อ-นามสกุล:
                    </label>
                    <input
                      id="field-com-1-name"
                      type="text"
                      value={data.committee1Name || ''}
                      onChange={(e) => updateField('committee1Name', e.target.value)}
                      placeholder="เช่น นางสาวธัญญารัตน์ กันทาสุข"
                      className={`${inputBase} w-full py-1.5`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="field-com-1-pos" className="text-[10px] font-medium text-slate-300">
                      ตำแหน่ง:
                    </label>
                    <input
                      id="field-com-1-pos"
                      type="text"
                      value={data.committee1Pos || ''}
                      onChange={(e) => updateField('committee1Pos', e.target.value)}
                      placeholder="เช่น นักวิชาการเงินและบัญชีชำนาญการ"
                      className={`${inputBase} w-full py-1.5`}
                    />
                  </div>
                </div>
              </div>

              {/* ๓. กรรมการ ๒ */}
              <div className="neu-flat p-3.5 sm:p-4 rounded-2xl border border-white/5 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    ๓. กรรมการตรวจรับพัสดุ ๒
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md neu-pressed text-slate-400 border border-white/10">
                    กรรมการ
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="field-com-2-name" className="text-[10px] font-medium text-slate-300">
                      ชื่อ-นามสกุล:
                    </label>
                    <input
                      id="field-com-2-name"
                      type="text"
                      value={data.committee2Name || ''}
                      onChange={(e) => updateField('committee2Name', e.target.value)}
                      placeholder="เช่น นายศราวุฒิ ทรายใจ"
                      className={`${inputBase} w-full py-1.5`}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="field-com-2-pos" className="text-[10px] font-medium text-slate-300">
                      ตำแหน่ง:
                    </label>
                    <input
                      id="field-com-2-pos"
                      type="text"
                      value={data.committee2Pos || ''}
                      onChange={(e) => updateField('committee2Pos', e.target.value)}
                      placeholder="เช่น นักวิชาการศึกษาชำนาญการ"
                      className={`${inputBase} w-full py-1.5`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: CARD 5: ๑.๕ ผู้ควบคุมงาน & CARD 6: ๑.๖ ผู้แทนผู้รับจ้าง Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* CARD 5: ๑.๕ ผู้ควบคุมงานของผู้ว่าจ้าง */}
            <div className="neu-flat p-5 sm:p-6 rounded-3xl border border-white/5 space-y-4" id="card-supervisor-section">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-orange-400 tracking-wide">
                      ๑.๕ ผู้ควบคุมงานของผู้ว่าจ้าง
                    </h3>
                    <p className="text-[11px] text-gray-400">นายช่างผู้ควบคุมงานของผู้ว่าจ้าง</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-lg neu-pressed text-orange-400 font-semibold border border-orange-500/20">
                  ผู้ควบคุมงาน
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label htmlFor="field-sup-name" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <span>๑. ชื่อ-นามสกุล</span>
                    <span className="text-orange-500 font-bold">*</span>
                  </label>
                  <input
                    id="field-sup-name"
                    type="text"
                    value={data.supervisorName || ''}
                    onChange={(e) => updateField('supervisorName', e.target.value)}
                    placeholder="เช่น นายธนิส บุญเป็ง"
                    className={`${inputBase} w-full text-orange-300 font-bold`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="field-sup-pos" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <span>ตำแหน่ง</span>
                  </label>
                  <input
                    id="field-sup-pos"
                    type="text"
                    value={data.supervisorPos || ''}
                    onChange={(e) => updateField('supervisorPos', e.target.value)}
                    placeholder="เช่น นายช่างโยธาอาวุโส"
                    className={`${inputBase} w-full`}
                  />
                </div>
              </div>
            </div>

            {/* CARD 6: ๑.๖ ผู้แทนผู้รับจ้าง */}
            <div className="neu-flat p-5 sm:p-6 rounded-3xl border border-white/5 space-y-4" id="card-contractor-rep-section">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
                    <HardHat className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-orange-400 tracking-wide">
                      ๑.๖ ผู้แทนผู้รับจ้าง
                    </h3>
                    <p className="text-[11px] text-gray-400">ผู้มีอำนาจลงนาม หรือ ช่างผู้แทน</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-lg neu-pressed text-orange-400 font-semibold border border-orange-500/20">
                  ผู้แทน
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="flex flex-col gap-1">
                  <label htmlFor="field-rep-1" className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                    <span>๑. ผู้แทนคนที่ ๑</span>
                    <span className="text-orange-500 font-bold">*</span>
                  </label>
                  <input
                    id="field-rep-1"
                    type="text"
                    value={data.rep1Name || ''}
                    onChange={(e) => updateField('rep1Name', e.target.value)}
                    placeholder="เช่น นายพรหมมินทร์ ปะระมา"
                    className={`${inputBase} w-full text-orange-300 font-medium`}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="field-rep-2" className="text-[11px] font-semibold text-slate-300">
                    <span>๒. ผู้แทนคนที่ ๒:</span>
                  </label>
                  <input
                    id="field-rep-2"
                    type="text"
                    value={data.rep2Name || ''}
                    onChange={(e) => updateField('rep2Name', e.target.value)}
                    placeholder="ระบุชื่อคนที่ ๒ (ถ้ามี)"
                    className={`${inputBase} w-full`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODE B: A4 PAPER DOCUMENT PREVIEW (เสมือนจริงตามเอกสารตัวอย่าง 100%) */}
      {/* ========================================================================= */}
      <div
        className={`${
          viewMode === 'a4' ? 'block' : 'hidden print:block'
        } bg-white text-neutral-900 p-8 sm:p-14 shadow-2xl rounded-sm font-sarabun max-w-[210mm] min-h-[297mm] mx-auto text-[15px] leading-[1.85] relative select-text border border-neutral-300 print:border-none print:shadow-none print:p-0 print:m-0`}
      >
        {/* Document Main Heading */}
        <div className="font-bold text-xl text-black mb-5 tracking-wide">
          ๑.ข้อมูลเกี่ยวกับงาน
        </div>

        {/* ๑.๑ ผู้ดำเนินการ */}
        <div className="mb-5 text-[15px]">
          <div className="font-bold text-black mb-1.5">๑.๑ ผู้ดำเนินการ</div>
          <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[150px_1fr] gap-y-1 pl-8">
            <span className="text-neutral-800">ผู้ว่าจ้าง</span>
            <span className="text-black font-medium">{data.employerName || 'องค์การบริหารส่วนตำบลใหม่พัฒนา'}</span>

            <span className="text-neutral-800">ผู้ออกแบบ</span>
            <span className="text-black font-medium">{data.designerName || 'กองช่างองค์การบริหารส่วนตำบลใหม่พัฒนา'}</span>

            <span className="text-neutral-800">ผู้รับจ้าง</span>
            <span className="text-black font-bold">{data.contractorName || '...................................................'}</span>

            <span className="text-neutral-800">ที่อยู่</span>
            <span className="text-black">{data.contractorAddress || '...................................................'}</span>
          </div>
        </div>

        {/* ๑.๒ สัญญาจ้าง */}
        <div className="mb-5 text-[15px]">
          <div className="font-bold text-black mb-1.5">๑.๒ สัญญาจ้าง</div>
          <div className="grid grid-cols-[160px_1fr] sm:grid-cols-[180px_1fr] gap-y-1 pl-8">
            <span className="text-neutral-800">ชื่อสัญญา</span>
            <span className="text-black font-bold">{data.projectName || '...................................................'}</span>

            <span className="text-neutral-800">สถานที่ก่อสร้าง</span>
            <span className="text-black">{data.location || '...................................................'}</span>

            <span className="text-neutral-800">สัญญาจ้าง</span>
            <span className="text-black">
              เลขที่ <span className="font-bold">{data.contractNo ? toThaiDigits(data.contractNo) : '...................'}</span>
              <span className="mx-3">ลงวันที่</span>
              <span>{data.contractDate ? toThaiDigits(data.contractDate) : '.......................................'}</span>
            </span>

            <span className="text-neutral-800">เริ่มสัญญาจ้าง</span>
            <span className="text-black">
              ลงวันที่ <span>{data.wsDate || data.startDate ? toThaiDigits(data.wsDate || data.startDate) : '.......................................'}</span>
            </span>

            <span className="text-neutral-800">สิ้นสุดสัญญาจ้าง</span>
            <span className="text-black">
              ลงวันที่ <span>{data.contractEndDate ? toThaiDigits(data.contractEndDate) : '.......................................'}</span>
            </span>

            <span className="text-neutral-800">ระยะเวลาก่อสร้างรวม</span>
            <span className="text-black">
              <span>{data.totalDays ? toThaiDigits(data.totalDays) : '.....'}</span> วัน
            </span>

            <span className="text-neutral-800">จำนวนงวดงานตามสัญญา</span>
            <span className="text-black">
              <span>{data.installN ? toThaiDigits(data.installN) : '.....'}</span>
            </span>

            <span className="text-neutral-800">ต่อสัญญาถึงวันที่</span>
            <span className="text-black">
              <span>{data.extendedEndDate ? toThaiDigits(data.extendedEndDate) : '-'}</span>
            </span>

            <span className="text-neutral-800">รวมระยะเวลาที่ต่อสัญญา</span>
            <span className="text-black">
              <span>{data.extendedDays ? toThaiDigits(data.extendedDays) : '-'}</span>
            </span>

            <span className="text-neutral-800">ราคาก่อสร้าง</span>
            <span className="text-black">
              <span className="font-bold">{data.constructionCost ? toThaiDigits(data.constructionCost) : '...................'}</span> บาท
              {costTextCalculated && (
                <span className="ml-3 text-neutral-800 font-normal">
                  ({costTextCalculated})
                </span>
              )}
            </span>

            <span className="text-neutral-800">ค่าปรับวันละ</span>
            <span className="text-black">
              <span>{data.finePerDay ? toThaiDigits(data.finePerDay) : '...................'}</span> บาท
              {fineTextCalculated && (
                <span className="ml-3 text-neutral-800 font-normal">
                  ({fineTextCalculated})
                </span>
              )}
            </span>
          </div>
        </div>

        {/* ๑.๓ ลักษณะและขอบเขตงาน */}
        <div className="mb-5 text-[15px]">
          <div className="font-bold text-black mb-1.5">๑.๓ ลักษณะและขอบเขตงาน</div>
          <div className="pl-8 text-justify leading-relaxed">
            {fullScopeSummary ? (
              <span className="text-black">{fullScopeSummary}</span>
            ) : (
              <span className="text-neutral-400 italic">
                ...................................................................................................................................................................................
              </span>
            )}
          </div>
        </div>

        {/* ๑.๔ คณะกรรมการตรวจรับพัสดุ */}
        <div className="mb-5 text-[15px]">
          <div className="font-bold text-black mb-1.5">๑.๔ คณะกรรมการตรวจรับพัสดุ</div>
          <div className="space-y-1 pl-8">
            <div className="grid grid-cols-[24px_210px_220px_1fr] items-baseline">
              <span>๑.</span>
              <span className="font-bold">{data.committeeChairName || '...........................................'}</span>
              <span>{data.committeeChairPos || '...........................................'}</span>
              <span className="font-bold">ประธานกรรมการ</span>
            </div>

            <div className="grid grid-cols-[24px_210px_220px_1fr] items-baseline">
              <span>๒.</span>
              <span>{data.committee1Name || '...........................................'}</span>
              <span>{data.committee1Pos || '...........................................'}</span>
              <span>กรรมการ</span>
            </div>

            <div className="grid grid-cols-[24px_210px_220px_1fr] items-baseline">
              <span>๓.</span>
              <span>{data.committee2Name || '...........................................'}</span>
              <span>{data.committee2Pos || '...........................................'}</span>
              <span>กรรมการ</span>
            </div>
          </div>
        </div>

        {/* ๑.๕ ผู้ควบคุมงานของผู้ว่าจ้าง */}
        <div className="mb-5 text-[15px]">
          <div className="font-bold text-black mb-1.5">๑.๕ ผู้ควบคุมงานของผู้ว่าจ้าง</div>
          <div className="pl-8">
            <div className="grid grid-cols-[24px_210px_1fr] items-baseline">
              <span>๑.</span>
              <span className="font-bold">{data.supervisorName || '...........................................'}</span>
              <span>ผู้ควบคุมงาน</span>
            </div>
          </div>
        </div>

        {/* ๑.๖ ผู้แทนผู้รับจ้าง */}
        <div className="mb-2 text-[15px]">
          <div className="font-bold text-black mb-1.5">๑.๖ ผู้แทนผู้รับจ้าง</div>
          <div className="space-y-1 pl-8">
            <div className="grid grid-cols-[24px_1fr] items-baseline">
              <span>๑</span>
              <span>{data.rep1Name || '...........................................'}</span>
            </div>

            <div className="grid grid-cols-[24px_1fr] items-baseline">
              <span>๒.</span>
              <span>{data.rep2Name || '...........................................'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Step Navigation Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-white/5 print:hidden">
        {onNavigatePrev && (
          <button
            type="button"
            onClick={onNavigatePrev}
            className="px-4 py-2.5 rounded-2xl neu-button text-gray-300 hover:text-white text-xs font-bold flex items-center gap-2 border border-white/5 active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>ย้อนกลับ: รายงานประจำเดือน (หน้า ๔)</span>
          </button>
        )}

        {onNavigateNext && (
          <button
            type="button"
            onClick={onNavigateNext}
            className="px-5 py-2.5 rounded-2xl neu-orange-btn text-white text-xs font-bold flex items-center gap-2 active:scale-95 shadow-md transition-all cursor-pointer ml-auto"
          >
            <span>ถัดไป: สรุปสะสมรายเดือน (หน้า ๖)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};