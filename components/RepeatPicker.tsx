import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { RepeatType, REPEAT_LABELS, DAY_LABELS } from '../types/alarm';

interface RepeatPickerProps {
  repeatType: RepeatType;
  customDays: number[];
  onChangeRepeat: (type: RepeatType) => void;
  onChangeCustomDays: (days: number[]) => void;
  onClose: () => void;
}

const REPEAT_OPTIONS: RepeatType[] = ['once', 'daily', 'weekdays', 'workdays', 'holidays', 'custom'];

export default function RepeatPicker({
  repeatType,
  customDays,
  onChangeRepeat,
  onChangeCustomDays,
  onClose,
}: RepeatPickerProps) {
  const [selectedType, setSelectedType] = useState<RepeatType>(repeatType);
  const [selectedDays, setSelectedDays] = useState<number[]>(customDays);

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSave = () => {
    onChangeRepeat(selectedType);
    if (selectedType === 'custom') {
      onChangeCustomDays(selectedDays);
    }
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.title}>重复</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {REPEAT_OPTIONS.map((type) => (
          <TouchableOpacity
            key={type}
            style={styles.option}
            onPress={() => setSelectedType(type)}
          >
            <Text style={styles.optionText}>{REPEAT_LABELS[type]}</Text>
            {selectedType === type && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}

        {selectedType === 'custom' && (
          <View style={styles.customDays}>
            <Text style={styles.customTitle}>选择重复日</Text>
            {[1, 2, 3, 4, 5, 6, 0].map((day) => (
              <TouchableOpacity
                key={day}
                style={styles.dayOption}
                onPress={() => toggleDay(day)}
              >
                <Text style={styles.dayText}>每{DAY_LABELS[day]}</Text>
                {selectedDays.includes(day) && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
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
  list: {
    flex: 1,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
  checkmark: {
    color: '#FF9500',
    fontSize: 17,
    fontWeight: '600',
  },
  customDays: {
    marginTop: 20,
  },
  customTitle: {
    color: '#8E8E93',
    fontSize: 13,
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  dayOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 17,
  },
});
