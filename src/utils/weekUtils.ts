import { WeekData, LaborRow, WorkProgress } from '../types';

const THAI_MONTHS_FULL = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
];

const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

/**
 * แปลงเลขอารบิก (0-9) เป็นเลขไทย (๐-๙)
 */
export function toThaiDigits(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  const arabicDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  return String(str).replace(/[0-9]/g, (char) => {
    const idx = arabicDigits.indexOf(char);
    return idx !== -1 ? thaiDigits[idx] : char;
  });
}

/**
 * แปลงเลขไทย (๐-๙) เป็นเลขอารบิก (0-9)
 */
export function convertThaiDigitsToStandard(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  const thaiDigits = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
  return String(str).replace(/[๐-๙]/g, (char) => {
    const idx = thaiDigits.indexOf(char);
    return idx !== -1 ? String(idx) : char;
  });
}

/**
 * แปลง Date เป็นวันที่ไทยแบบเต็ม ใช้ตัวเลขไทยเสมอ เช่น "๖ กรกฎาคม ๒๕๖๙"
 */
export function formatThaiDateFull(date: Date, useThaiDigits: boolean = true): string {
  const day = date.getDate();
  const month = THAI_MONTHS_FULL[date.getMonth()];
  const year = date.getFullYear() + 543;
  const res = `${day} ${month} ${year}`;
  return useThaiDigits ? toThaiDigits(res) : res;
}

/**
 * แปลง Date เป็นวันที่ไทยแบบย่อติดปี พ.ศ. 2 หลัก ใช้ตัวเลขไทยเสมอ เช่น "๖ ก.ค. ๖๙"
 */
export function formatThaiDateShort(date: Date, useThaiDigits: boolean = true): string {
  const day = date.getDate();
  const month = THAI_MONTHS_SHORT[date.getMonth()];
  const yearShort = String((date.getFullYear() + 543) % 100).padStart(2, '0');
  const res = `${day} ${month} ${yearShort}`;
  return useThaiDigits ? toThaiDigits(res) : res;
}

/**
 * คำนวณวันอาทิตย์แรกของสัปดาห์ (Sunday cut-off)
 */
export function getFirstWeekSunday(startDate: Date): Date {
  const result = new Date(startDate);
  const dayOfWeek = result.getDay(); // 0 = Sun, 1 = Mon, 2 = Tue...
  if (dayOfWeek === 0) {
    return result; // starts on Sunday
  }
  const daysUntilSunday = 7 - dayOfWeek;
  result.setDate(result.getDate() + daysUntilSunday);
  return result;
}

/**
 * หาวันจันทร์ถัดไปจากวันสิ้นสุดสัปดาห์ (ใช้สำหรับ R_DATE / วันที่รายงาน)
 * เช่น สัปดาห์จบวันอาทิตย์ที่ 5 ก.ค. 2569 -> วันที่รายงานคือ วันจันทร์ที่ 6 กรกฎาคม 2569
 */
export function getNextMonday(date: Date): Date {
  const result = new Date(date);
  const dayOfWeek = result.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const daysUntilNextMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek);
  result.setDate(result.getDate() + daysUntilNextMonday);
  return result;
}

/**
 * แปลงข้อความวันที่ภาษาไทย (ทั้งเลขอารบิกและเลขไทย ๐-๙) ให้เป็น Date object
 * เช่น "๓๐ มิถุนายน ๒๕๖๙", "29 มิ.ย. 2569", "5 ก.ค. 69"
 */
