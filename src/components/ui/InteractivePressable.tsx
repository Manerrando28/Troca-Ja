import { useEffect, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import { useMotionPreferences } from '@/state/MotionProvider';
import { Colors } from '@/tokens/theme';

type Props = PressableProps & { hoverStyle?: StyleProp<ViewStyle>; lift?: number };

/** Hover e foco no desktop; feedback de pressão no celular. */
export default function InteractivePressable({ style, hoverStyle, lift = 2, disabled, ...props }: Props) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const { reduceMotion, appActive } = useMotionPreferences();
  const [motion] = useState(() => new Animated.Value(0));
  const highlighted = !disabled && (hovered || focused);

  useEffect(() => {
    if (reduceMotion || !appActive || disabled) { motion.setValue(0); return; }
    const animation = Animated.timing(motion, { toValue: pressed ? -1 : highlighted ? 1 : 0,
      duration: pressed ? 100 : 180, useNativeDriver: Platform.OS !== 'web', isInteraction: false });
    animation.start();
    return () => animation.stop();
  }, [appActive, disabled, highlighted, motion, pressed, reduceMotion]);

  return <Animated.View style={{ transform: [
    { translateY: motion.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 0, -lift] }) },
    { scale: motion.interpolate({ inputRange: [-1, 0, 1], outputRange: [0.985, 1, 1.006] }) },
  ] }}>
    <Pressable {...props} disabled={disabled}
      onHoverIn={event => { setHovered(true); props.onHoverIn?.(event); }}
      onHoverOut={event => { setHovered(false); props.onHoverOut?.(event); }}
      onFocus={event => { setFocused(true); props.onFocus?.(event); }}
      onBlur={event => { setFocused(false); setPressed(false); props.onBlur?.(event); }}
      onPressIn={event => { setPressed(true); props.onPressIn?.(event); }}
      onPressOut={event => { setPressed(false); props.onPressOut?.(event); }}
      style={state => [typeof style === 'function' ? style(state) : style,
        highlighted && hoverStyle, focused && !disabled && Platform.OS === 'web' && styles.focus]} />
  </Animated.View>;
}

const styles = StyleSheet.create({
  focus: { outlineColor: Colors.primary, outlineStyle: 'solid', outlineWidth: 2, outlineOffset: 3 },
});
