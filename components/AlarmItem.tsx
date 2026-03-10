import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Alarm, getRepeatDescription } from '../types/alarm';

interface AlarmItemProps {
  alarm: Alarm;
  onToggle: (id: string, enabled: boolean) => void;
  onPress: (alarm: Alarm) => void;
}

export default function AlarmItem({ alarm, onToggle, onPress }: AlarmItemProps) {
  const timeStr = `${alarm.hour.toString().padStart(2, '0')}:${alarm.minute.toString().padStart(2, '0')}`;
  const repeatDesc = getRepeatDescription(alarm);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(alarm)} activeOpacity={0.6}>
      <View style={styles.left}>
        <Text style={[styles.time, !alarm.enabled && styles.dimmed]}>{timeStr}</Text>
        <View style={styles.details}>
          <Text style={[styles.label, !alarm.enabled && styles.dimmed]}>{alarm.label}</Text>
          {repeatDesc !== '只响一次' && (
            <Text style={[styles.repeat, !alarm.enabled && styles.dimmed]}>, {repeatDesc}</Text>
          )}
        </View>
      </View>
      <Switch
        value={alarm.enabled}
        onValueChange={(val) => onToggle(alarm.id, val)}
        trackColor={{ false: '#39393D', true: '#34C759' }}
        thumbColor="#FFFFFF"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#38383A',
  },
  left: {
    flex: 1,
    marginRight: 16,
  },
  time: {
    color: '#FFFFFF',
    fontSize: 56,
    fontWeight: '300',
    fontVariant: ['tabular-nums'],
    lineHeight: 60,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  repeat: {
    color: '#8E8E93',
    fontSize: 15,
  },
  dimmed: {
    color: '#48484A',
  },
});