export function parseThaiDate(dateStr: string): Date {
  if (!dateStr || typeof dateStr !== 'string') return new Date();

  // แปลงเลขไทยทั้งหมดเป็นเลขอารบิกก่อน
  const cleanStr = convertThaiDigitsToStandard(dateStr).trim().replace(/\s+/g, ' ');

  // Try standard date parse first (e.g. 2026-06-29)
  const std = new Date(cleanStr);
  if (!isNaN(std.getTime()) && cleanStr.includes('-')) {
    return std;
  }

  // Split components: [Day, Month, Year?]
  const parts = cleanStr.split(' ');
  if (parts.length >= 2) {
    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    let year = parts[2] ? parseInt(parts[2], 10) : new Date().getFullYear() + 543;

    // Support 2-digit year (e.g. "69" -> 2569)
    if (year < 100) {
      year = year + 2500;
    }

    if (year > 2400) {
      year -= 543; // แปลง พ.ศ. เป็น ค.ศ.
    }

    let monthIndex = THAI_MONTHS_FULL.findIndex((m) => m === monthName || monthName.startsWith(m));
    if (monthIndex === -1) {
      monthIndex = THAI_MONTHS_SHORT.findIndex((m) => m === monthName || monthName.startsWith(m));
    }

    if (!isNaN(day) && monthIndex !== -1 && !isNaN(year)) {
      return new Date(year, monthIndex, day);
    }
  }

  return new Date();
}

/**
 * สร้าง Labor rows เริ่มต้น 3 แถวมาตรฐาน
 */
export function createDefaultLaborRows(): LaborRow[] {
  return [
    { id: 'labor-1', category: 'หัวหน้าคนงาน/ช่าง', counts: [0, 0, 0, 0, 0, 0, 0] },
    { id: 'labor-2', category: 'กรรมกร', counts: [0, 0, 0, 0, 0, 0, 0] },
    { id: 'labor-3', category: 'รถแบคโฮ', counts: [0, 0, 0, 0, 0, 0, 0] },
  ];
}

/**
 * สร้างข้อมูลสัปดาห์เริ่มต้น 1 สัปดาห์ โดยตัดรอบวันอาทิตย์ และส่งรายงานวันจันทร์ถัดไป (ใช้เลขไทย)
 */
export function createDefaultWeek(
  weekNo: number,
  baseDate?: Date,
  prevCumulative = 0,
  totalContractDays = 60
): WeekData {
  const start = baseDate ? new Date(baseDate) : new Date(2026, 5, 30); // 30 มิ.ย. 2569
  let end: Date;
  if (weekNo === 1) {
    end = getFirstWeekSunday(start);
  } else {
    end = new Date(start);
    end.setDate(end.getDate() + 6);
  }

  const reportDate = getNextMonday(end);

  // Daily 7 days ending on Sunday (ใช้เลขไทย)
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

  const daysSpent = weekNo * 7;
  const remaining = Math.max(0, totalContractDays - daysSpent);

  return {
    id: `week-${weekNo}-${Date.now()}`,
    weekNo: toThaiDigits(weekNo),
    startDate: formatThaiDateFull(start, true),
    endDate: formatThaiDateFull(end, true),
    reportDate: formatThaiDateFull(reportDate, true),
    remainingDays: toThaiDigits(remaining),
    dailyDates,
    dailyShortDates,
    dailyNarrative: [
      'ไม่ปฏิบัติงาน',
      'ไม่ปฏิบัติงาน',
      'ไม่ปฏิบัติงาน',
      'ไม่ปฏิบัติงาน',
      'ไม่ปฏิบัติงาน',
      'ไม่ปฏิบัติงาน',
      'ไม่ปฏิบัติงาน',
    ],
    dailyWeatherMorning: ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'],
    dailyWeatherAfternoon: ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'],
    laborRows: createDefaultLaborRows(),
    workProgress: {
      weight: 100,
      prevPercent: prevCumulative,
      thisWeek: 0,
      cumulative: prevCumulative,
      rowTotal: 0,
    },
  };
}

