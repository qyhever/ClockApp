import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import { Alarm, RepeatType, getRepeatDescription } from '../types/alarm';
import RepeatPicker from './RepeatPicker';
import TimePicker from './TimePicker';

interface AlarmEditorProps {
  alarm?: Alarm;
  onSave: (alarm: Omit<Alarm, 'id'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function AlarmEditor({ alarm, onSave, onCancel, onDelete }: AlarmEditorProps) {
  const [hour, setHour] = useState(alarm?.hour ?? new Date().getHours());
  const [minute, setMinute] = useState(alarm?.minute ?? new Date().getMinutes());
  const [label, setLabel] = useState(alarm?.label ?? '闹钟');
  const [repeatType, setRepeatType] = useState<RepeatType>(alarm?.repeatType ?? 'once');
  const [customDays, setCustomDays] = useState<number[]>(alarm?.customDays ?? []);
  const [snoozeEnabled, setSnoozeEnabled] = useState(alarm?.snoozeEnabled ?? true);

  const [showRepeatPicker, setShowRepeatPicker] = useState(false);

  const handleSave = () => {
    onSave({
      hour,
      minute,
      enabled: true,
      label,
      repeatType,
      customDays,
      snoozeEnabled,
    });
  };

  const tempAlarm = {
    id: '', hour, minute, enabled: true, label, repeatType, customDays, snoozeEnabled,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{alarm ? '编辑闹钟' : '添加闹钟'}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>存储</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll}>
        {/* 时间选择器 */}
        <View style={styles.timePickerContainer}>
          <TimePicker hour={hour} minute={minute} onChangeHour={setHour} onChangeMinute={setMinute} />
        </View>

        {/* 设置项 */}
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingRow} onPress={() => setShowRepeatPicker(true)}>
            <Text style={styles.settingLabel}>重复</Text>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>{getRepeatDescription(tempAlarm)}</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>标签</Text>
            <TextInput
              style={styles.labelInput}
              value={label}
              onChangeText={setLabel}
              placeholder="闹钟"
              placeholderTextColor="#8E8E93"
            />
          </View>

          <View style={[styles.settingRow, styles.settingRowLast]}>
            <Text style={styles.settingLabel}>稍后提醒</Text>
            <Switch
              value={snoozeEnabled}
              onValueChange={setSnoozeEnabled}
              trackColor={{ false: '#39393D', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {alarm && onDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Text style={styles.deleteText}>删除闹钟</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal visible={showRepeatPicker} animationType="slide">
        <RepeatPicker
          repeatType={repeatType}
          customDays={customDays}
          onChangeRepeat={setRepeatType}
          onChangeCustomDays={setCustomDays}
          onClose={() => setShowRepeatPicker(false)}
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
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
  },
  cancelText: {
    color: '#FF9500',
    fontSize: 17,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  saveText: {
    color: '#FF9500',
    fontSize: 17,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  timePickerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  settingsGroup: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
  },
  settingRowLast: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    color: '#8E8E93',
    fontSize: 17,
    marginRight: 4,
  },
  chevron: {
    color: '#8E8E93',
    fontSize: 22,
  },
  labelInput: {
    color: '#8E8E93',
    fontSize: 17,
    textAlign: 'right',
    flex: 1,
    marginLeft: 20,
  },
  deleteButton: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  deleteText: {
    color: '#FF3B30',
    fontSize: 17,
  },
});
