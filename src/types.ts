export interface LaborRow {
  id: string;
  category: string; // ชื่อประเภทแรงงาน (เช่น หัวหน้าคนงาน/ช่าง, กรรมกร, รถแบคโฮ)
  counts: number[]; // จำนวนคนในแต่ละวัน (7 วัน d1..d7)
}

export interface WorkProgress {
  weight: number;      // WW: สัดส่วนของงาน% (ผู้ใช้กรอก)
  prevPercent: number; // WP: ถึงสัปดาห์ก่อน% (auto carry-forward จากสัปดาห์ก่อนหน้า)
  thisWeek: number;    // WT: ในสัปดาห์นี้% (ผู้ใช้กรอก)
  cumulative: number;  // WC: สะสม% (auto = WP + WT)
  rowTotal: number;    // WR: ผลงานรวม% (ผู้ใช้กรอก ไม่ auto-calc)
}

export interface WeekData {
  id: string;
  weekNo: string;        // WN / WEEK: สัปดาห์ที่ (เช่น 1, 2, 3...)
  docNo?: string;        // เลขที่หนังสือเฉพาะสัปดาห์ (ถ้าไม่ระบุใช้ค่าโครงการเป็นค่าเริ่มต้น)
  startDate: string;     // START: วันเริ่มต้นสัปดาห์ (เช่น 8 มกราคม 2569)
  endDate: string;       // END: วันสิ้นสุดสัปดาห์ (เช่น 14 มกราคม 2569)
  reportDate: string;    // R_DATE: วันที่รายงาน (วันจันทร์ถัดไป เช่น 15 มกราคม 2569)
  remainingDays: string; // REMAIN: ระยะเวลาก่อสร้างคงเหลือ (วัน)

  // 7 วันในสัปดาห์ (D1..D7, SD1..SD7, DAY_DESC_1..7, W_A1..7, W_P1..7)
  dailyDates: string[];           // D1..D7 (วันที่แบบเต็ม เช่น "8 มกราคม 2569")
  dailyShortDates: string[];      // SD1..SD7 (วันที่ย่อ เช่น "8 ม.ค. 69")
  dailyNarrative: string[];       // DAY_DESC_1..7 (รายละเอียดการทำงานต่อวัน ต้นทางของ WD)
  dailyWeatherMorning: string[];  // W_A1..7 (สภาพอากาศเช้า default "แจ่มใส")
  dailyWeatherAfternoon: string[];// W_P1..7 (สภาพอากาศบ่าย default "แจ่มใส")

  // ตารางแรงงาน loop {#laborRows}
  laborRows: LaborRow[];

  // ตารางผลการดำเนินงานในสัปดาห์
  workProgress: WorkProgress;
}


export interface MonthlyProgressEntry {
  id: string;
  monthName: string;
  activitiesText?: string;
  weightPct?: number;
  prevMonthPct?: number;
  inMonthPct?: number;
  accumulatedPct?: number;
  totalWorkPct?: number;
}

export interface MilestoneItem {
  id: string;
  installmentNo: number;
  description: string;
  amount?: number;
  contractDueDate: string;
  actualFinishDate: string;
  inspectionDate: string;
  paymentStatus: 'pending' | 'inspected' | 'disbursed';
  finishDateText?: string;
  inspectionDateText?: string;
  remarks?: string;
}

export interface MaterialTestItem {
  id: string;
  item: string;
  sampleCount?: string;
  testDate: string;
  testDateText?: string;
  testingAuthority: string;
  location?: string;
  result: 'passed' | 'failed' | 'pending';
  resultText?: string;
  testCertNo: string;
  notes?: string;
}

export interface MaterialApprovalItem {
  id: string;
  item: string;
  requestDate: string;
  requestDateText?: string;
  reviewer: string;
  status: 'approved' | 'rejected' | 'pending' | 'revised';
  decisionText?: string;
  approvalDate?: string;
  remarks?: string;
}

export interface ObstacleItem {
  id: string;
  issue: string;
  impact: string;
  mitigation: string;
  notified: boolean;
  notifiedDate?: string;
  status: 'pending' | 'in_progress' | 'resolved';
}

export interface ReportData {
  isPlaceholderMode: boolean;

