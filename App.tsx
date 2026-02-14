import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Dimensions, Platform, TouchableWithoutFeedback } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Logo } from './components/Logo';
import { AnimatedDigit } from './components/AnimatedDigit';

/**
 * App 主组件
 * 实现数字时钟、主题切换、横竖屏切换和全屏显示功能
 */
export default function App() {
  // 当前时间状态
  const [time, setTime] = useState(new Date());
  // 主题状态，默认为 'dark' (黑底白字)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  // 屏幕方向状态
  const [orientation, setOrientation] = useState<ScreenOrientation.Orientation>(ScreenOrientation.Orientation.PORTRAIT_UP);
  // 全屏状态
  const [isFullscreen, setIsFullscreen] = useState(false);
  // 动画效果开关
  const [isAnimationEnabled, setIsAnimationEnabled] = useState(true);

  // 初始化时设置为横屏
  useEffect(() => {
    // 锁定为横屏
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    
    // 监听屏幕方向变化
    const subscription = ScreenOrientation.addOrientationChangeListener((evt) => {
      setOrientation(evt.orientationInfo.orientation);
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);

  // 定时器，每秒更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 清除定时器
    return () => clearInterval(timer);
  }, []);

  /**
   * 格式化时间为 HH:mm:ss 的字符串数组
   */
  const getTimeParts = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    // 返回字符数组，例如 ['1', '2', ':', '3', '0', ':', '4', '5']
    return `${hours}:${minutes}:${seconds}`.split('');
  };

  /**
   * 切换主题
   */
  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  /**
   * 切换屏幕方向
   */
  const toggleOrientation = async () => {
    const currentOrientation = await ScreenOrientation.getOrientationAsync();
    if (currentOrientation === ScreenOrientation.Orientation.PORTRAIT_UP || 
        currentOrientation === ScreenOrientation.Orientation.PORTRAIT_DOWN) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    }
  };

  /**
   * 切换全屏模式
   */
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  /**
   * 切换动画开关
   */
  const toggleAnimation = () => {
    setIsAnimationEnabled(prev => !prev);
  };

  // 根据主题定义颜色
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#000000' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : '#000000';
  const statusBarStyle = isDark ? 'light' : 'dark';

  // 根据方向判断是否为横屏
  const isLandscape = orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT || 
                     orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;

  // 计算字体大小和行高
  const fontSize = isLandscape 
    ? (isFullscreen ? 150 : 120) 
    : 80;
  const lineHeight = fontSize * 1.2;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar hidden={isFullscreen} style={statusBarStyle} />
      
      <TouchableWithoutFeedback onPress={isFullscreen ? toggleFullscreen : undefined}>
        <View style={[styles.content, isLandscape && styles.contentLandscape, isFullscreen && styles.contentFullscreen]}>
          
          {/* 非全屏模式下显示 Logo */}
          {!isFullscreen && (
            <View style={styles.logoContainer}>
              <Logo width={isLandscape ? 80 : 120} height={isLandscape ? 80 : 120} />
            </View>
          )}

          {/* 时钟部分 */}
          <View style={[styles.clockContainer, { flexDirection: 'row' }]}>
            {getTimeParts(time).map((char, index) => (
              <AnimatedDigit
                key={index}
                value={char}
                style={{
                  fontSize,
                  fontWeight: 'bold',
                  fontVariant: ['tabular-nums'],
                  color: textColor,
                  // 针对冒号进行微调，使其视觉上居中
                  ...(char === ':' && { 
                    transform: [{ translateY: -fontSize * 0.1 }],
                    lineHeight: undefined // 移除行高限制，允许 transform 生效而不被裁剪
                  }),
                }}
                height={lineHeight}
                isAnimated={isAnimationEnabled && char !== ':'} // 冒号不动画
              />
            ))}
          </View>

          {/* 非全屏模式下显示按钮 */}
          {!isFullscreen && (
            <View style={[styles.buttonContainer, isLandscape && styles.buttonContainerLandscape]}>
              {/* 主题切换按钮 */}
              <TouchableOpacity 
                style={[styles.button, { borderColor: textColor }]} 
                onPress={toggleTheme}
              >
                <Text style={[styles.buttonText, { color: textColor }]}>
                  {isDark ? '浅色' : '深色'}
                </Text>
              </TouchableOpacity>

              {/* 方向切换按钮 */}
              <TouchableOpacity 
                style={[styles.button, { borderColor: textColor }]} 
                onPress={toggleOrientation}
              >
                <Text style={[styles.buttonText, { color: textColor }]}>
                  切换方向
                </Text>
              </TouchableOpacity>

              {/* 动画切换按钮 */}
              <TouchableOpacity 
                style={[styles.button, { borderColor: textColor }]} 
                onPress={toggleAnimation}
              >
                <Text style={[styles.buttonText, { color: textColor }]}>
                  动画: {isAnimationEnabled ? '开' : '关'}
                </Text>
              </TouchableOpacity>

              {/* 全屏切换按钮 */}
              <TouchableOpacity 
                style={[styles.button, { borderColor: textColor }]} 
                onPress={toggleFullscreen}
              >
                <Text style={[styles.buttonText, { color: textColor }]}>
                  全屏显示
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
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
    marginTop: 20,
  },
  clockContainer: {
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
    borderRadius: 20,
    marginVertical: 5,
    marginHorizontal: 5,
    minWidth: 90,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
