import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { TimerItem } from '../types/timer';

interface TimerCardProps {
  timer: TimerItem;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onCancel: (id: string) => void;
}

function formatTime(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function TimerCard({ timer, onPause, onResume, onCancel }: TimerCardProps) {
  const progress = timer.totalSeconds > 0 ? timer.remainingSeconds / timer.totalSeconds : 0;
  const isFinished = timer.remainingSeconds <= 0 && (timer.isRunning || timer.isPaused);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.label} numberOfLines={1}>
          {timer.label || '计时器'}
        </Text>
        <TouchableOpacity onPress={() => onCancel(timer.id)}>
          <Text style={styles.cancelText}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* 圆形进度 */}
      <View style={styles.progressContainer}>
        <View style={styles.circle}>
          {/* 背景圆 */}
          <View style={[styles.progressRing, { borderColor: '#333' }]} />
          {/* 前景进度弧 - 用文字代替 */}
          <Text style={[styles.timeText, isFinished && styles.finishedText]}>
            {isFinished ? '时间到' : formatTime(timer.remainingSeconds)}
          </Text>
        </View>
      </View>

      {/* 控制按钮 */}
      <View style={styles.controls}>
        {!isFinished && timer.isRunning && (
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton]}
            onPress={() => onPause(timer.id)}
          >
            <Text style={styles.pauseText}>暂停</Text>
          </TouchableOpacity>
        )}
        {!isFinished && timer.isPaused && (
          <TouchableOpacity
            style={[styles.controlButton, styles.resumeButton]}
            onPress={() => onResume(timer.id)}
          >
            <Text style={styles.resumeText}>继续</Text>
          </TouchableOpacity>
        )}
        {isFinished && (
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton]}
            onPress={() => onCancel(timer.id)}
          >
            <Text style={styles.pauseText}>关闭</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    color: '#8E8E93',
    fontSize: 17,
    flex: 1,
  },
  cancelText: {
    color: '#8E8E93',
    fontSize: 20,
    paddingLeft: 10,
  },
  progressContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  circle: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
  },
  finishedText: {
    color: '#FF9500',
    fontSize: 24,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 24,
    minWidth: 80,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
  },
  resumeButton: {
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
  },
  pauseText: {
    color: '#FF9500',
    fontSize: 17,
  },
  resumeText: {
    color: '#34C759',
    fontSize: 17,
  },
});
