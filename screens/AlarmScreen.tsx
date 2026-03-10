import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Alarm } from '../types/alarm';
import { loadAlarms, saveAlarms } from '../utils/storage';
import { isWorkday, isHoliday } from '../utils/holidays';
import { playAlarmSound, stopAlarmSound } from '../utils/sound';
import AlarmItem from '../components/AlarmItem';
import AlarmEditor from '../components/AlarmEditor';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function shouldAlarmFire(alarm: Alarm, now: Date): boolean {
  if (!alarm.enabled) return false;
  if (now.getHours() !== alarm.hour || now.getMinutes() !== alarm.minute) return false;

  const day = now.getDay();
  switch (alarm.repeatType) {
    case 'once':
      return true;
    case 'daily':
      return true;
    case 'weekdays':
      return day >= 1 && day <= 5;
    case 'workdays':
      return isWorkday(now);
    case 'holidays':
      return isHoliday(now);
    case 'custom':
      return alarm.customDays.includes(day);
    default:
      return false;
  }
}

export default function AlarmScreen() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState<Alarm | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const firedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    loadAlarms().then(setAlarms);
  }, []);

  // 每秒检查闹钟
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const sec = now.getSeconds();
      const key = `${now.getHours()}:${now.getMinutes()}`;

      if (sec === 0) {
        firedRef.current.clear();
      }

      alarms.forEach((alarm) => {
        const alarmKey = `${alarm.id}-${key}`;
        if (shouldAlarmFire(alarm, now) && sec === 0 && !firedRef.current.has(alarmKey)) {
          firedRef.current.add(alarmKey);
          playAlarmSound();
          Alert.alert(
            alarm.label,
            `${alarm.hour.toString().padStart(2, '0')}:${alarm.minute.toString().padStart(2, '0')}`,
            [
              {
                text: '停止',
                onPress: () => {
                  stopAlarmSound();
                  if (alarm.repeatType === 'once') {
                    const updated = alarms.map((a) =>
                      a.id === alarm.id ? { ...a, enabled: false } : a
                    );
                    setAlarms(updated);
                    saveAlarms(updated);
                  }
                },
              },
              ...(alarm.snoozeEnabled
                ? [
                    {
                      text: '稍后提醒',
                      onPress: () => {
                        stopAlarmSound();
                        // 9分钟后再次提醒
                        setTimeout(() => {
                          if (alarm.enabled) playAlarmSound();
                        }, 9 * 60 * 1000);
                      },
                    },
                  ]
                : []),
            ],
            { cancelable: false }
          );
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [alarms]);

  const handleSave = useCallback(
    (data: Omit<Alarm, 'id'>) => {
      let updated: Alarm[];
      if (editingAlarm) {
        updated = alarms.map((a) => (a.id === editingAlarm.id ? { ...a, ...data } : a));
      } else {
        updated = [...alarms, { ...data, id: generateId() }];
      }
      setAlarms(updated);
      saveAlarms(updated);
      setShowEditor(false);
      setEditingAlarm(undefined);
    },
    [alarms, editingAlarm]
  );

  const handleDelete = useCallback(() => {
    if (!editingAlarm) return;
    const updated = alarms.filter((a) => a.id !== editingAlarm.id);
    setAlarms(updated);
    saveAlarms(updated);
    setShowEditor(false);
    setEditingAlarm(undefined);
  }, [alarms, editingAlarm]);

  const handleToggle = useCallback(
    (id: string, enabled: boolean) => {
      const updated = alarms.map((a) => (a.id === id ? { ...a, enabled } : a));
      setAlarms(updated);
      saveAlarms(updated);
    },
    [alarms]
  );

  const handleDeleteFromList = useCallback(
    (id: string) => {
      const updated = alarms.filter((a) => a.id !== id);
      setAlarms(updated);
      saveAlarms(updated);
    },
    [alarms]
  );

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsEditing((v) => !v)}>
          <Text style={styles.editText}>{isEditing ? '完成' : '编辑'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>闹钟</Text>
        <TouchableOpacity
          onPress={() => {
            setEditingAlarm(undefined);
            setShowEditor(true);
          }}
        >
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 闹钟列表 */}
      {alarms.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>没有闹钟</Text>
          <Text style={styles.emptySubtext}>点击右上角 + 添加闹钟</Text>
        </View>
      ) : (
        <FlatList
          data={alarms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.alarmRow}>
              {isEditing && (
                <TouchableOpacity
                  style={styles.deleteIcon}
                  onPress={() => handleDeleteFromList(item.id)}
                >
                  <View style={styles.deleteCircle}>
                    <Text style={styles.deleteMinus}>−</Text>
                  </View>
                </TouchableOpacity>
              )}
              <View style={styles.alarmItemWrapper}>
                <AlarmItem
                  alarm={item}
                  onToggle={handleToggle}
                  onPress={(alarm) => {
                    setEditingAlarm(alarm);
                    setShowEditor(true);
                  }}
                />
              </View>
            </View>
          )}
        />
      )}

      {/* 编辑器 Modal */}
      <Modal visible={showEditor} animationType="slide">
        <AlarmEditor
          alarm={editingAlarm}
          onSave={handleSave}
          onCancel={() => {
            setShowEditor(false);
            setEditingAlarm(undefined);
          }}
          onDelete={editingAlarm ? handleDelete : undefined}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  editText: {
    color: '#FF9500',
    fontSize: 17,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
  },
  addText: {
    color: '#FF9500',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 34,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
  },
  emptySubtext: {
    color: '#8E8E93',
    fontSize: 15,
    marginTop: 8,
  },
  alarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteIcon: {
    paddingLeft: 16,
    paddingRight: 6,
  },
  deleteCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteMinus: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: -2,
  },
  alarmItemWrapper: {
    flex: 1,
  },
});
