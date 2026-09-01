import { ReportData } from '../types';

const POSITION_MARKERS = [
  'นายช่างโยธา',
  'ผู้ควบคุมงาน',
  'วิศวกร',
  'ประธานกรรมการ',
  'ประธานกรรม',
  'กรรมการ',
  'เลขานุการ',
  'ผู้แทนผู้รับจ้าง',
  'ผู้แทนผู้ว่าจ้าง',
  'นายช่าง',
];

function cleanSpace(value: unknown): string {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function splitPersonValue(nameValue: unknown, positionValue: unknown): { name: string; position: string } {
  let name = cleanSpace(nameValue);
  let position = cleanSpace(positionValue);

  if (!name) return { name, position };

  const markerIndex = POSITION_MARKERS
    .map((marker) => ({ marker, index: name.indexOf(marker) }))
    .filter(({ index }) => index > 0)
    .sort((a, b) => a.index - b.index)[0];

  if (markerIndex) {
    const embeddedPosition = name.slice(markerIndex.index).trim();
    name = name.slice(0, markerIndex.index).trim();
    if (!position) position = embeddedPosition;
  }

  if (position && name.endsWith(position)) {
    name = name.slice(0, -position.length).trim();
  }

  return { name, position };
}

/**
 * แยกชื่อและตำแหน่งที่ OCR/AI อาจส่งรวมมาในช่องชื่อ เช่น
 * "นายธนิส บุญเป็ง นายช่างโยธา" → ชื่อ / นายช่างโยธา
 */
export function normalizePersonnelFields(input: Partial<ReportData>): Partial<ReportData> {
  const output: Partial<ReportData> = { ...input };
  const pairs: Array<[keyof ReportData, keyof ReportData]> = [
    ['supervisorName', 'supervisorPos'],
    ['committeeChairName', 'committeeChairPos'],
    ['committee1Name', 'committee1Pos'],
    ['committee2Name', 'committee2Pos'],
  ];

  pairs.forEach(([nameKey, positionKey]) => {
    const result = splitPersonValue(output[nameKey], output[positionKey]);
    output[nameKey] = result.name as never;
    output[positionKey] = result.position as never;
  });

  return output;
}
