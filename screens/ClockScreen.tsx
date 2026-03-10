import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Logo } from '../components/Logo';
import { AnimatedDigit } from '../components/AnimatedDigit';

export default function ClockScreen() {
  const [time, setTime] = useState(new Date());
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation>(
    ScreenOrientation.Orientation.PORTRAIT_UP
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener((evt) => {
      setOrientation(evt.orientationInfo.orientation);
    });
    ScreenOrientation.getOrientationAsync().then(setOrientation);
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getTimeParts = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`.split('');
  };

  const toggleOrientation = async () => {
    const cur = await ScreenOrientation.getOrientationAsync();
    if (
      cur === ScreenOrientation.Orientation.PORTRAIT_UP ||
      cur === ScreenOrientation.Orientation.PORTRAIT_DOWN
    ) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  };

  const isLandscape =
    orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
    orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

  const fontSize = isLandscape ? (isFullscreen ? 150 : 120) : 80;
  const lineHeight = fontSize * 1.2;
  const textColor = '#FFFFFF';

  return (
    <TouchableWithoutFeedback onPress={isFullscreen ? () => setIsFullscreen(false) : undefined}>
      <View style={[styles.content, isLandscape && styles.contentLandscape, isFullscreen && styles.contentFullscreen]}>
        {!isFullscreen && (
          <View style={styles.logoContainer}>
            <Logo width={isLandscape ? 80 : 120} height={isLandscape ? 80 : 120} />
          </View>
        )}

        <View style={styles.clockContainer}>
          {getTimeParts(time).map((char, index) => (
            <AnimatedDigit
              key={index}
              value={char}
              style={{
                fontSize,
                fontWeight: 'bold',
                fontVariant: ['tabular-nums'],
                color: textColor,
                ...(char === ':' && {
                  transform: [{ translateY: -fontSize * 0.1 }],
                  lineHeight: undefined,
                }),
              }}
              height={lineHeight}
              isAnimated={isAnimationEnabled && char !== ':'}
            />
          ))}
        </View>

        {!isFullscreen && (
          <View style={[styles.buttonContainer, isLandscape && styles.buttonContainerLandscape]}>
            <TouchableOpacity style={styles.button} onPress={toggleOrientation}>
              <Text style={styles.buttonText}>切换方向</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setIsAnimationEnabled((v) => !v)}>
              <Text style={styles.buttonText}>动画: {isAnimationEnabled ? '开' : '关'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setIsFullscreen(true)}>
              <Text style={styles.buttonText}>全屏显示</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
    backgroundColor: '#000000',
  },
  contentLandscape: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 40,
    justifyContent: 'space-around',
  },
  contentFullscreen: {
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  logoContainer: {
    marginTop: 10,
  },
  clockContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  buttonContainerLandscape: {
    flexDirection: 'column',
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 5,
    minWidth: 90,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#FFFFFF',
  },
});
