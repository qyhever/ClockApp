/**
 * 中国法定节假日和调休工作日数据
 * 需要每年更新
 */

// 2026年法定节假日（放假日期）
const HOLIDAYS_2026: string[] = [
  // 元旦
  '2026-01-01', '2026-01-02', '2026-01-03',
  // 春节
  '2026-01-26', '2026-01-27', '2026-01-28', '2026-01-29', '2026-01-30', '2026-01-31', '2026-02-01',
  // 清明节
  '2026-04-04', '2026-04-05', '2026-04-06',
  // 劳动节
  '2026-05-01', '2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05',
  // 端午节
  '2026-06-19', '2026-06-20', '2026-06-21',
  // 中秋节
  '2026-09-25', '2026-09-26', '2026-09-27',
  // 国庆节
  '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07',
];

// 2026年调休工作日（需要上班的周末）
const WORKDAY_ADJUSTMENTS_2026: string[] = [
  '2026-01-24', // 春节调休
  '2026-02-07', // 春节调休
  '2026-04-07', // 清明调休（如有）
  '2026-05-06', // 劳动节调休（如有）
  '2026-09-28', // 中秋调休（如有）
  '2026-10-10', // 国庆调休
];

const holidaySet = new Set(HOLIDAYS_2026);
const workdayAdjustmentSet = new Set(WORKDAY_ADJUSTMENTS_2026);

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = (date.getMonth() + 1).toString().padStart(2, '0');
  const d = date.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 判断某日是否为法定节假日
 */
export function isHoliday(date: Date): boolean {
  const key = formatDate(date);
  if (holidaySet.has(key)) return true;
  // 如果是周末且不是调休工作日，也算节假日
  const day = date.getDay();
  if ((day === 0 || day === 6) && !workdayAdjustmentSet.has(key)) return true;
  return false;
}

/**
 * 判断某日是否为法定工作日
 */
export function isWorkday(date: Date): boolean {
  return !isHoliday(date);
}
