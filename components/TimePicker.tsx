import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Dimensions,
} from 'react-native';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

interface WheelColumnProps {
  data: number[];
  selected: number;
  onChange: (value: number) => void;
  formatLabel?: (value: number) => string;
}

function WheelColumn({ data, selected, onChange, formatLabel }: WheelColumnProps) {
  const scrollRef = useRef<ScrollView>(null);
  const isUserScroll = useRef(true);

  useEffect(() => {
    const index = data.indexOf(selected);
    if (index >= 0 && scrollRef.current) {
      isUserScroll.current = false;
      scrollRef.current.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
    }
  }, [selected, data]);

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
    <View style={styles.columnContainer}>
      {/* 选中行高亮 */}
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
        {data.map((value) => {
          const label = formatLabel ? formatLabel(value) : value.toString().padStart(2, '0');
          return (
            <View key={value} style={styles.item}>
              <Text style={[styles.itemText, value === selected && styles.itemTextSelected]}>
                {label}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

interface TimePickerProps {
  hour: number;
  minute: number;
  onChangeHour: (h: number) => void;
  onChangeMinute: (m: number) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export default function TimePicker({ hour, minute, onChangeHour, onChangeMinute }: TimePickerProps) {
  return (
    <View style={styles.container}>
      <WheelColumn data={HOURS} selected={hour} onChange={onChangeHour} />
      <Text style={styles.separator}>:</Text>
      <WheelColumn data={MINUTES} selected={minute} onChange={onChangeMinute} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: PICKER_HEIGHT,
  },
  columnContainer: {
    height: PICKER_HEIGHT,
    width: 80,
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
  separator: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginHorizontal: 6,
  },
});
