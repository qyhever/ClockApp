import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { TimerItem } from '../types/timer';
import { playAlarmSound, stopAlarmSound } from '../utils/sound';
import DurationPicker from '../components/DurationPicker';
import TimerCard from '../components/TimerCard';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function TimerScreen() {
  const [timers, setTimers] = useState<TimerItem[]>([]);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const timersRef = useRef(timers);
  timersRef.current = timers;

  // 全局 tick：每秒更新所有运行中的计时器
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prev) => {
        let changed = false;
        const updated = prev.map((t) => {
          if (!t.isRunning || t.remainingSeconds <= 0) return t;
          changed = true;
          const remaining = t.endTime ? Math.max(0, Math.round((t.endTime - Date.now()) / 1000)) : t.remainingSeconds - 1;
          if (remaining <= 0) {
            playAlarmSound();
          }
          return { ...t, remainingSeconds: Math.max(0, remaining) };
        });
        return changed ? updated : prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStart = useCallback(() => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (totalSeconds <= 0) return;
    const newTimer: TimerItem = {
      id: generateId(),
      label: formatDurationLabel(hours, minutes, seconds),
      totalSeconds,
      remainingSeconds: totalSeconds,
      isRunning: true,
      isPaused: false,
      endTime: Date.now() + totalSeconds * 1000,
    };
    setTimers((prev) => [newTimer, ...prev]);
  }, [hours, minutes, seconds]);

  const handlePause = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isRunning: false, isPaused: true, endTime: null } : t
      )
    );
  }, []);

  const handleResume = useCallback((id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, isRunning: true, isPaused: false, endTime: Date.now() + t.remainingSeconds * 1000 }
          : t
      )
    );
  }, []);

  const handleCancel = useCallback((id: string) => {
    const timer = timersRef.current.find((t) => t.id === id);
    if (timer && timer.remainingSeconds <= 0) {
      stopAlarmSound();
    }
    setTimers((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showPicker = timers.length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>计时器</Text>
      </View>

      {showPicker ? (
        <View style={styles.pickerSection}>
          <DurationPicker
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            onChangeHours={setHours}
            onChangeMinutes={setMinutes}
            onChangeSeconds={setSeconds}
          />
          <TouchableOpacity style={styles.startButton} onPress={handleStart}>
            <Text style={styles.startText}>开始</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={timers}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TimerCard
                timer={item}
                onPause={handlePause}
                onResume={handleResume}
                onCancel={handleCancel}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
          {/* 底部添加新计时器按钮 */}
          <View style={styles.addSection}>
            <TouchableOpacity style={styles.addButton} onPress={handleStart}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

function formatDurationLabel(h: number, m: number, s: number): string {
  const parts = [];
  if (h > 0) parts.push(`${h}时`);
  if (m > 0) parts.push(`${m}分`);
  if (s > 0) parts.push(`${s}秒`);
  return parts.join('') || '计时器';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pickerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    marginTop: 40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    color: '#34C759',
    fontSize: 20,
    fontWeight: '500',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 80,
  },
  addSection: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 32,
  },
});
