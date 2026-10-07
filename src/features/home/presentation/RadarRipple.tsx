import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { radarPalette } from "@/shared/theme/tokens";

type RippleRingProps = {
  size: number;
  delay: number;
  x: number;
  y: number;
};

function RippleRing({ size, delay, x, y }: RippleRingProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, {
          duration: 1400,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false
      )
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 0.3 + progress.value * 0.7 }],
    opacity: 0.9 * (1 - progress.value),
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2,
          borderColor: radarPalette.ripple,
          left: x - size / 2,
          top: y - size / 2,
        },
        animatedStyle,
      ]}
    />
  );
}

type RadarRippleProps = {
  point: { x: number; y: number } | null;
};

export function RadarRipple({ point }: RadarRippleProps) {
  if (point === null) {
    return null;
  }

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <RippleRing size={48} delay={0} x={point.x} y={point.y} />
      <RippleRing size={88} delay={220} x={point.x} y={point.y} />
      <RippleRing size={128} delay={440} x={point.x} y={point.y} />
    </View>
  );
}
