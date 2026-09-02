import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { ReportData, WeekData } from '../types';
import {
  buildDailyWorkSummary,
  bahttext,
  calculateWeeklyProgress,
  toThaiDigits,
} from './weekUtils';

/**
 * สร้าง Object ข้อมูลสำหรับแมปลงใน template1.docx ตามข้อกำหนด Token Source Map (Group A - Group F) ทุกประการ
 */
export function addWeeklySummaryPageBreak(docXml: string): string {
  if (docXml.includes('w:type="page"')) {
    // Only add the missing break when the weekly-summary table is not already preceded by one.
    const weeklyToken = docXml.indexOf('WN');
    if (weeklyToken >= 0) {
      const tableMarkup = /<w:tbl\b|<\/w:tbl>/g;
      let depth = 0;
      let outerTableStart = -1;
      let match: RegExpExecArray | null;
      while ((match = tableMarkup.exec(docXml)) && match.index < weeklyToken) {
        if (match[0] === '<w:tbl') {
          if (depth === 0) outerTableStart = match.index;
          depth += 1;
        } else {
          depth = Math.max(0, depth - 1);
        }
      }
      const tableStart = outerTableStart;
      if (tableStart < 0) return docXml;
      const beforeTable = docXml.slice(Math.max(0, tableStart - 300), tableStart);
      if (beforeTable.includes('w:type="page"')) return docXml;
      const pageBreak = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
      return `${docXml.slice(0, tableStart)}${pageBreak}${docXml.slice(tableStart)}`;
    }
  }
  return docXml;
}

function normalizeDocNo(value: string | undefined): string {
  const raw = (value || '').trim();
  return raw.replace(/^ลป\.๗๙๖๐๓\s*\/\s*/u, '').replace(/^ลป\.79603\s*\/\s*/u, '');
}

