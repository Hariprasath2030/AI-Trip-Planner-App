import { useEffect, useRef, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

const SPRING_OUT = { toValue: 1, friction: 5, tension: 60, useNativeDriver: true } as const;
const SPRING_IN = { toValue: 0.96, friction: 6, tension: 90, useNativeDriver: true } as const;

type FadeSlideInProps = {
  children: ReactNode;
  delay?: number;
  distance?: number;
  style?: StyleProp<ViewStyle>;
};

export function FadeSlideIn({ children, delay = 0, distance = 22, style }: FadeSlideInProps) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 480,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [progress, delay]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [distance, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

type AnimatedPressableProps = PressableProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
};

export function AnimatedPressable({ children, style, scaleTo = 0.96, ...rest }: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      {...rest}
      onPressIn={(event) => {
        Animated.spring(scale, { toValue: scaleTo, useNativeDriver: true }).start();
        rest.onPressIn?.(event);
      }}
      onPressOut={(event) => {
        Animated.spring(scale, SPRING_OUT as never).start();
        rest.onPressOut?.(event);
      }}
      onPress={(event) => {
        Animated.spring(scale, SPRING_IN as never).start(() =>
          Animated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }).start()
        );
        rest.onPress?.(event);
      }}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}

export function useCountUp(target: number, duration = 900) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(value, {
      toValue: target,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [value, target, duration]);
  return value;
}

export function usePulse(period = 1600) {
  const value = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, { toValue: 1, duration: period / 2, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(value, { toValue: 0, duration: period / 2, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [value, period]);
  return value;
}

export const styles = StyleSheet.create({
  hidden: { opacity: 0 },
});
