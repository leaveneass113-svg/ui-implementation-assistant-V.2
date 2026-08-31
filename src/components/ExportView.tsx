import React, { useState } from 'react';
import { Printer, Download, CheckCircle2, FileType, Sparkles, Layers } from 'lucide-react';
import { ReportData, WeekData } from '../types';
import { generateDocxBlob, downloadFile } from '../utils/wordExport';
import { toThaiDigits } from '../utils/weekUtils';

interface Props {
  data: ReportData;
  onSelectWeek?: (index: number) => void;
}

export const ExportView: React.FC<Props> = ({ data, onSelectWeek }) => {
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [docxSuccess, setDocxSuccess] = useState(false);

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

  const getSafeFileName = (weekNo: string, ext: string) => {
    const rawName = data.projectName || 'รายงานผลการปฏิบัติงาน';
    const cleanName = rawName.replace(/[/\\?%*:|"<>]/g, '_').substring(0, 35);
    const weekStr = weekNo ? `_สัปดาห์ที่_${toThaiDigits(weekNo)}` : '';
    return `${cleanName}${weekStr}.${ext}`;
  };

  const handleExportDocx = async () => {
    try {
      setIsExportingDocx(true);
      setDocxSuccess(false);
      const blob = await generateDocxBlob(data, activeIndex);
      const filename = getSafeFileName(currentWeek?.weekNo || String(activeIndex + 1), 'docx');
      downloadFile(blob, filename);
      setDocxSuccess(true);
      setTimeout(() => setDocxSuccess(false), 4000);
    } catch (err: any) {
      console.error('Failed to export .docx', err);
      alert(`เกิดข้อผิดพลาดในการสร้างไฟล์ Word (.docx): ${err?.message || 'กรุณาลองใหม่อีกครั้ง'}`);
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neu-pressed text-orange-400 text-xs font-bold border border-orange-500/20 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ศูนย์ส่งออกและพิมพ์เอกสารมาตรฐานราชการ (template1.docx)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">ดาวน์โหลดและพิมพ์เอกสาร</h2>
        <p className="text-gray-400 max-w-lg mx-auto text-xs sm:text-sm">
          สร้างเอกสาร Microsoft Word (.docx) ตามแม่แบบทางการ template1.docx หรือสั่งพิมพ์เป็น PDF ขนาด A4 มาตรฐาน
        </p>
      </div>

      {/* Week Selection Card for Export */}
      <div className="neu-flat p-5 sm:p-6 rounded-3xl border border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              เลือกสัปดาห์ส่งออก:
              <span className="text-orange-400">สัปดาห์ {toThaiDigits(currentWeek?.weekNo || activeIndex + 1)}</span>
            </div>
            <div className="text-xs text-gray-400 mt-0.5">
              ช่วงวันที่: {currentWeek?.startDate || '-'} ถึง {currentWeek?.endDate || '-'} (สะสม: {toThaiDigits(currentWeek?.workProgress?.cumulative ?? 0)}%)
            </div>
          </div>
        </div>

        {weeks.length > 1 && (
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400 font-semibold">เปลี่ยนสัปดาห์:</label>
            <select
              value={activeIndex}
              onChange={(e) => onSelectWeek && onSelectWeek(parseInt(e.target.value, 10))}
              className="neu-pressed bg-[#1a1a1a] text-white text-xs font-bold rounded-2xl px-3.5 py-2.5 border border-white/10 focus:outline-none focus:border-orange-500/50"
            >
              {weeks.map((w, idx) => (
                <option key={`opt-w-${idx}`} value={idx} className="bg-[#181818] text-white">
                  สัปดาห์ {toThaiDigits(w.weekNo || idx + 1)} ({w.startDate ? w.startDate.split(' ')[0] + ' ' + (w.startDate.split(' ')[1] || '') : `ว.${toThaiDigits(idx + 1)}`})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Cards Grid: 2 Cards (.docx and PDF Print) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Word (.docx) powered by Docxtemplater & template1.docx */}
        <div className="neu-flat p-6 sm:p-7 rounded-3xl border border-white/5 flex flex-col justify-between items-center text-center group hover:border-orange-500/40 transition-all space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 mb-4 group-hover:scale-110 transition-transform bg-orange-500/10 border border-orange-500/20">
              <FileType className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-[11px] font-bold border border-orange-500/30 mb-2">
              แม่แบบราชการ V2 (.DOCX)
            </span>
            <h3 className="text-lg font-bold text-white mb-2">
              Microsoft Word (.docx)
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              เรนเดอร์ลงในแม่แบบทางการ <code className="text-orange-300">template1.docx</code> ครบทั้ง 3 หน้า (บันทึกข้อความ, ตารางผลงานแถวเดียว, และบันทึกรายวันพร้อมตารางแรงงาน)
            </p>
          </div>

          <button
            onClick={handleExportDocx}
            disabled={isExportingDocx}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              docxSuccess
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'neu-orange-btn text-white shadow-lg active:scale-95'
            }`}
          >
            {isExportingDocx ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs">กำลังผสานข้อมูลลงแม่แบบ...</span>
              </>
            ) : docxSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs">ดาวน์โหลด .docx สำเร็จ!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span className="text-xs">ดาวน์โหลด สัปดาห์ {toThaiDigits(currentWeek?.weekNo || activeIndex + 1)} (.docx)</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: PDF / Print */}
        <div className="neu-flat p-6 sm:p-7 rounded-3xl border border-white/5 flex flex-col justify-between items-center text-center group hover:border-emerald-500/40 transition-all space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl neu-pressed flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform bg-emerald-500/10 border border-emerald-500/20">
              <Printer className="w-8 h-8" />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 mb-2">
              PDF / DIRECT PRINT
            </span>
            <h3 className="text-lg font-bold text-white mb-2">พิมพ์ / บันทึกเป็น PDF</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              สั่งพิมพ์รายงาน 3 หน้าขนาด A4 มาตรฐานราชการ หรือบันทึกเป็นไฟล์ PDF ทันทีผ่านหน้าต่างพิมพ์ของเบราว์เซอร์
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="w-full py-3.5 px-4 rounded-2xl font-bold neu-button border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span className="text-xs">เปิดหน้าต่างพิมพ์ / บันทึก PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
