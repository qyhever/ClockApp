export interface TimerItem {
  id: string;
  label: string;
  totalSeconds: number;   // 总时长（秒）
  remainingSeconds: number; // 剩余时间（秒）
  isRunning: boolean;
  isPaused: boolean;
  endTime: number | null;  // 结束时间戳 (ms)
}
