import React from 'react';
import { ReportData } from '../types';
import { resetPage5Data } from '../utils/pageResetHelpers';
import { ClearPageButton } from './ClearPageButton';
import {
  FileSpreadsheet,
  Building2,
  Users,
  HardHat,
  Compass,
  UserCheck,
  ChevronLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { toThaiDigits } from '../utils/weekUtils';

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

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-2xl bg-[#141517] text-slate-100 placeholder:text-zinc-500 text-xs sm:text-sm outline-none border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] focus:border-orange-500/50 transition-all antialiased';

  return (
    <div id="page-5-project-details" className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Clear Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                ข้อมูลโครงการและสัญญาจ้างฉบับเต็ม (หน้า ๕)
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full neu-pressed text-orange-400 font-bold border border-orange-500/30">
                รายละเอียดเชิงลึก
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              มิติขนาด รูปตัด ขอบเขตงาน คณะกรรมการ และผู้ควบคุมงาน
            </p>
          </div>
        </div>

        <ClearPageButton pageNumber={5} onClear={handleClearPage5} />
      </div>

      {/* Grid: CARD 1 & CARD 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: ๑.๑ วัตถุประสงค์และขอบเขตงานก่อสร้าง */}
        <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-orange-400 font-bold text-xs sm:text-sm">
            <Compass className="w-4 h-4 text-orange-400" />
            <span>๑.๑ วัตถุประสงค์และขอบเขตงานก่อสร้าง</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ความกว้าง (ม.):
              </label>
              <input
                type="text"
                value={data.dimensionWidth || ''}
                onChange={(e) => updateField('dimensionWidth', toThaiDigits(e.target.value))}
                placeholder="เช่น ๔.๐๐"
                className={`${inputClass} text-center font-bold`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ความยาว (ม.):
              </label>
              <input
                type="text"
                value={data.dimensionLength || ''}
                onChange={(e) => updateField('dimensionLength', toThaiDigits(e.target.value))}
                placeholder="เช่น ๑๕๐.๐๐"
                className={`${inputClass} text-center font-bold`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ความหนา (ม.):
              </label>
              <input
                type="text"
                value={data.dimensionThickness || ''}
                onChange={(e) => updateField('dimensionThickness', toThaiDigits(e.target.value))}
                placeholder="เช่น ๐.๑๕"
                className={`${inputClass} text-center font-bold`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                พื้นที่ (ตร.ม.):
              </label>
              <input
                type="text"
                value={data.dimensionArea || ''}
                onChange={(e) => updateField('dimensionArea', toThaiDigits(e.target.value))}
                placeholder="เช่น ๖๐๐.๐๐"
                className={`${inputClass} text-center font-bold text-orange-300`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{QTY}}">
              รายละเอียดปริมาณงานและขอบเขตโดยย่อ (QTY):
            </label>
            <textarea
              rows={3}
              value={data.quantity || data.scopeSummary || ''}
              onChange={(e) => updateField('quantity', e.target.value)}
              placeholder="ขนาดกว้าง ๓.๐๐ เมตร ยาว ๑๕๐.๐๐ เมตร หนา ๐.๑๕ เมตร..."
              className={`${inputClass} resize-none leading-relaxed`}
            />
          </div>
        </div>

        {/* CARD 2: ๑.๒ หน่วยงานเจ้าของโครงการและผู้ออกแบบ */}
        <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-orange-400 font-bold text-xs sm:text-sm">
            <Building2 className="w-4 h-4 text-orange-400" />
            <span>๑.๒ หน่วยงานเจ้าของโครงการและผู้ออกแบบ</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                หน่วยงานผู้ว่าจ้าง (Employer):
              </label>
              <input
                type="text"
                value={data.employerName || ''}
                onChange={(e) => updateField('employerName', e.target.value)}
                placeholder="เช่น องค์การบริหารส่วนตำบลใหม่พัฒนา"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ผู้ออกแบบ / กำหนดแบบ:
                </label>
                <input
                  type="text"
                  value={data.designerName || ''}
                  onChange={(e) => updateField('designerName', e.target.value)}
                  placeholder="เช่น กองช่าง อบต.ใหม่พัฒนา"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  ปีงบประมาณ:
                </label>
                <input
                  type="text"
                  value={data.budgetYear || ''}
                  onChange={(e) => updateField('budgetYear', toThaiDigits(e.target.value))}
                  placeholder="เช่น ๒๕๖๙"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: ๑.๓ ข้อมูลผู้รับจ้างก่อสร้าง */}
      <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-orange-400 font-bold text-xs sm:text-sm">
          <HardHat className="w-4 h-4 text-orange-400" />
          <span>๑.๓ ข้อมูลผู้รับจ้างก่อสร้าง (CONTRACTOR & CTR_ADDR)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{CONTRACTOR}}">
              ชื่อผู้รับจ้าง / ห้างหุ้นส่วน (CONTRACTOR):
            </label>
            <input
              type="text"
              value={data.contractorName || ''}
              onChange={(e) => updateField('contractorName', e.target.value)}
              placeholder="เช่น ห้างหุ้นส่วนจำกัด ชัยยุทธ ธุรกิจการโยธา"
              className={`${inputClass} font-bold text-orange-300`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{CTR_ADDR}}">
              ที่อยู่ผู้รับจ้าง (CTR_ADDR):
            </label>
            <input
              type="text"
              value={data.contractorAddress || ''}
              onChange={(e) => updateField('contractorAddress', e.target.value)}
              placeholder="บ้านเลขที่ ตำบล อำเภอ จังหวัด..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              เบอร์โทรศัพท์ผู้รับจ้าง:
            </label>
            <input
              type="text"
              value={data.contractorPhone || ''}
              onChange={(e) => updateField('contractorPhone', toThaiDigits(e.target.value))}
              placeholder="เช่น ๐๘๑-๒๓๔-๕๖๗๘"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              ผู้ควบคุมงานของผู้รับจ้าง (โฟร์แมน):
            </label>
            <input
              type="text"
              value={data.contractorSupervisor || ''}
              onChange={(e) => updateField('contractorSupervisor', e.target.value)}
              placeholder="ชื่อ-สกุล โฟร์แมนประจำหน้างาน"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* CARD 4: ๑.๔ คณะกรรมการตรวจรับพัสดุ */}
      <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-orange-400 font-bold text-xs sm:text-sm">
          <Users className="w-4 h-4 text-orange-400" />
          <span>๑.๔ คณะกรรมการตรวจรับพัสดุ (Group C)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Chair */}
          <div className="p-4 rounded-2xl bg-[#141517] border border-white/5 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400">๑. ประธานกรรมการ</span>
              <span className="text-[10px] text-gray-400">COM_P_NAME</span>
            </div>
            <input
              type="text"
              value={data.committeeChairName || ''}
              onChange={(e) => updateField('committeeChairName', e.target.value)}
              placeholder="ชื่อ-สกุล ประธานกรรมการ"
              className={inputClass}
            />
            <input
              type="text"
              value={data.committeeChairPos || ''}
              onChange={(e) => updateField('committeeChairPos', e.target.value)}
              placeholder="ตำแหน่ง (COM_P_POS)"
              className={inputClass}
            />
          </div>

          {/* Member 1 */}
          <div className="p-4 rounded-2xl bg-[#141517] border border-white/5 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">๒. กรรมการ (คนที่ ๑)</span>
              <span className="text-[10px] text-gray-400">COM_1_NAME</span>
            </div>
            <input
              type="text"
              value={data.committee1Name || ''}
              onChange={(e) => updateField('committee1Name', e.target.value)}
              placeholder="ชื่อ-สกุล กรรมการคนที่ ๑"
              className={inputClass}
            />
            <input
              type="text"
              value={data.committee1Pos || ''}
              onChange={(e) => updateField('committee1Pos', e.target.value)}
              placeholder="ตำแหน่ง (COM_1_POS)"
              className={inputClass}
            />
          </div>

          {/* Member 2 */}
          <div className="p-4 rounded-2xl bg-[#141517] border border-white/5 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">๓. กรรมการ (คนที่ ๒)</span>
              <span className="text-[10px] text-gray-400">COM_2_NAME</span>
            </div>
            <input
              type="text"
              value={data.committee2Name || ''}
              onChange={(e) => updateField('committee2Name', e.target.value)}
              placeholder="ชื่อ-สกุล กรรมการคนที่ ๒"
              className={inputClass}
            />
            <input
              type="text"
              value={data.committee2Pos || ''}
              onChange={(e) => updateField('committee2Pos', e.target.value)}
              placeholder="ตำแหน่ง (COM_2_POS)"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* CARD 5 & CARD 6 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 5: ผู้ควบคุมงาน */}
        <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-orange-400 font-bold text-xs sm:text-sm">
            <UserCheck className="w-4 h-4 text-orange-400" />
            <span>๑.๕ ผู้ควบคุมงานของผู้ว่าจ้าง (SUP_NAME & SUP_POS)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ชื่อ-สกุล ผู้ควบคุมงาน:
              </label>
              <input
                type="text"
                value={data.supervisorName || ''}
                onChange={(e) => updateField('supervisorName', e.target.value)}
                placeholder="ชื่อ-สกุล ผู้ควบคุมงาน"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                ตำแหน่งผู้ควบคุมงาน:
              </label>
              <input
                type="text"
                value={data.supervisorPos || ''}
                onChange={(e) => updateField('supervisorPos', e.target.value)}
                placeholder="ตำแหน่ง"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* CARD 6: ผู้แทนผู้รับจ้าง */}
        <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-orange-400 font-bold text-xs sm:text-sm">
            <HardHat className="w-4 h-4 text-orange-400" />
            <span>๑.๖ ผู้แทนผู้รับจ้าง (REP_1 & REP_2)</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{REP_1}}">
                ๑. ผู้แทนผู้รับจ้าง คนที่ ๑ (REP_1):
              </label>
              <input
                type="text"
                value={data.rep1Name || ''}
                onChange={(e) => updateField('rep1Name', e.target.value)}
                placeholder="ระบุชื่อผู้แทนผู้รับจ้าง คนที่ ๑"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{REP_2}}">
                ๒. ผู้แทนผู้รับจ้าง คนที่ ๒ (REP_2):
              </label>
              <input
                type="text"
                value={data.rep2Name || ''}
                onChange={(e) => updateField('rep2Name', e.target.value)}
                placeholder="ระบุชื่อผู้แทนผู้รับจ้าง คนที่ ๒ (ถ้ามี หรือใส่ -)"
                className={inputClass}
              />
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
            <span>ย้อนกลับ: รายงานรายเดือน (หน้า ๔)</span>
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