export function buildTemplateData(projectData: ReportData, targetWeekIndex = 0) {
  const isPlaceholder = projectData.isPlaceholderMode;
  const normalizedDocNo = normalizeDocNo(projectData.docNo);
  const weeks = projectData.weeks && projectData.weeks.length > 0 ? projectData.weeks : [];
  const currentWeek: WeekData = weeks[targetWeekIndex] || {
    id: 'w-fallback',
    weekNo: projectData.weekNo || '๑',
    startDate: projectData.startDate || '๓๐ มิถุนายน ๒๕๖๙',
    endDate: projectData.endDate || '๕ กรกฎาคม ๒๕๖๙',
    reportDate: projectData.reportDate || '๖ กรกฎาคม ๒๕๖๙',
    remainingDays: projectData.remainingDays || '๕๓',
    dailyDates: ['๒๙ มิถุนายน ๒๕๖๙', '๓๐ มิถุนายน ๒๕๖๙', '๑ กรกฎาคม ๒๕๖๙', '๒ กรกฎาคม ๒๕๖๙', '๓ กรกฎาคม ๒๕๖๙', '๔ กรกฎาคม ๒๕๖๙', '๕ กรกฎาคม ๒๕๖๙'],
    dailyShortDates: ['๒๙ มิ.ย. ๖๙', '๓๐ มิ.ย. ๖๙', '๑ ก.ค. ๖๙', '๒ ก.ค. ๖๙', '๓ ก.ค. ๖๙', '๔ ก.ค. ๖๙', '๕ ก.ค. ๖๙'],
    dailyNarrative: ['ไม่ปฏิบัติงาน', 'ไม่ปฏิบัติงาน', 'ไม่ปฏิบัติงาน', 'ไม่ปฏิบัติงาน', 'ไม่ปฏิบัติงาน', 'ไม่ปฏิบัติงาน', 'ไม่ปฏิบัติงาน'],
    dailyWeatherMorning: ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'],
    dailyWeatherAfternoon: ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'],
    laborRows: [
      { id: 'l1', category: 'หัวหน้าคนงาน/ช่าง', counts: [0, 0, 0, 0, 0, 0, 0] },
      { id: 'l2', category: 'กรรมกร', counts: [0, 0, 0, 0, 0, 0, 0] },
      { id: 'l3', category: 'รถแบคโฮ', counts: [0, 0, 0, 0, 0, 0, 0] },
    ],
    workProgress: {
      weight: 100,
      prevPercent: 0,
      thisWeek: 0,
      cumulative: 0,
      rowTotal: 0,
    },
  };

  const formatNum = (val: number | undefined | null) => {
    if (val === undefined || val === null || val === 0) return '-';
    return Number.isInteger(val) ? String(val) : String(Number(val.toFixed(2)));
  };

  // WD calculation: รวม DAY_DESC_1..7 (ไม่รวมวันที่) คั่นด้วย \n
  const wdText = isPlaceholder
    ? '{{WD}}'
    : buildDailyWorkSummary(currentWeek.dailyNarrative);

  // Labor Rows for loop {{#laborRows}}
  const laborRowsData = isPlaceholder
    ? [
        {
          category: '{{category}}',
          d1: '{{d1}}',
          d2: '{{d2}}',
          d3: '{{d3}}',
          d4: '{{d4}}',
          d5: '{{d5}}',
          d6: '{{d6}}',
          d7: '{{d7}}',
        },
      ]
    : (currentWeek.laborRows || []).map((row) => ({
        category: row.category || '-',
        d1: row.counts && row.counts[0] > 0 ? String(row.counts[0]) : '-',
        d2: row.counts && row.counts[1] > 0 ? String(row.counts[1]) : '-',
        d3: row.counts && row.counts[2] > 0 ? String(row.counts[2]) : '-',
        d4: row.counts && row.counts[3] > 0 ? String(row.counts[3]) : '-',
        d5: row.counts && row.counts[4] > 0 ? String(row.counts[4]) : '-',
        d6: row.counts && row.counts[5] > 0 ? String(row.counts[5]) : '-',
        d7: row.counts && row.counts[6] > 0 ? String(row.counts[6]) : '-',
      }));

  // Daily labor sums: LABOR_TOTAL_1..7
  const laborTotals: Record<string, string> = {};
  for (let i = 0; i < 7; i++) {
    const total = (currentWeek.laborRows || []).reduce(
      (sum, row) => sum + (row.counts && row.counts[i] ? row.counts[i] : 0),
      0
    );
    laborTotals[`LABOR_TOTAL_${i + 1}`] = isPlaceholder
      ? `{{LABOR_TOTAL_${i + 1}}}`
      : total > 0
      ? String(total)
      : '-';
  }

  // Daily logs 1..7 mapping (Group E & Group F)
  const dailyDatesMap: Record<string, string> = {};
  const dailyShortDatesMap: Record<string, string> = {};
  const dailyNarrativesMap: Record<string, string> = {};
  const weatherMorningMap: Record<string, string> = {};
  const weatherAfternoonMap: Record<string, string> = {};

  for (let i = 0; i < 7; i++) {
    const idx = i + 1;
    dailyDatesMap[`D${idx}`] = isPlaceholder
      ? `{{D${idx}}}`
      : currentWeek.dailyDates[i] || '';
    dailyDatesMap[`Date_${idx}`] = dailyDatesMap[`D${idx}`];

    dailyShortDatesMap[`SD${idx}`] = isPlaceholder
      ? `{{SD${idx}}}`
      : currentWeek.dailyShortDates[i] || '';
    dailyShortDatesMap[`ShortDate_${idx}`] = dailyShortDatesMap[`SD${idx}`];

    dailyNarrativesMap[`DAY_DESC_${idx}`] = isPlaceholder
      ? `{{DAY_DESC_${idx}}}`
      : currentWeek.dailyNarrative[i] || 'ไม่ปฏิบัติงาน';

    weatherMorningMap[`W_A${idx}`] = isPlaceholder
      ? `{{W_A${idx}}}`
      : currentWeek.dailyWeatherMorning[i] || 'แจ่มใส';

    weatherAfternoonMap[`W_P${idx}`] = isPlaceholder
      ? `{{W_P${idx}}}`
      : currentWeek.dailyWeatherAfternoon[i] || 'แจ่มใส';
  }

  // Group D: Progress calculation derived strictly from progress_calc.js
  const rawThisWeek = currentWeek.workProgress?.thisWeek ?? 0;
  const rawPrev = currentWeek.workProgress?.prevPercent ?? 0;
  const weeklyCalc = calculateWeeklyProgress(rawThisWeek, rawPrev);


  const costVal = projectData.constructionCost || '';
  const fineVal = projectData.finePerDay || '';
  const costText = isPlaceholder ? '{{COST_TEXT}}' : bahttext(costVal);
  const fineText = isPlaceholder ? '{{FINE_TEXT}}' : bahttext(fineVal);

  // Full Template Data conforming strictly to V2 Template Specification & Aliases
  return {
    // ----------------- GROUP A: Report/document metadata -----------------
    DOC_NO: isPlaceholder ? '{{DOC_NO}}' : normalizeDocNo(currentWeek.docNo || normalizedDocNo),
    R_DATE: isPlaceholder ? '{{R_DATE}}' : currentWeek.reportDate || projectData.reportDate || '',
    REPORT_DATE: isPlaceholder ? '{{R_DATE}}' : currentWeek.reportDate || projectData.reportDate || '',
    WEEK: isPlaceholder ? '{{WEEK}}' : currentWeek.weekNo || projectData.weekNo || '๑',
    WEEK_NO: isPlaceholder ? '{{WEEK}}' : currentWeek.weekNo || projectData.weekNo || '๑',
    START: isPlaceholder ? '{{START}}' : currentWeek.startDate || projectData.startDate || '',
    START_DATE: isPlaceholder ? '{{START}}' : currentWeek.startDate || projectData.startDate || '',
    END: isPlaceholder ? '{{END}}' : currentWeek.endDate || projectData.endDate || '',
    END_DATE: isPlaceholder ? '{{END}}' : currentWeek.endDate || projectData.endDate || '',
    RPT_MONTH: isPlaceholder ? '{{RPT_MONTH}}' : projectData.rptMonth || '',

    // ----------------- GROUP B: Project & contract static fields -----------------
    PROJECT: isPlaceholder ? '{{PROJECT}}' : projectData.projectName || '',
    PROJECT_NAME: isPlaceholder ? '{{PROJECT}}' : projectData.projectName || '',
    LOCATION: isPlaceholder ? '{{LOCATION}}' : projectData.location || '',
    QTY: isPlaceholder ? '{{QTY}}' : projectData.quantity || '',
    QUANTITY: isPlaceholder ? '{{QTY}}' : projectData.quantity || '',
    C_NO: isPlaceholder ? '{{C_NO}}' : projectData.contractNo || '',
    CONTRACT_NO: isPlaceholder ? '{{C_NO}}' : projectData.contractNo || '',
    C_DATE: isPlaceholder ? '{{C_DATE}}' : projectData.contractDate || '',
    CONTRACT_DATE: isPlaceholder ? '{{C_DATE}}' : projectData.contractDate || '',
    WS_DATE: isPlaceholder ? '{{WS_DATE}}' : projectData.wsDate || projectData.startDate || '',
    C_END: isPlaceholder ? '{{C_END}}' : projectData.contractEndDate || '',
    CONTRACT_END_DATE: isPlaceholder ? '{{C_END}}' : projectData.contractEndDate || '',
    DAYS: isPlaceholder ? '{{DAYS}}' : projectData.totalDays || '',
    TOTAL_DAYS: isPlaceholder ? '{{DAYS}}' : projectData.totalDays || '',
    COST: isPlaceholder ? '{{COST}}' : costVal,
    CONSTRUCTION_COST: isPlaceholder ? '{{COST}}' : costVal,
    BUDGET: isPlaceholder ? '{{BUDGET}}' : projectData.budgetAmount || costVal,
    TOTAL_BUDGET: isPlaceholder ? '{{BUDGET}}' : projectData.budgetAmount || costVal,
    FINE: isPlaceholder ? '{{FINE}}' : fineVal,
    FINE_PER_DAY: isPlaceholder ? '{{FINE}}' : fineVal,
    CONTRACTOR: isPlaceholder ? '{{CONTRACTOR}}' : projectData.contractorName || '',
    CONTRACTOR_NAME: isPlaceholder ? '{{CONTRACTOR}}' : projectData.contractorName || '',
    CTR_ADDR: isPlaceholder ? '{{CTR_ADDR}}' : projectData.contractorAddress || '',
    INSTALL_N: isPlaceholder ? '{{INSTALL_N}}' : projectData.installN || '๑',
    EXT_DATE: isPlaceholder ? '{{EXT_DATE}}' : projectData.extendedEndDate || '-',
    EXT_DAYS: isPlaceholder ? '{{EXT_DAYS}}' : projectData.extendedDays || '-',
    REMAIN: isPlaceholder ? '{{REMAIN}}' : currentWeek.remainingDays || projectData.remainingDays || '',
    REMAIN_DAYS: isPlaceholder ? '{{REMAIN}}' : currentWeek.remainingDays || projectData.remainingDays || '',
    COST_TEXT: costText,
    FINE_TEXT: fineText,

    // ----------------- GROUP C: Committee / supervisor / representative -----------------
    SUP_NAME: isPlaceholder ? '{{SUP_NAME}}' : projectData.supervisorName || '',
    SUPERVISOR_NAME: isPlaceholder ? '{{SUP_NAME}}' : projectData.supervisorName || '',
    SUP_POS: isPlaceholder ? '{{SUP_POS}}' : projectData.supervisorPos || '',
    SUPERVISOR_POSITION: isPlaceholder ? '{{SUP_POS}}' : projectData.supervisorPos || '',
    COM_P_NAME: isPlaceholder ? '{{COM_P_NAME}}' : projectData.committeeChairName || '',
    COMMITTEE_PRESIDENT_NAME: isPlaceholder ? '{{COM_P_NAME}}' : projectData.committeeChairName || '',
    COM_P_POS: isPlaceholder ? '{{COM_P_POS}}' : projectData.committeeChairPos || '',
    COMMITTEE_PRESIDENT_POSITION: isPlaceholder ? '{{COM_P_POS}}' : projectData.committeeChairPos || '',
    COM_1_NAME: isPlaceholder ? '{{COM_1_NAME}}' : projectData.committee1Name || '',
    COMMITTEE_1_NAME: isPlaceholder ? '{{COM_1_NAME}}' : projectData.committee1Name || '',
    COM_1_POS: isPlaceholder ? '{{COM_1_POS}}' : projectData.committee1Pos || '',
    COMMITTEE_1_POSITION: isPlaceholder ? '{{COM_1_POS}}' : projectData.committee1Pos || '',
    COM_2_NAME: isPlaceholder ? '{{COM_2_NAME}}' : projectData.committee2Name || '',
    COMMITTEE_2_NAME: isPlaceholder ? '{{COM_2_NAME}}' : projectData.committee2Name || '',
    COM_2_POS: isPlaceholder ? '{{COM_2_POS}}' : projectData.committee2Pos || '',
    COMMITTEE_2_POSITION: isPlaceholder ? '{{COM_2_POS}}' : projectData.committee2Pos || '',
    REP_1: isPlaceholder ? '{{REP_1}}' : projectData.rep1Name || '',
    REP_2: isPlaceholder ? '{{REP_2}}' : projectData.rep2Name || '-',

    // ----------------- GROUP D: Weekly work-item row (single row) -----------------
    WN: isPlaceholder ? '{{WN}}' : currentWeek.weekNo || '๑',
    WD: wdText,
    WW: isPlaceholder ? '{{WW}}' : formatNum(weeklyCalc.WW),
    WP: isPlaceholder ? '{{WP}}' : formatNum(weeklyCalc.WP),
    WT: isPlaceholder ? '{{WT}}' : formatNum(weeklyCalc.WT),
    WC: isPlaceholder ? '{{WC}}' : formatNum(weeklyCalc.WC),
    WR: isPlaceholder ? '{{WR}}' : formatNum(weeklyCalc.WR),
    CP: isPlaceholder ? '{{CP}}' : formatNum(weeklyCalc.CP),

    // ----------------- GROUP E & GROUP F: Daily site log & weather & labor -----------------
    ...dailyDatesMap,
    ...dailyShortDatesMap,
    ...dailyNarrativesMap,
    ...weatherMorningMap,
    ...weatherAfternoonMap,

    // ตารางแรงงาน loop & totals
    laborRows: laborRowsData,
    ...laborTotals,
  };
}