/**
 * คำนวณและสร้างสัปดาห์ทั้งหมดของโครงการอัตโนมัติตามหลักราชการ (ใช้ตัวเลขไทยเสมอ):
 * - สัปดาห์ที่ 1 เริ่มต้นวันที่เริ่มสัญญา (START) และตัดรอบที่วันอาทิตย์แรก (END) -> วันที่รายงาน (R_DATE) คือวันจันทร์ถัดไป
 * - สัปดาห์ที่ 2..N เริ่มวันจันทร์ (START) ถึงวันอาทิตย์ (END) -> วันที่รายงาน (R_DATE) คือวันจันทร์ถัดไป
 */
export function generateWeeksFromContract(
  startDateStr: string,
  totalDaysStr: string,
  existingWeeks: WeekData[] = [],
  contractEndDateStr?: string
): WeekData[] {
  const cleanStartDateStr = convertThaiDigitsToStandard(startDateStr);
  const cleanTotalDaysStr = convertThaiDigitsToStandard(totalDaysStr);

  const startDate = parseThaiDate(cleanStartDateStr);
  const totalDays = parseInt(cleanTotalDaysStr, 10) || 60;
  const contractEndDate = contractEndDateStr ? parseThaiDate(convertThaiDigitsToStandard(contractEndDateStr)) : null;

  const result: WeekData[] = [];
  let currentStart = new Date(startDate);
  let carryCumulative = 0;
  let weekNo = 1;

  while (true) {
    const existing = existingWeeks.find((w) => parseInt(convertThaiDigitsToStandard(w.weekNo), 10) === weekNo);
    let end: Date;

    if (weekNo === 1) {
      end = getFirstWeekSunday(currentStart);
    } else {
      end = new Date(currentStart);
      end.setDate(end.getDate() + 6); // Monday to Sunday
    }

    if (contractEndDate && end > contractEndDate && currentStart <= contractEndDate) {
      end = new Date(contractEndDate);
    }

    const reportDate = getNextMonday(end);

    // 7 daily dates aligned to the Sunday of this week
    const dailyDates: string[] = [];
    const dailyShortDates: string[] = [];
    const weekSunday = new Date(end);
    const weekMonday = new Date(weekSunday);
    weekMonday.setDate(weekMonday.getDate() - 6);

    for (let d = 0; d < 7; d++) {
      const cur = new Date(weekMonday);
      cur.setDate(cur.getDate() + d);
      dailyDates.push(formatThaiDateFull(cur, true));
      dailyShortDates.push(formatThaiDateShort(cur, true));
    }

    // REMAIN must be based on the contract end date and this week's end date.
    // Keep the legacy total-days fallback only when no contract end date exists.
    const remaining = contractEndDate
      ? Math.max(0, Math.round((contractEndDate.getTime() - end.getTime()) / 86400000))
      : Math.max(0, totalDays - Math.min(totalDays, weekNo * 7));

    const thisWeekVal = existing?.workProgress?.thisWeek ?? 0;
    const weightVal = existing?.workProgress?.weight ?? 100;
    const cumVal = Number((carryCumulative + thisWeekVal).toFixed(2));
    const rowTotalVal = existing?.workProgress?.rowTotal ?? cumVal;

    const newWeek: WeekData = {
      id: existing?.id || `week-${weekNo}-${Date.now()}`,
      weekNo: toThaiDigits(weekNo),
      startDate: formatThaiDateFull(currentStart, true),
      endDate: formatThaiDateFull(end, true),
      reportDate: formatThaiDateFull(reportDate, true),
      remainingDays: toThaiDigits(remaining),
      dailyDates,
      dailyShortDates,
      dailyNarrative: existing?.dailyNarrative || [
        'ไม่ปฏิบัติงาน', 'ไม่ปฏิบัติงาน', 'ไม่ปฏิบัติงาน',
        'ไม่ปฏิบัติงาน', 'ไม่ปฏิบัติงาน', 'ไม่ปฏิบัติงาน', 'ไม่ปฏิบัติงาน'
      ],
      dailyWeatherMorning: existing?.dailyWeatherMorning || ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'],
      dailyWeatherAfternoon: existing?.dailyWeatherAfternoon || ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'],
      laborRows: existing?.laborRows && existing.laborRows.length > 0 ? existing.laborRows : createDefaultLaborRows(),
      workProgress: {
        weight: weightVal,
        prevPercent: carryCumulative,
        thisWeek: thisWeekVal,
        cumulative: cumVal,
        rowTotal: rowTotalVal,
      },
    };

    result.push(newWeek);
    carryCumulative = cumVal;

    if (contractEndDate && (end >= contractEndDate || currentStart >= contractEndDate)) {
      break;
    }
    if (!contractEndDate && result.length >= Math.ceil(totalDays / 7)) {
      break;
    }
    // Next week starts on Monday (end + 1 day)

    currentStart = new Date(end);
    currentStart.setDate(currentStart.getDate() + 1);
    weekNo++;
  }

  return result;
}

