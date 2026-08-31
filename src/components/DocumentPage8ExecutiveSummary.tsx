import React from 'react';
import { ReportData } from '../types';
import { resetPage8Data } from '../utils/pageResetHelpers';
import { ClearPageButton } from './ClearPageButton';
import {
  TrendingUp,
  Coins,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ArrowRight,
  FileCheck,
} from 'lucide-react';
import { toThaiDigits } from '../utils/weekUtils';

interface Props {
  data: ReportData;
  onChange?: (updatedData: ReportData) => void;
  onNavigatePrev?: () => void;
  onNavigateToExport?: () => void;
}

export const DocumentPage8ExecutiveSummary: React.FC<Props> = ({
  data,
  onChange,
  onNavigatePrev,
  onNavigateToExport,
}) => {
  const handleClearPage8 = () => {
    if (onChange) {
      onChange(resetPage8Data(data));
    }
  };

  // Derive progress from latest week or monthly rollup
  const activeWeek = data.weeks && data.weeks[data.activeWeekIndex || 0];
  const actualProgressPct = activeWeek?.workProgress?.cumulative ?? 20;
  const plannedProgressPct = 20;
  const variance = Number((actualProgressPct - plannedProgressPct).toFixed(2));
  const isAhead = variance >= 0;

  const costNum = parseFloat((data.constructionCost || '277000').replace(/,/g, '')) || 277000;
  const completedValue = (actualProgressPct / 100) * costNum;
  const disbursedAmountNum = parseFloat((data.disbursedAmount || '0').replace(/,/g, '')) || 0;
  const disbursedPct = costNum > 0 ? ((disbursedAmountNum / costNum) * 100).toFixed(1) : '0';

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('th-TH', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div id="page-8-executive-summary" className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Clear Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                สรุปผลโครงการ
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              ภาพรวมผลงานและความก้าวหน้าทางการเงิน
            </p>
          </div>
        </div>

        <ClearPageButton pageNumber={8} onClear={handleClearPage8} />
      </div>

      {/* EXECUTIVE DASHBOARD 4 BENTO CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>สรุปผลการดำเนินงานและสถานะเปรียบเทียบ</span>
          </div>

          <span className="text-xs text-slate-300 flex items-center gap-1.5 neu-pressed px-3 py-1 rounded-full border border-orange-500/20 text-orange-400">
            <Sparkles className="w-3.5 h-3.5" />
            ประเมินผลอัตโนมัติ
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Actual Progress */}
          <div className="neu-flat p-5 rounded-3xl space-y-2.5 border border-white/5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              ผลงานรวมสะสมจริง (Actual)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-orange-400">
              {toThaiDigits(actualProgressPct)}%
            </div>
            {/* Progress bar */}
            <div className="w-full h-2.5 rounded-full bg-black/40 p-0.5 overflow-hidden border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                style={{ width: `${Math.min(100, actualProgressPct)}%` }}
              />
            </div>
          </div>

          {/* Card 2: Planned Progress */}
          <div className="neu-flat p-5 rounded-3xl space-y-2.5 border border-white/5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              ผลงานตามแผนงาน (Planned)
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {toThaiDigits(plannedProgressPct)}%
            </div>
            <div className="text-xs text-slate-400">
              ความก้าวหน้าตามกรอบเวลาสัญญา
            </div>
          </div>

          {/* Card 3: Status Variance */}
          <div className="neu-flat p-5 rounded-3xl space-y-2.5 border border-white/5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              สถานะเปรียบเทียบ (Variance)
            </span>
            <div className={`text-2xl sm:text-3xl font-black ${isAhead ? 'text-emerald-400' : 'text-rose-400'}`}>
              {variance >= 0 ? `+${toThaiDigits(variance)}%` : `${toThaiDigits(variance)}%`}
            </div>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isAhead
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}
            >
              {isAhead ? '✓ เป็นไปตามแผนงาน' : '⚠ ช้ากว่าแผนงาน'}
            </span>
          </div>

          {/* Card 4: Remaining Days */}
          <div className="neu-flat p-5 rounded-3xl space-y-2.5 border border-white/5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              ระยะเวลาก่อสร้างคงเหลือ
            </span>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {toThaiDigits(data.remainingDays || '๕๓')} <span className="text-xs font-semibold text-slate-400">วัน</span>
            </div>
            <div className="text-xs text-slate-400">
              จากสัญญา {toThaiDigits(data.totalDays || '๖๐')} วัน
            </div>
          </div>
        </div>

        {/* Financial Metrics Row */}
        <div className="neu-flat p-6 rounded-3xl space-y-4 border border-white/5">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm border-b border-white/5 pb-3">
            <Coins className="w-4 h-4" />
            <span>สรุปมูลค่าการดำเนินงานและการเบิกจ่าย</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#141517] border border-white/5 shadow-inner">
              <span className="text-[11px] text-gray-400 block">มูลค่างานก่อสร้าง:</span>
              <div className="text-base font-black text-white mt-1">
                ฿{toThaiDigits(data.constructionCost || '๒๗๗,๐๐๐.๐๐')}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141517] border border-white/5 shadow-inner">
              <span className="text-[11px] text-gray-400 block">มูลค่างานที่แล้วเสร็จจริงสะสม:</span>
              <div className="text-base font-black text-orange-400 mt-1">
                ฿{toThaiDigits(formatCurrency(completedValue))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141517] border border-white/5 shadow-inner">
              <span className="text-[11px] text-gray-400 block">มูลค่าเบิกจ่ายเงินแล้ว:</span>
              <div className="text-base font-black text-emerald-400 mt-1">
                ฿{toThaiDigits(data.disbursedAmount || '๐.๐๐')} ({toThaiDigits(disbursedPct)}%)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Completion & Official Document Preview Action */}
      <div className="neu-flat p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-white/5">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ข้อมูลครบถ้วนพร้อมส่งออกเอกสาร Word (template1.docx)
          </h4>
          <p className="text-xs text-gray-400">
            ระบบจัดรูปแบบเอกสารราชการไทย เลขไทย ๑๐๐% พร้อมแมปตัวแปรทั้ง ๑๒๒ รายการอัตโนมัติ
          </p>
        </div>

        {onNavigateToExport && (
          <button
            type="button"
            onClick={onNavigateToExport}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl neu-orange-btn text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 active:scale-95 shadow-md cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>ไปยังศูนย์ดาวน์โหลด / ส่งออก Word</span>
          </button>
        )}
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
            <span>ย้อนกลับ: งวดงานและวัสดุ</span>
          </button>
        )}

        {onNavigateToExport && (
          <button
            type="button"
            onClick={onNavigateToExport}
            className="px-5 py-2.5 rounded-2xl neu-orange-btn text-white text-xs font-bold flex items-center gap-2 active:scale-95 shadow-md transition-all cursor-pointer ml-auto"
          >
            <span>ถัดไป: ดาวน์โหลด / พิมพ์</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