/**
 * โหลด template1.docx และ Render ออกมาเป็น Blob (.docx)
 */
export async function generateDocxBlob(
  projectData: ReportData,
  weekIndex = 0,
  templateType: 'weekly' | 'monthly' = 'weekly'
): Promise<Blob> {
  const templateUrl = templateType === 'monthly'
    ? '/templates/template_monthly.docx'
    : '/templates/template1.docx';
  const response = await fetch(templateUrl);
  if (!response.ok) {
    throw new Error(`ไม่สามารถโหลดไฟล์แม่แบบ ${templateUrl} ได้ (HTTP ${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const zip = new PizZip(arrayBuffer);

  // Clean any stray formatting artifacts if present
  let docXml = zip.file('word/document.xml')?.asText() || '';
  if (docXml.includes('{{D7}}}')) {
    docXml = docXml.replace(/\{\{D7\}\}\}/g, '{{D7}}');
    zip.file('word/document.xml', docXml);
  }

  // The split weekly template already contains its official page breaks.
  // Do not inject another break; it creates a blank/heading-only page.
  zip.file('word/document.xml', docXml);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true, // รองรับ \n ให้ขึ้นบรรทัดใหม่ในเซลล์เดียวกันสำหรับตัวแปร WD
    delimiters: { start: '{{', end: '}}' },
    nullGetter: () => '',
  });

  const templateData = buildTemplateData(projectData, weekIndex);
  doc.render(templateData);

  const out = doc.getZip().generate({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE',
  });

  return out;
}

/**
 * ดาวน์โหลดไฟล์ในเบราว์เซอร์
 */
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
