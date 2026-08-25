import { ReportData } from '../types';

export const PAGE_NAMES_TH: Record<number, string> = {
  1: 'หน้า 1: บันทึกข้อความ (รายงานประจำสัปดาห์)',
  2: 'หน้า 2: ผลการดำเนินงานในสัปดาห์',
  3: 'หน้า 3: บันทึกรายวัน สภาพอากาศ & บัญชีแรงงาน',
  4: 'หน้า 4: บันทึกข้อความ (รายงานประจำเดือน)',
  5: 'หน้า 5: ข้อมูลโครงการและสัญญาจ้างฉบับเต็ม',
  6: 'หน้า 6: ตารางผลการดำเนินงานสะสมรายเดือน',
  7: 'หน้า 7: งวดงาน การตรวจรับ & ผลทดสอบวัสดุ',
  8: 'หน้า 8: สรุปผลโครงการ (Executive Dashboard)',
};

export const resetPage5Data = (current: ReportData): ReportData => {
  return {
    ...current,
    dimensionWidth: '',
    dimensionLength: '',
    dimensionThickness: '',
    dimensionArea: '',
    scopeSummary: '',
    employerName: '',
    designerName: '',
    contractorAddress: '',
    contractorPhone: '',
    contractorSupervisor: '',
    rep1Name: '',
    rep2Name: '',
  };
};

export const resetPage6Data = (current: ReportData): ReportData => {
  return {
    ...current,
    monthlyProgressLogs: [],
  };
};

export const resetPage7Data = (current: ReportData): ReportData => {
  return {
    ...current,
    milestones: [],
    materialTests: [],
    materialApprovals: [],
  };
};

export const resetPage8Data = (current: ReportData): ReportData => {
  return {
    ...current,
    obstacles: [],
  };
};
