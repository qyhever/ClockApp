import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

interface WheelColumnProps {
  data: number[];
  selected: number;
  onChange: (value: number) => void;
  label: string;
}

function WheelColumn({ data, selected, onChange, label }: WheelColumnProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const index = data.indexOf(selected);
    if (index >= 0 && scrollRef.current) {
      scrollRef.current.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
    }
  }, []);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, data.length - 1));
    if (data[clamped] !== selected) {
      onChange(data[clamped]);
    }
    scrollRef.current?.scrollTo({ y: clamped * ITEM_HEIGHT, animated: true });
  };

  const paddingItems = Math.floor(VISIBLE_ITEMS / 2);

  return (
    <View style={styles.columnWrapper}>
      <View style={styles.columnContainer}>
        <View style={styles.selectionIndicator} pointerEvents="none" />
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMomentumEnd}
          contentContainerStyle={{
            paddingTop: paddingItems * ITEM_HEIGHT,
            paddingBottom: paddingItems * ITEM_HEIGHT,
          }}
        >
          {data.map((value) => (
            <View key={value} style={styles.item}>
              <Text style={[styles.itemText, value === selected && styles.itemTextSelected]}>
                {value.toString().padStart(2, '0')}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

interface DurationPickerProps {
  hours: number;
  minutes: number;
  seconds: number;
  onChangeHours: (h: number) => void;
  onChangeMinutes: (m: number) => void;
  onChangeSeconds: (s: number) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const SIXTY = Array.from({ length: 60 }, (_, i) => i);

export default function DurationPicker({
  hours,
  minutes,
  seconds,
  onChangeHours,
  onChangeMinutes,
  onChangeSeconds,
}: DurationPickerProps) {
  return (
    <View style={styles.container}>
      <WheelColumn data={HOURS} selected={hours} onChange={onChangeHours} label="时" />
      <WheelColumn data={SIXTY} selected={minutes} onChange={onChangeMinutes} label="分" />
      <WheelColumn data={SIXTY} selected={seconds} onChange={onChangeSeconds} label="秒" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: PICKER_HEIGHT,
  },
  columnWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  columnContainer: {
    height: PICKER_HEIGHT,
    width: 60,
    position: 'relative',
  },
  scrollView: {
    height: PICKER_HEIGHT,
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2),
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    zIndex: 1,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    color: '#8E8E93',
    fontSize: 22,
  },
  itemTextSelected: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 17,
    marginLeft: 4,
    marginRight: 14,
  },
});
