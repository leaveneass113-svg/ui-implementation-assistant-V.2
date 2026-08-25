import React from 'react';
import {
  ReportData,
  MilestoneItem,
  MaterialTestItem,
  MaterialApprovalItem,
} from '../types';
import { resetPage7Data } from '../utils/pageResetHelpers';
import { ClearPageButton } from './ClearPageButton';
import {
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  FlaskConical,
  FileCheck2,
  Layers,
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

export const DocumentPage7MilestonesMaterials: React.FC<Props> = ({
  data,
  onChange,
  onNavigatePrev,
  onNavigateNext,
}) => {
  const milestones: MilestoneItem[] =
    data.milestones && data.milestones.length > 0
      ? data.milestones
      : [
          {
            id: 'ms-1',
            installmentNo: 1,
            description: 'ก่อสร้างถนนคอนกรีตเสริมเหล็ก กว้าง ๓.๐๐ ม. ยาว ๑๕๐.๐๐ ม. หนา ๐.๑๕ ม. แล้วเสร็จครบถ้วน',
            amount: 277000,
            contractDueDate: '๒๘ สิงหาคม ๒๕๖๙',
            actualFinishDate: '๒๕ สิงหาคม ๒๕๖๙',
            inspectionDate: '๒๘ สิงหาคม ๒๕๖๙',
            paymentStatus: 'disbursed',
            finishDateText: '๒๕ ส.ค. ๖๙',
            inspectionDateText: '๒๘ ส.ค. ๖๙',
            remarks: 'งวดเดียวจบ',
          },
        ];

  const materialTests: MaterialTestItem[] =
    data.materialTests && data.materialTests.length > 0
      ? data.materialTests
      : [
          {
            id: 'mt-1',
            item: 'รายงานผลการทดสอบการรับน้ำหนักและกำลังอัดคอนกรีต',
            sampleCount: '๓ แท่งตัวอย่าง',
            testDate: '๑๕ กรกฎาคม ๒๕๖๙',
            testDateText: '๑๕ ก.ค. ๖๙',
            testingAuthority: 'ศูนย์ทดสอบวัสดุมหาวิทยาลัย/หน่วยงานราชการ',
            location: 'ผิวจราจร กม. ๐+๐๕๐',
            result: 'passed',
            resultText: 'ผ่านเกณฑ์ (กำลังอัดได้ตามแบบ)',
            testCertNo: 'วส. ๑๒/๒๕๖๙',
          },
        ];

  const materialApprovals: MaterialApprovalItem[] =
    data.materialApprovals && data.materialApprovals.length > 0
      ? data.materialApprovals
      : [
          {
            id: 'ma-1',
            item: 'ขออนุมัติใช้ปูนซีเมนต์ปอร์ตแลนด์และเหล็กเสริมคอนกรีต',
            requestDate: '๓๐ มิถุนายน ๒๕๖๙',
            requestDateText: '๓๐ มิ.ย. ๖๙',
            reviewer: 'นายช่างผู้ควบคุมงาน / คณะกรรมการ',
            status: 'approved',
            decisionText: 'อนุมัติให้ใช้งานได้',
            approvalDate: '๒ กรกฎาคม ๒๕๖๙',
          },
        ];

  const handleClearPage7 = () => {
    if (onChange) {
      onChange(resetPage7Data(data));
    }
  };

  // Milestones Handlers
  const handleMilestoneChange = (idx: number, field: keyof MilestoneItem, value: any) => {
    if (!onChange) return;
    const updated = milestones.map((m, i) => (i === idx ? { ...m, [field]: value } : m));
    onChange({ ...data, milestones: updated });
  };

  const handleAddMilestone = () => {
    if (!onChange) return;
    const newNo = milestones.length + 1;
    const newM: MilestoneItem = {
      id: `ms-${Date.now()}`,
      installmentNo: newNo,
      description: `งวดงานที่ ${toThaiDigits(newNo)}...`,
      amount: 0,
      contractDueDate: '',
      actualFinishDate: '',
      inspectionDate: '',
      paymentStatus: 'pending',
      finishDateText: '',
      inspectionDateText: '',
    };
    onChange({ ...data, milestones: [...milestones, newM] });
  };

  const handleDeleteMilestone = (idx: number) => {
    if (!onChange) return;
    onChange({ ...data, milestones: milestones.filter((_, i) => i !== idx) });
  };

  // Material Tests Handlers
  const handleTestChange = (idx: number, field: keyof MaterialTestItem, value: any) => {
    if (!onChange) return;
    const updated = materialTests.map((t, i) => (i === idx ? { ...t, [field]: value } : t));
    onChange({ ...data, materialTests: updated });
  };

  const handleAddTest = () => {
    if (!onChange) return;
    const newT: MaterialTestItem = {
      id: `mt-${Date.now()}`,
      item: '',
      sampleCount: '',
      testDate: '',
      testDateText: '',
      testingAuthority: 'หน่วยงานทดสอบวัสดุ',
      location: 'พื้นที่ก่อสร้าง',
      result: 'passed',
      resultText: 'ผ่านเกณฑ์',
      testCertNo: '',
    };
    onChange({ ...data, materialTests: [...materialTests, newT] });
  };

  const handleDeleteTest = (idx: number) => {
    if (!onChange) return;
    onChange({ ...data, materialTests: materialTests.filter((_, i) => i !== idx) });
  };

  // Material Approvals Handlers
  const handleApprovalChange = (idx: number, field: keyof MaterialApprovalItem, value: any) => {
    if (!onChange) return;
    const updated = materialApprovals.map((a, i) => (i === idx ? { ...a, [field]: value } : a));
    onChange({ ...data, materialApprovals: updated });
  };

  const handleAddApproval = () => {
    if (!onChange) return;
    const newA: MaterialApprovalItem = {
      id: `ma-${Date.now()}`,
      item: '',
      requestDate: '',
      requestDateText: '',
      reviewer: 'ผู้ควบคุมงาน',
      status: 'approved',
      decisionText: 'อนุมัติ',
      approvalDate: '',
    };
    onChange({ ...data, materialApprovals: [...materialApprovals, newA] });
  };

  const handleDeleteApproval = (idx: number) => {
    if (!onChange) return;
    onChange({ ...data, materialApprovals: materialApprovals.filter((_, i) => i !== idx) });
  };

  return (
    <div id="page-7-milestones-materials" className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title & Clear Button */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                งวดงาน การตรวจรับ & ผลทดสอบวัสดุ (หน้า ๗)
              </h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full neu-pressed text-orange-400 font-bold border border-orange-500/30">
                Milestones & QA/QC
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              แผนการเบิกจ่ายค่างวดงาน รายงานผลการทดสอบวัสดุ และการขออนุมัติใช้วัสดุ
            </p>
          </div>
        </div>

        <ClearPageButton pageNumber={7} onClear={handleClearPage7} />
      </div>

      {/* SECTION 1: แผนการเบิกจ่ายค่างวดงานและการตรวจรับพัสดุ */}
      <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm">
            <Clock className="w-4 h-4" />
            <span>๑. แผนการเบิกจ่ายค่างวดงานและการตรวจรับพัสดุ (Milestones)</span>
          </div>

          <button
            type="button"
            onClick={handleAddMilestone}
            className="px-3 py-1.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1 hover:bg-orange-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + เพิ่มงวดงาน
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="text-gray-400 font-bold text-center border-b border-white/5">
                <th className="py-2.5 px-2 w-12 neu-pressed rounded-l-2xl border border-white/5">งวดที่</th>
                <th className="py-2.5 px-3 text-left neu-pressed border border-white/5 min-w-[240px]">รายละเอียดงานงวด</th>
                <th className="py-2.5 px-2 w-32 neu-pressed border border-white/5">จำนวนเงิน (บาท)</th>
                <th className="py-2.5 px-2 w-28 neu-pressed border border-white/5">กำหนดตามสัญญา</th>
                <th className="py-2.5 px-2 w-28 neu-pressed border border-white/5">ส่งมอบจริง</th>
                <th className="py-2.5 px-2 w-28 neu-pressed border border-white/5">วันที่ตรวจรับ</th>
                <th className="py-2.5 px-2 w-28 neu-pressed border border-white/5">สถานะ</th>
                <th className="py-2.5 px-2 w-10 neu-pressed rounded-r-2xl border border-white/5">ลบ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {milestones.map((m, idx) => (
                <tr key={m.id || idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-2.5 text-center font-bold text-orange-400">
                    {toThaiDigits(m.installmentNo || idx + 1)}
                  </td>
                  <td className="p-2.5">
                    <textarea
                      rows={2}
                      value={m.description || ''}
                      onChange={(e) => handleMilestoneChange(idx, 'description', e.target.value)}
                      placeholder="ระบุรายละเอียดงานตามงวด..."
                      className="w-full bg-[#141517] text-white text-xs p-2 rounded-xl border border-white/5 shadow-inner outline-none resize-none leading-relaxed"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="number"
                      value={m.amount || ''}
                      onChange={(e) => handleMilestoneChange(idx, 'amount', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full text-center bg-[#141517] text-emerald-400 font-bold text-xs p-2 rounded-xl border border-white/5 shadow-inner outline-none"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={m.contractDueDate || ''}
                      onChange={(e) => handleMilestoneChange(idx, 'contractDueDate', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๒๘ ส.ค. ๖๙"
                      className="w-full text-center bg-[#141517] text-gray-300 text-xs p-2 rounded-xl border border-white/5 shadow-inner outline-none"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={m.actualFinishDate || ''}
                      onChange={(e) => handleMilestoneChange(idx, 'actualFinishDate', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๒๕ ส.ค. ๖๙"
                      className="w-full text-center bg-[#141517] text-gray-300 text-xs p-2 rounded-xl border border-white/5 shadow-inner outline-none"
                    />
                  </td>
                  <td className="p-2.5">
                    <input
                      type="text"
                      value={m.inspectionDate || ''}
                      onChange={(e) => handleMilestoneChange(idx, 'inspectionDate', toThaiDigits(e.target.value))}
                      placeholder="เช่น ๒๘ ส.ค. ๖๙"
                      className="w-full text-center bg-[#141517] text-gray-300 text-xs p-2 rounded-xl border border-white/5 shadow-inner outline-none"
                    />
                  </td>
                  <td className="p-2.5 text-center">
                    <select
                      value={m.paymentStatus || 'pending'}
                      onChange={(e) => handleMilestoneChange(idx, 'paymentStatus', e.target.value)}
                      className="w-full bg-[#141517] text-orange-300 font-semibold text-[11px] p-2 rounded-xl border border-white/5 shadow-inner outline-none"
                    >
                      <option value="pending">รอดำเนินการ</option>
                      <option value="inspected">ตรวจรับแล้ว</option>
                      <option value="disbursed">เบิกจ่ายแล้ว</option>
                    </select>
                  </td>
                  <td className="p-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteMilestone(idx)}
                      className="w-7 h-7 rounded-xl neu-button flex items-center justify-center text-rose-400 hover:text-rose-300 border border-white/5 transition-colors cursor-pointer"
                      title="ลบงวดงานนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2 & 3: การทดสอบวัสดุ & การขออนุมัติใช้วัสดุ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 2: รายงานผลการทดสอบวัสดุ */}
        <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm">
              <FlaskConical className="w-4 h-4" />
              <span>๒. รายงานผลการทดสอบวัสดุ (Material Tests)</span>
            </div>

            <button
              type="button"
              onClick={handleAddTest}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1 hover:bg-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              + เพิ่ม
            </button>
          </div>

          <div className="space-y-3">
            {materialTests.map((test, idx) => (
              <div key={test.id || idx} className="p-3.5 rounded-2xl bg-[#141517] border border-white/5 space-y-2 shadow-inner">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-orange-400">
                    รายการทดสอบที่ {toThaiDigits(idx + 1)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTest(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                    title="ลบรายการนี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={test.item || ''}
                  onChange={(e) => handleTestChange(idx, 'item', e.target.value)}
                  placeholder="เช่น ผลการทดสอบกำลังอัดคอนกรีต..."
                  className="w-full bg-black/20 text-white text-xs p-2 rounded-xl border border-white/5 outline-none font-semibold"
                />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={test.testDateText || test.testDate || ''}
                    onChange={(e) => handleTestChange(idx, 'testDateText', toThaiDigits(e.target.value))}
                    placeholder="วันที่ทดสอบ (เช่น ๑๕ ก.ค. ๖๙)"
                    className="w-full bg-black/20 text-gray-300 text-[11px] p-2 rounded-xl border border-white/5 outline-none"
                  />
                  <input
                    type="text"
                    value={test.testingAuthority || ''}
                    onChange={(e) => handleTestChange(idx, 'testingAuthority', e.target.value)}
                    placeholder="หน่วยงานที่ทดสอบ"
                    className="w-full bg-black/20 text-gray-300 text-[11px] p-2 rounded-xl border border-white/5 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={test.location || ''}
                    onChange={(e) => handleTestChange(idx, 'location', e.target.value)}
                    placeholder="ตำแหน่งที่ทดสอบ"
                    className="w-full bg-black/20 text-gray-300 text-[11px] p-2 rounded-xl border border-white/5 outline-none"
                  />
                  <input
                    type="text"
                    value={test.resultText || 'ผ่านเกณฑ์'}
                    onChange={(e) => handleTestChange(idx, 'resultText', e.target.value)}
                    placeholder="ผลการทดสอบ"
                    className="w-full bg-black/20 text-emerald-400 font-bold text-[11px] p-2 rounded-xl border border-white/5 outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: การขออนุมัติใช้วัสดุ */}
        <div className="neu-flat p-5 sm:p-7 rounded-3xl border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs sm:text-sm">
              <FileCheck2 className="w-4 h-4" />
              <span>๓. การขออนุมัติใช้วัสดุ (Material Approvals)</span>
            </div>

            <button
              type="button"
              onClick={handleAddApproval}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 flex items-center gap-1 hover:bg-orange-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              + เพิ่ม
            </button>
          </div>

          <div className="space-y-3">
            {materialApprovals.map((appr, idx) => (
              <div key={appr.id || idx} className="p-3.5 rounded-2xl bg-[#141517] border border-white/5 space-y-2 shadow-inner">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold text-orange-400">
                    การขออนุมัติที่ {toThaiDigits(idx + 1)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteApproval(idx)}
                    className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                    title="ลบรายการนี้"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <input
                  type="text"
                  value={appr.item || ''}
                  onChange={(e) => handleApprovalChange(idx, 'item', e.target.value)}
                  placeholder="เช่น ขออนุมัติใช้เหล็กเสริมคอนกรีต..."
                  className="w-full bg-black/20 text-white text-xs p-2 rounded-xl border border-white/5 outline-none font-semibold"
                />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input
                    type="text"
                    value={appr.requestDateText || appr.requestDate || ''}
                    onChange={(e) => handleApprovalChange(idx, 'requestDateText', toThaiDigits(e.target.value))}
                    placeholder="วันที่ขออนุมัติ (เช่น ๓๐ มิ.ย. ๖๙)"
                    className="w-full bg-black/20 text-gray-300 text-[11px] p-2 rounded-xl border border-white/5 outline-none"
                  />
                  <input
                    type="text"
                    value={appr.reviewer || ''}
                    onChange={(e) => handleApprovalChange(idx, 'reviewer', e.target.value)}
                    placeholder="ผู้พิจารณา"
                    className="w-full bg-black/20 text-gray-300 text-[11px] p-2 rounded-xl border border-white/5 outline-none"
                  />
                </div>

                <input
                  type="text"
                  value={appr.decisionText || 'อนุมัติ'}
                  onChange={(e) => handleApprovalChange(idx, 'decisionText', e.target.value)}
                  placeholder="ผลการพิจารณา (เช่น อนุมัติ)"
                  className="w-full bg-black/20 text-emerald-400 font-bold text-[11px] p-2 rounded-xl border border-white/5 outline-none"
                />
              </div>
            ))}
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
            <span>ย้อนกลับ: สรุปสะสมรายเดือน (หน้า ๖)</span>
          </button>
        )}

        {onNavigateNext && (
          <button
            type="button"
            onClick={onNavigateNext}
            className="px-5 py-2.5 rounded-2xl neu-orange-btn text-white text-xs font-bold flex items-center gap-2 active:scale-95 shadow-md transition-all cursor-pointer ml-auto"
          >
            <span>ถัดไป: สรุปผลโครงการ (หน้า ๘)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
