import React from 'react';
import { ReportData, MonthlyRollupItem } from '../types';
import {
  FileText,
  UserCheck,
  TrendingUp,
  Sparkles,
  Calendar,
  Layers,
  ChevronLeft,
  ArrowRight,
  RotateCcw,
  Building,
} from 'lucide-react';
import {
  calculateMonthlyProgress,
  toThaiDigits,
  convertThaiDigitsToStandard,
  bahttext,
} from '../utils/weekUtils';

interface Props {
  data: ReportData;
  onChange?: (updatedData: ReportData) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
}

export const DocumentPage4Monthly: React.FC<Props> = ({
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

  const monthlyItems: MonthlyRollupItem[] =
    data.monthlyRollup && data.monthlyRollup.length === 3
      ? data.monthlyRollup
      : [
          {
            index: 1,
            label: data.monthlyRollup?.[0]?.label || 'งานเตรียมพื้นที่และปรับระดับคันทางเดิม',
            desc: data.monthlyRollup?.[0]?.desc || 'ถางป่าขุดตอและปรับเกรดดินเดิมตลอดสายทาง',
            weight_MW: data.monthlyRollup?.[0]?.weight_MW ?? 20,
            prevCum_MP: data.monthlyRollup?.[0]?.prevCum_MP ?? 0,
            thisMonth_MM: data.monthlyRollup?.[0]?.thisMonth_MM ?? 20,
          },
          {
            index: 2,
            label: data.monthlyRollup?.[1]?.label || 'งานชั้นพื้นทางหินคลุก หนา 0.15 ม.',
            desc: data.monthlyRollup?.[1]?.desc || 'ขนส่ง ลงหินคลุกและบดอัดแน่นด้วยรถบดสั่นสะเทือน',
            weight_MW: data.monthlyRollup?.[1]?.weight_MW ?? 25,
            prevCum_MP: data.monthlyRollup?.[1]?.prevCum_MP ?? 0,
            thisMonth_MM: data.monthlyRollup?.[1]?.thisMonth_MM ?? 25,
          },
          {
            index: 3,
            label: data.monthlyRollup?.[2]?.label || 'งานผิวจราจร คอร. หนา 0.15 ม. และถมไหล่ทาง',
            desc: data.monthlyRollup?.[2]?.desc || 'เทคอนกรีตผสมเสร็จ ผูกเหล็กไวร์เมช และถมไหล่ทางข้างละ 0.20 ม.',
            weight_MW: data.monthlyRollup?.[2]?.weight_MW ?? 55,
            prevCum_MP: data.monthlyRollup?.[2]?.prevCum_MP ?? 0,
            thisMonth_MM: data.monthlyRollup?.[2]?.thisMonth_MM ?? 55,
          },
        ];

  const monthlyCalc = calculateMonthlyProgress(monthlyItems);

  const handleUpdateMonthlyItem = (
    index: number,
    field: keyof MonthlyRollupItem,
    value: any
  ) => {
    if (!onChange) return;
    const updated = monthlyItems.map((item, idx) => {
      if (idx === index) {
        const newItem = { ...item, [field]: value };
        const mp = Number(newItem.prevCum_MP) || 0;
        const mm = Number(newItem.thisMonth_MM) || 0;
        const mw = Number(newItem.weight_MW) || 0;
        newItem.cum_MC = Number((mp + mm).toFixed(2));
        newItem.total_MR = Number(((mw * newItem.cum_MC) / 100).toFixed(2));
        return newItem;
      }
      return item;
    });
    onChange({ ...data, monthlyRollup: updated });
  };

  const handleResetMonthlyData = () => {
    if (!onChange) return;
    if (confirm('คุณต้องการรีเซ็ตข้อมูลรายงานประจำเดือนเป็นค่าเริ่มต้นหรือไม่?')) {
      onChange({
        ...data,
        rptMonth: '',
        monthlyRollup: [
          { index: 1, label: '', desc: '', weight_MW: 100, prevCum_MP: 0, thisMonth_MM: 0 },
          { index: 2, label: '', desc: '', weight_MW: 0, prevCum_MP: 0, thisMonth_MM: 0 },
          { index: 3, label: '', desc: '', weight_MW: 0, prevCum_MP: 0, thisMonth_MM: 0 },
        ],
      });
    }
  };

  const inputClass =
    'w-full px-3.5 py-2.5 rounded-2xl bg-[#141517] text-slate-100 placeholder:text-zinc-500 text-xs sm:text-sm outline-none border border-white/5 shadow-[inset_3px_3px_6px_#0a0b0c,inset_-2px_-2px_5px_rgba(255,255,255,0.03)] focus:border-orange-500/50 transition-all antialiased';

  return (
    <div id="page-4-monthly-memo" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Title Bar & Action Capsule */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                บันทึกข้อความ (รายงานประจำเดือน — หน้า ๔)
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full neu-pressed text-orange-400 font-bold border border-orange-500/30">
                Group G (template1.docx)
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              สรุปภาพรวมผลงานรายเดือน สะสม ๓ รายการหลัก พร้อมผู้ลงนามรับรอง
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleResetMonthlyData}
            className="px-3 py-2 rounded-2xl neu-button text-gray-300 hover:text-rose-400 text-xs font-semibold flex items-center gap-1.5 border border-white/5 active:scale-95 transition-all cursor-pointer"
            title="ล้างข้อมูลหน้า 4"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>ล้างข้อมูลหน้า ๔</span>
          </button>
        </div>
      </div>

      {/* Report Scope & Period Details Card */}
      <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-5">
        <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm border-b border-white/5 pb-3">
          <Calendar className="w-4 h-4" />
          <span>ขอบเขตและรอบระยะเวลาของรายงานประจำเดือน</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{RPT_MONTH}}">
              รายงานประจำเดือน (RPT_MONTH):
              <span className="text-orange-500 font-bold ml-1">*</span>
            </label>
            <input
              type="text"
              id="field_monthly_rpt_month"
              value={data.rptMonth || ''}
              onChange={(e) => updateField('rptMonth', toThaiDigits(e.target.value))}
              placeholder="เช่น กรกฎาคม ๒๕๖๙"
              className={`${inputClass} font-bold text-orange-300`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{START}}">
              ตั้งแต่วันที่ (START):
            </label>
            <input
              type="text"
              id="field_monthly_start_date"
              value={data.startDate || ''}
              onChange={(e) => updateField('startDate', toThaiDigits(e.target.value))}
              placeholder="เช่น ๓๐ มิถุนายน ๒๕๖๙"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{END}}">
              ถึงวันที่ (END):
            </label>
            <input
              type="text"
              id="field_monthly_end_date"
              value={data.endDate || ''}
              onChange={(e) => updateField('endDate', toThaiDigits(e.target.value))}
              placeholder="เช่น ๕ กรกฎาคม ๒๕๖๙"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{PROJECT}}">
              โครงการ / งานก่อสร้าง:
            </label>
            <input
              type="text"
              id="field_monthly_project_name"
              value={data.projectName || ''}
              onChange={(e) => updateField('projectName', e.target.value)}
              placeholder="ชื่อโครงการก่อสร้าง..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{LOCATION}}">
              สถานที่ก่อสร้าง:
            </label>
            <input
              type="text"
              id="field_monthly_location"
              value={data.location || ''}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="สถานที่ก่อสร้าง..."
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{C_NO}}">
              สัญญาจ้างเลขที่:
            </label>
            <input
              type="text"
              id="field_monthly_contract_no"
              value={data.contractNo || ''}
              onChange={(e) => updateField('contractNo', toThaiDigits(e.target.value))}
              placeholder="เช่น ๓๐/๒๕๖๙"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{WS_DATE}}">
              วันที่เริ่มต้นสัญญา:
            </label>
            <input
              type="text"
              id="field_monthly_ws_date"
              value={data.wsDate || data.startDate || ''}
              onChange={(e) => updateField('wsDate', toThaiDigits(e.target.value))}
              placeholder="เช่น ๓๐ มิถุนายน ๒๕๖๙"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5" title="แมปกับตัวแปร Word: {{C_END}}">
              วันที่สิ้นสุดสัญญา:
            </label>
            <input
              type="text"
              id="field_monthly_c_end"
              value={data.contractEndDate || ''}
              onChange={(e) => updateField('contractEndDate', toThaiDigits(e.target.value))}
              placeholder="เช่น ๒๘ สิงหาคม ๒๕๖๙"
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Auto-calculated Summary Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>ตารางสรุปผลการดำเนินงานประจำเดือน (คำนวณอัตโนมัติ)</span>
          </div>
          <span className="text-[11px] px-3 py-1 rounded-full neu-pressed text-orange-400 font-bold flex items-center gap-1 border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            คำนวณอัตโนมัติ
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {/* 1: Current Actual % MCP */}
          <div className="neu-flat p-4 rounded-3xl space-y-1.5 border border-white/5" id="stat-monthly-progress">
            <span className="text-[11px] font-bold text-slate-400 block">
              % ผลงานสะสมจริง (MCP)
            </span>
            <div className="text-xl sm:text-2xl font-black text-orange-400">
              {toThaiDigits(monthlyCalc.MCP)}%
            </div>
            <span className="text-[10px] text-gray-400 block">ดึงจากผลงานรวม MT</span>
          </div>

          {/* 2: สัดส่วนงานรวม (MW_SUM) */}
          <div className="neu-flat p-4 rounded-3xl space-y-1.5 border border-white/5" id="stat-monthly-mw-sum">
            <span className="text-[11px] font-bold text-slate-400 block">
              สัดส่วนงานรวม (MW_SUM)
            </span>
            <div className={`text-xl sm:text-2xl font-black ${monthlyCalc.MW_SUM === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {toThaiDigits(monthlyCalc.MW_SUM)}%
            </div>
            <span className="text-[10px] text-gray-400 block">
              {monthlyCalc.MW_SUM === 100 ? 'สัดส่วนครบ ๑๐๐% พอดี' : 'ควรแบ่งให้ครบ ๑๐๐%'}
            </span>
          </div>

          {/* 3: Remaining Days */}
          <div className="neu-flat p-4 rounded-3xl space-y-1.5 border border-white/5" id="stat-monthly-days">
            <span className="text-[11px] font-bold text-slate-400 block">
              ระยะเวลาก่อสร้างคงเหลือ
            </span>
            <div className="text-xl sm:text-2xl font-black text-white">
              {toThaiDigits(data.remainingDays || '๕๓')} <span className="text-xs font-normal text-gray-400">วัน</span>
            </div>
            <span className="text-[10px] text-gray-400 block">จากสัญญา {toThaiDigits(data.totalDays || '๖๐')} วัน</span>
          </div>

          {/* 4: ค่าก่อสร้างตามสัญญา */}
          <div className="neu-flat p-4 rounded-3xl space-y-1.5 border border-white/5" id="stat-monthly-cost">
            <span className="text-[11px] font-bold text-slate-400 block">
              ค่าก่อสร้างตามสัญญา (COST)
            </span>
            <div className="text-lg sm:text-xl font-black text-emerald-400">
              ฿{toThaiDigits(data.constructionCost || '๒๗๗,๐๐๐.๐๐')}
            </div>
            <span className="text-[10px] text-gray-400 block">
              งบประมาณ: ฿{toThaiDigits(data.budgetAmount || data.constructionCost || '๒๗๗,๐๐๐.๐๐')}
            </span>
          </div>
        </div>
      </div>

      {/* Group G Table: Monthly Rollup (3 Fixed Rows) */}
      <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm">
            <Layers className="w-4 h-4" />
            <span>ตารางผลการดำเนินงานประจำเดือน ๓ รายการ (Group G: MNi, MWi, MPi, MMi, MCi, MRi)</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left min-w-[780px]">
            <thead>
              <tr className="text-gray-400 border-b border-white/5 text-center">
                <th className="py-2.5 px-2 w-12 neu-pressed rounded-l-2xl border border-white/5">ที่ (MN)</th>
                <th className="py-2.5 px-3 text-left neu-pressed border border-white/5">หัวข้อ / รายละเอียดงาน (MO_LABEL & MO_DESC)</th>
                <th className="py-2.5 px-2 w-24 neu-pressed border border-white/5">สัดส่วนงาน% (MW)</th>
                <th className="py-2.5 px-2 w-24 neu-pressed border border-white/5">ถึงเดือนก่อน% (MP)</th>
                <th className="py-2.5 px-2 w-24 neu-pressed border border-orange-500/30 text-orange-400">ในเดือนนี้% (MM)</th>
                <th className="py-2.5 px-2 w-24 neu-pressed border border-white/5">สะสม% (MC)</th>
                <th className="py-2.5 px-2 w-24 neu-pressed rounded-r-2xl border border-white/5">ผลงานรวม% (MR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {monthlyItems.map((item, idx) => {
                const mp = Number(item.prevCum_MP) || 0;
                const mm = Number(item.thisMonth_MM) || 0;
                const mw = Number(item.weight_MW) || 0;
                const mc = Number((mp + mm).toFixed(2));
                const mr = Number(((mw * mc) / 100).toFixed(2));

                return (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                    {/* MN */}
                    <td className="py-3 px-2 text-center font-bold text-orange-400">
                      {toThaiDigits(idx + 1)}
                    </td>

                    {/* MO_LABEL & MO_DESC */}
                    <td className="py-3 px-3 space-y-1.5">
                      <input
                        type="text"
                        value={item.label || ''}
                        onChange={(e) => handleUpdateMonthlyItem(idx, 'label', e.target.value)}
                        placeholder={`หัวข้องานรายการที่ ${idx + 1}...`}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#141517] text-white text-xs font-semibold border border-white/5 shadow-inner focus:border-orange-500/50 outline-none"
                      />
                      <input
                        type="text"
                        value={item.desc || ''}
                        onChange={(e) => handleUpdateMonthlyItem(idx, 'desc', e.target.value)}
                        placeholder={`รายละเอียดการดำเนินงานรายการที่ ${idx + 1}...`}
                        className="w-full px-3 py-1.5 rounded-xl bg-[#141517] text-gray-300 text-[11px] border border-white/5 shadow-inner focus:border-orange-500/50 outline-none"
                      />
                    </td>

                    {/* MW (สัดส่วน) */}
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.weight_MW !== undefined ? item.weight_MW : ''}
                        onChange={(e) => handleUpdateMonthlyItem(idx, 'weight_MW', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full text-center py-2 rounded-xl bg-[#141517] text-white text-xs font-bold border border-white/5 shadow-inner focus:border-orange-500/50 outline-none"
                      />
                    </td>

                    {/* MP (ถึงเดือนก่อน) */}
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.prevCum_MP !== undefined ? item.prevCum_MP : ''}
                        onChange={(e) => handleUpdateMonthlyItem(idx, 'prevCum_MP', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full text-center py-2 rounded-xl bg-[#141517] text-gray-400 text-xs font-semibold border border-white/5 shadow-inner focus:border-orange-500/50 outline-none"
                      />
                    </td>

                    {/* MM (ในเดือนนี้ - Input หลัก) */}
                    <td className="py-3 px-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.thisMonth_MM !== undefined ? item.thisMonth_MM : ''}
                        onChange={(e) => handleUpdateMonthlyItem(idx, 'thisMonth_MM', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full text-center py-2 rounded-xl bg-[#141517] text-orange-300 text-xs font-black border border-orange-500/40 bg-orange-500/5 shadow-inner focus:border-orange-500 outline-none"
                      />
                    </td>

                    {/* MC (สะสม = MP + MM) */}
                    <td className="py-3 px-2 text-center font-bold text-emerald-400">
                      {toThaiDigits(mc)}%
                    </td>

                    {/* MR (ผลงานรวม = MW * MC / 100) */}
                    <td className="py-3 px-2 text-center font-black text-orange-400">
                      {toThaiDigits(mr)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-white/10 font-bold text-sm bg-white/[0.02]">
                <td colSpan={2} className="py-3 px-3 text-right text-gray-300">
                  รวมยอดสุทธิ:
                </td>
                <td className={`py-3 px-2 text-center font-black ${monthlyCalc.MW_SUM === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {toThaiDigits(monthlyCalc.MW_SUM)}%
                </td>
                <td colSpan={3} className="py-3 px-2 text-right text-gray-400 text-xs">
                  ผลงานรวมสะสมทั้งโครงการ (MT / MCP):
                </td>
                <td className="py-3 px-2 text-center font-black text-orange-400 text-base">
                  {toThaiDigits(monthlyCalc.MT)}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Signatories Section */}
      <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-5">
        <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm border-b border-white/5 pb-3">
          <UserCheck className="w-4 h-4" />
          <span>ผู้ลงนามรับรองรายงานประจำเดือน (ดึงข้อมูลร่วมกับหน้าข้อมูลสัญญา)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Supervisor */}
          <div className="p-4 rounded-2xl bg-[#141517] border border-white/5 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400">ผู้ควบคุมงาน</span>
              <span className="text-[11px] text-gray-400">ผู้จัดทำรายงาน (SUP_NAME)</span>
            </div>
            <input
              type="text"
              id="field_monthly_sup_name"
              value={data.supervisorName || ''}
              onChange={(e) => updateField('supervisorName', e.target.value)}
              placeholder="ชื่อ-สกุล ผู้ควบคุมงาน"
              className={inputClass}
            />
            <input
              type="text"
              id="field_monthly_sup_pos"
              value={data.supervisorPos || ''}
              onChange={(e) => updateField('supervisorPos', e.target.value)}
              placeholder="ตำแหน่ง (SUP_POS)"
              className={inputClass}
            />
          </div>

          {/* Committee Chair */}
          <div className="p-4 rounded-2xl bg-[#141517] border border-white/5 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-400">ประธานกรรมการตรวจรับพัสดุ</span>
              <span className="text-[11px] text-gray-400">ประธานกรรมการ (COM_P_NAME)</span>
            </div>
            <input
              type="text"
              id="field_monthly_comp_name"
              value={data.committeeChairName || ''}
              onChange={(e) => updateField('committeeChairName', e.target.value)}
              placeholder="ชื่อ-สกุล ประธานกรรมการ"
              className={inputClass}
            />
            <input
              type="text"
              id="field_monthly_comp_pos"
              value={data.committeeChairPos || ''}
              onChange={(e) => updateField('committeeChairPos', e.target.value)}
              placeholder="ตำแหน่ง (COM_P_POS)"
              className={inputClass}
            />
          </div>

          {/* Committee Member 1 */}
          <div className="p-4 rounded-2xl bg-[#141517] border border-white/5 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">กรรมการตรวจรับพัสดุ (คนที่ ๑)</span>
              <span className="text-[11px] text-gray-400">กรรมการ (COM_1_NAME)</span>
            </div>
            <input
              type="text"
              id="field_monthly_com1_name"
              value={data.committee1Name || ''}
              onChange={(e) => updateField('committee1Name', e.target.value)}
              placeholder="ชื่อ-สกุล กรรมการคนที่ ๑"
              className={inputClass}
            />
            <input
              type="text"
              id="field_monthly_com1_pos"
              value={data.committee1Pos || ''}
              onChange={(e) => updateField('committee1Pos', e.target.value)}
              placeholder="ตำแหน่ง (COM_1_POS)"
              className={inputClass}
            />
          </div>

          {/* Committee Member 2 */}
          <div className="p-4 rounded-2xl bg-[#141517] border border-white/5 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">กรรมการตรวจรับพัสดุ (คนที่ ๒)</span>
              <span className="text-[11px] text-gray-400">กรรมการ (COM_2_NAME)</span>
            </div>
            <input
              type="text"
              id="field_monthly_com2_name"
              value={data.committee2Name || ''}
              onChange={(e) => updateField('committee2Name', e.target.value)}
              placeholder="ชื่อ-สกุล กรรมการคนที่ ๒"
              className={inputClass}
            />
            <input
              type="text"
              id="field_monthly_com2_pos"
              value={data.committee2Pos || ''}
              onChange={(e) => updateField('committee2Pos', e.target.value)}
              placeholder="ตำแหน่ง (COM_2_POS)"
              className={inputClass}
            />
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
            <span>ย้อนกลับ: บันทึกรายวัน (หน้า ๓)</span>
          </button>
        )}

        {onNavigateNext && (
          <button
            type="button"
            onClick={onNavigateNext}
            className="px-5 py-2.5 rounded-2xl neu-orange-btn text-white text-xs font-bold flex items-center gap-2 active:scale-95 shadow-md transition-all cursor-pointer ml-auto"
          >
            <span>ถัดไป: ศูนย์ส่งออกเอกสาร (หน้า ๕)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
