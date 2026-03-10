export type RepeatType =
  | 'once'        // 只响一次
  | 'daily'       // 每天
  | 'weekdays'    // 周一至周五
  | 'workdays'    // 法定工作日（智能跳过节假日）
  | 'holidays'    // 法定节假日（智能跳过工作日）
  | 'custom';     // 自定义

export interface Alarm {
  id: string;
  hour: number;
  minute: number;
  enabled: boolean;
  label: string;
  repeatType: RepeatType;
  customDays: number[]; // 0=周日, 1=周一, ..., 6=周六
  snoozeEnabled: boolean;
}

export const REPEAT_LABELS: Record<RepeatType, string> = {
  once: '只响一次',
  daily: '每天',
  weekdays: '周一至周五',
  workdays: '法定工作日',
  holidays: '法定节假日',
  custom: '自定义',
};

export const DAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

export function getRepeatDescription(alarm: Alarm): string {
  switch (alarm.repeatType) {
    case 'once':
      return '只响一次';
    case 'daily':
      return '每天';
    case 'weekdays':
      return '周一至周五';
    case 'workdays':
      return '法定工作日';
    case 'holidays':
      return '法定节假日';
    case 'custom':
      if (alarm.customDays.length === 0) return '只响一次';
      if (alarm.customDays.length === 7) return '每天';
      return alarm.customDays
        .sort()
        .map(d => DAY_LABELS[d])
        .join(' ');
    default:
      return '';
  }
}
