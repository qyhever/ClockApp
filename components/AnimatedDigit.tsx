import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, Animated, Easing, TextStyle } from 'react-native';

interface AnimatedDigitProps {
  value: string;
  style?: TextStyle;
  isAnimated?: boolean;
  height: number;
}

export const AnimatedDigit = ({ value, style, isAnimated = true, height }: AnimatedDigitProps) => {
  const [currentValue, setCurrentValue] = useState(value);
  const [previousValue, setPreviousValue] = useState(value);
  
  // 动画值：0 -> 1
  const animatedValue = useRef(new Animated.Value(0)).current;

  // 监听值变化
  useEffect(() => {
    if (value === currentValue) return;

    if (!isAnimated) {
      setCurrentValue(value);
      setPreviousValue(value);
      return;
    }

    setPreviousValue(currentValue);
    setCurrentValue(value);
    
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [value, isAnimated]); // 移除 currentValue 依赖，防止循环

  if (!isAnimated) {
    return (
      <View style={{ height, overflow: 'hidden', justifyContent: 'center' }}>
        <Text style={[style, { height, lineHeight: height }]}>{value}</Text>
      </View>
    );
  }

  const translateYOld = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height],
  });

  const opacityOld = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const translateYNew = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [height, 0],
  });

  const opacityNew = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={{ height, overflow: 'hidden', width: (style?.fontSize || 80) * 0.6 }}>
      {/* 旧数字 */}
      <Animated.Text
        style={[
          style,
          {
            position: 'absolute',
            top: 0,
            opacity: opacityOld,
            transform: [{ translateY: translateYOld }],
            height,
            lineHeight: height,
            width: '100%',
            textAlign: 'center',
          },
        ]}
      >
        {previousValue}
      </Animated.Text>

      {/* 新数字 */}
      <Animated.Text
        style={[
          style,
          {
            position: 'absolute',
            top: 0,
            opacity: opacityNew,
            transform: [{ translateY: translateYNew }],
            height,
            lineHeight: height,
            width: '100%',
            textAlign: 'center',
          },
        ]}
      >
        {currentValue}
      </Animated.Text>
    </View>
  );
};