  // Cover Memo (Page 1 / Group A & Group B)
  docNo: string;           // {{DOC_NO}} e.g. 01/2569
  reportDate: string;      // {{R_DATE}} e.g. 15 มกราคม 2569
  weekNo: string;          // {{WEEK}} e.g. 2
  startDate: string;       // {{START}} e.g. 8 มกราคม 2569
  endDate: string;         // {{END}} e.g. 14 มกราคม 2569
  rptMonth?: string;       // {{RPT_MONTH}} e.g. มกราคม 2569

  projectName: string;     // {{PROJECT}} e.g. โครงการก่อสร้างถนนคอนกรีตเสริมเหล็ก
  location: string;        // {{LOCATION}} e.g. หมู่ที่ 3 ตำบลใหม่พัฒนา
  quantity: string;        // {{QTY}} e.g. กว้าง 4.00 เมตร ยาว 250.00 เมตร หนา 0.15 เมตร
  contractNo: string;      // {{C_NO}} e.g. 15/2569
  contractDate: string;    // {{C_DATE}} e.g. 1 ธันวาคม 2568
  wsDate?: string;         // {{WS_DATE}} วันเริ่มงานตามสัญญา e.g. 30 มิถุนายน 2569
  contractEndDate: string; // {{C_END}} e.g. 28 กุมภาพันธ์ 2569
  totalDays: string;       // {{DAYS}} e.g. 90
  extendedEndDate: string; // {{EXT_DATE}} ต่อสัญญาจ้างถึงวันที่ e.g. -
  extendedDays: string;    // {{EXT_DAYS}} รวมต่อสัญญา e.g. -
  constructionCost: string;// {{COST}} e.g. 485,000.00
  finePerDay: string;      // {{FINE}} e.g. 485.00
  contractorName: string;  // {{CONTRACTOR}} e.g. ห้างหุ้นส่วนจำกัด เกาะคาคอนสตรัคชั่น (2020)
  contractorAddress?: string; // {{CTR_ADDR}} e.g. บ้านปงยางคก เลขที่ 52/1 หมู่ 9...
  installN?: string;       // {{INSTALL_N}} e.g. 1
  remainingDays: string;   // {{REMAIN}} e.g. 45
  budgetYear: string;      // e.g. 2569
  budgetAmount: string;    // {{BUDGET}} e.g. 485,000.00

  // Scope, Dimensions & Personnel (Page 5)
  dimensionWidth?: string;
  dimensionLength?: string;
  dimensionThickness?: string;
  dimensionArea?: string;
  scopeSummary?: string;
  employerName?: string;
  designerName?: string;
  contractorPhone?: string;
  contractorSupervisor?: string;
  totalInstallments?: number;
  inspectedInstallments?: number;
  disbursedAmount?: string;

  // Signatures & Personnel (Group C)
  supervisorName: string;     // {{SUP_NAME}} / {{SUPERVISOR_NAME}}
  supervisorPos: string;      // {{SUP_POS}}
  committeeChairName: string; // {{COM_P_NAME}}
  committeeChairPos: string;  // {{COM_P_POS}}
  committee1Name: string;     // {{COM_1_NAME}}
  committee1Pos: string;      // {{COM_1_POS}}
  committee2Name: string;     // {{COM_2_NAME}}
  committee2Pos: string;      // {{COM_2_POS}}
  rep1Name?: string;          // {{REP_1}} ผู้แทนผู้รับจ้าง e.g. นายพรหมมินทร์ ปะระมา
  rep2Name?: string;          // {{REP_2}} ผู้แทนผู้รับจ้างคนที่ 2 e.g. -

  // Page 6: Cumulative Monthly Progress Logs
  monthlyProgressLogs?: MonthlyProgressEntry[];

  // Page 7: Milestones, Material Tests & Approvals
  milestones?: MilestoneItem[];
  materialTests?: MaterialTestItem[];
  materialApprovals?: MaterialApprovalItem[];

  // Page 8: Obstacles & Summary
  obstacles?: ObstacleItem[];

  // Multi-Week Structure
  weeks: WeekData[];
  activeWeekIndex: number;
}

export interface Project {
  id: string;
  name: string;
  updatedAt: string;
  data: ReportData;
}