/**
 * คำนวณเชื่อมโยงค่าสะสม (WP Auto Carry-Forward) ของทุกลำดับสัปดาห์
 */
export function recalculateWeekProgress(weeks: WeekData[]): WeekData[] {
  let prevAccum = 0;
  return weeks.map((w, idx) => {
    const prevP = idx === 0 ? (w.workProgress?.prevPercent || 0) : prevAccum;
    const thisW = w.workProgress?.thisWeek || 0;
    const accum = Number((prevP + thisW).toFixed(2));
    prevAccum = accum;

    return {
      ...w,
      workProgress: {
        ...w.workProgress,
        prevPercent: prevP,
        thisWeek: thisW,
        cumulative: accum,
      },
    };
  });
}

/**
 * ดึงค่าผลงานสะสม (%) ของสัปดาห์ล่าสุดที่มีข้อมูล เพื่อแสดงใน %ผลงานปัจจุบัน (CURRENT_PCT) ในหน้าข้อมูลสัญญา
 */
export function getLatestCumulativeProgress(weeks: WeekData[], useThaiDigits: boolean = true): string {
  if (!weeks || weeks.length === 0) return useThaiDigits ? '๐.๐๐%' : '0.00%';
  let lastNonZero = weeks[0];
  for (let i = weeks.length - 1; i >= 0; i--) {
    if ((weeks[i].workProgress?.cumulative || 0) > 0 || (weeks[i].workProgress?.thisWeek || 0) > 0) {
      lastNonZero = weeks[i];
      break;
    }
  }
  const pct = lastNonZero.workProgress?.cumulative ?? 0;
  const formatted = `${Number(pct.toFixed(2))}%`;
  return useThaiDigits ? toThaiDigits(formatted) : formatted;
}

/**
 * รวมข้อความ DAY_DESC_1..DAY_DESC_7 เข้าเป็น WD ในหน้า 2 (ไม่รวมวันที่ คั่นด้วย \n)
 */
export function buildDailyWorkSummary(dailyNarrative: string[] = []): string {
  if (!dailyNarrative || dailyNarrative.length === 0) return 'ไม่ปฏิบัติงาน';

  const lines: string[] = [];
  dailyNarrative.forEach((desc) => {
    const trimmed = desc ? desc.trim() : '';
    if (trimmed && trimmed !== 'ไม่ปฏิบัติงาน' && trimmed !== '-') {
      // Remove any date tag prefix if present (e.g. "29 มิ.ย. 69: ", "วันที่ 1: ")
      const cleanDesc = trimmed.replace(/^(\d{1,2}\s+[^\s:]+:\s*|[๐-๙]{1,2}\s+[^\s:]+:\s*|วันที่\s+[\d๐-๙]+:\s*)/, '');
      if (cleanDesc && !lines.includes(cleanDesc)) {
        lines.push(`- ${cleanDesc}`);
      }
    }
  });

  if (lines.length === 0) {
    const firstNonEmpty = dailyNarrative.find((d) => d && d.trim() !== '');
    return firstNonEmpty || 'ไม่ปฏิบัติงาน';
  }

  return lines.join('\n');
}

