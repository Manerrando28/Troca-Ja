import { useCallback, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useMotionPreferences } from '@/state/MotionProvider';
import { Colors } from '@/tokens/theme';

/** Decoração sem interação, fora da lista para não disputar gestos ou rolagem. */
export default function HomeBackdrop() {
  const { width } = useWindowDimensions();
  const size = Math.min(width, 560) * 1.18;
  const [breath] = useState(() => new Animated.Value(0));
  const { reduceMotion, appActive } = useMotionPreferences();

  useFocusEffect(useCallback(() => {
    if (reduceMotion || !appActive) { breath.setValue(0); return; }
    const options = { duration: 3600, easing: Easing.inOut(Easing.sin),
      useNativeDriver: Platform.OS !== 'web', isInteraction: false };
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(breath, { ...options, toValue: 1 }),
      Animated.timing(breath, { ...options, toValue: 0 }),
    ]));
    animation.start();
    return () => { animation.stop(); breath.setValue(0); };
  }, [appActive, breath, reduceMotion]));

  return <View pointerEvents="none" accessible={false} accessibilityElementsHidden
    importantForAccessibility="no-hide-descendants" style={styles.background} testID="home-backdrop">
    <LinearGradient colors={[Colors.brandMist, Colors.mintMist, Colors.background]}
      locations={[0, 0.48, 1]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0.9 }} style={StyleSheet.absoluteFill} />
    <View style={[styles.orbit, { width: size, height: size, right: -size * 0.48 }]} />
    <Animated.Image source={require('../../assets/ui-images/logo.png')} resizeMode="contain"
      testID="home-brand-watermark" style={[styles.logo, { width: size, height: size, right: -size * 0.38,
        opacity: breath.interpolate({ inputRange: [0, 1], outputRange: [0.15, 0.23] }),
        transform: [
          { translateY: breath.interpolate({ inputRange: [0, 1], outputRange: [0, -12] }) },
          { scale: breath.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1.04] }) },
          { rotate: breath.interpolate({ inputRange: [0, 1], outputRange: ['-8deg', '0deg'] }) },
        ],
      }]} />
  </View>;
}

const styles = StyleSheet.create({
  background: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden' },
  logo: { position: 'absolute', top: 32 },
  orbit: { position: 'absolute', top: 38, borderRadius: 999, borderWidth: 1, borderColor: Colors.brandOrbit },
});