/**
 * แปลงจำนวนเงินเป็นตัวหนังสือภาษาไทยตามมาตรฐานราชการ (BAHTTEXT)
 * เช่น 277000.00 -> "สองแสนเจ็ดหมื่นเจ็ดพันบาทถ้วน"
 *     693.00 -> "หกร้อยเก้าสิบสามบาทถ้วน"
 */
export function bahttext(input: number | string | undefined | null): string {
  if (input === undefined || input === null || input === '') return '';
  const cleanStandard = convertThaiDigitsToStandard(String(input));
  const cleanStr = cleanStandard.replace(/[,\s฿บาท]/g, '').trim();
  const num = parseFloat(cleanStr);
  if (isNaN(num)) return '';

  const thaiDigits = ['ศูนย์', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const thaiUnits = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน', 'ล้าน'];

  function convertGroup(digits: string, isTotalSingleGroup: boolean): string {
    let result = '';
    const len = digits.length;
    for (let i = 0; i < len; i++) {
      const digit = parseInt(digits[i], 10);
      const pos = len - 1 - i;
      if (digit === 0) continue;

      if (pos === 0 && digit === 1 && (!isTotalSingleGroup || len > 1)) {
        result += 'เอ็ด';
      } else if (pos === 1 && digit === 1) {
        result += 'สิบ';
      } else if (pos === 1 && digit === 2) {
        result += 'ยี่สิบ';
      } else {
        result += thaiDigits[digit] + thaiUnits[pos];
      }
    }
    return result;
  }

  const parts = Number(num).toFixed(2).split('.');
  const intPart = parts[0];
  const decPart = parts[1];

  let bahtStr = '';
  if (parseInt(intPart, 10) === 0 && parseInt(decPart, 10) === 0) {
    return 'ศูนย์บาทถ้วน';
  }

  if (parseInt(intPart, 10) === 0) {
    bahtStr = 'ศูนย์บาท';
  } else {
    let remaining = intPart;
    let millionCount = 0;
    const isSingleDigitTotal = intPart.length === 1;
    while (remaining.length > 0) {
      const chunkLen = Math.min(6, remaining.length);
      const chunk = remaining.slice(-chunkLen);
      remaining = remaining.slice(0, -chunkLen);
      const chunkText = convertGroup(chunk, isSingleDigitTotal && millionCount === 0);
      if (chunkText) {
        let suffix = '';
        for (let m = 0; m < millionCount; m++) suffix += 'ล้าน';
        bahtStr = chunkText + suffix + bahtStr;
      }
      millionCount++;
    }
    bahtStr += 'บาท';
  }

  if (parseInt(decPart, 10) === 0) {
    bahtStr += 'ถ้วน';
  } else {
    bahtStr += convertGroup(decPart, decPart.length === 1) + 'สตางค์';
  }

  return bahtStr;
}

/**
 * คำนวณความก้าวหน้ารายสัปดาห์ Group D (Weekly Progress Tokens)
 * WW = ในสัปดาห์นี้ (%)
 * WP = ถึงสัปดาห์ก่อน (%)
 * WT = WW
 * WC = WP + WT
 * WR = WC
 * CP = WC (ป้อนกลับไปยัง %ผลงานปัจจุบันในหน้าสรุปด้านบน)
 */
export function calculateWeeklyProgress(
  currentWeekInput_WW: number | string = 0,
  previousWeek_WP: number | string = 0
): { WW: number; WP: number; WT: number; WC: number; WR: number; CP: number } {
  const cleanWW = convertThaiDigitsToStandard(String(currentWeekInput_WW));
  const cleanWP = convertThaiDigitsToStandard(String(previousWeek_WP));
  const WW = Number(cleanWW) || 0;
  const WP = Number(cleanWP) || 0;
  const WT = WW;
  const WC = Number((WP + WT).toFixed(2));
  const WR = WC;
  const CP = WC;

  return { WW, WP, WT, WC, WR, CP };
}


