import React, { useEffect, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ScalePressableProps extends PressableProps {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/**
 * Botão/Card com feedback tátil sutil por opacidade (sem efeito elástico).
 */
export function ScalePressable({
  style,
  onPressIn,
  onPressOut,
  disabled,
  children,
  ...rest
}: ScalePressableProps) {
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={(event) => {
        if (!reducedMotion && !disabled) {
          opacity.set(withTiming(0.75, { duration: 90 }));
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        if (!reducedMotion) {
          opacity.set(withTiming(1, { duration: 140 }));
        }
        onPressOut?.(event);
      }}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

interface FadeInSectionProps {
  delay?: number;
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

/**
 * Entrada suave e discreta de blocos na tela respeitando "reduzir movimento".
 */
export function FadeInSection({
  delay = 0,
  style,
  children,
}: FadeInSectionProps) {
  const reducedMotion = useReducedMotion();
  const entering = reducedMotion
    ? FadeIn.duration(120)
    : FadeIn.duration(220).delay(Math.min(delay, 120));

  return (
    <Animated.View entering={entering} style={style}>
      {children}
    </Animated.View>
  );
}

function EqualizerBar({
  color,
  isPlaying,
  delayMs,
  maxHeight,
}: {
  color: string;
  isPlaying: boolean;
  delayMs: number;
  maxHeight: number;
}) {
  const reducedMotion = useReducedMotion();
  const height = useSharedValue(isPlaying ? maxHeight * 0.55 : 4);

  useEffect(() => {
    if (isPlaying && !reducedMotion) {
      height.value = withDelay(
        delayMs,
        withRepeat(
          withSequence(
            withTiming(maxHeight, { duration: 280 }),
            withTiming(4, { duration: 320 })
          ),
          -1,
          true
        )
      );
    } else {
      height.value = withTiming(isPlaying ? maxHeight * 0.65 : 4, {
        duration: 180,
      });
    }
  }, [delayMs, height, isPlaying, maxHeight, reducedMotion]);

  const barStyle = useAnimatedStyle(() => ({
    height: height.value,
  }));

  return (
    <Animated.View
      style={[
        styles.eqBar,
        { backgroundColor: color },
        barStyle,
      ]}
    />
  );
}

/**
 * Equalizador animado de 3 barras indicando reprodução ativa em tempo real.
 */
export function PlayingEqualizer({
  isPlaying,
  color,
  size = 14,
}: {
  isPlaying: boolean;
  color: string;
  size?: number;
}) {
  return (
    <View
      style={[styles.eqRow, { height: size }]}
      accessibilityLabel={isPlaying ? 'Reproduzindo agora' : 'Pausado'}
    >
      <EqualizerBar
        color={color}
        isPlaying={isPlaying}
        delayMs={0}
        maxHeight={size}
      />
      <EqualizerBar
        color={color}
        isPlaying={isPlaying}
        delayMs={110}
        maxHeight={Math.max(size - 2, 8)}
      />
      <EqualizerBar
        color={color}
        isPlaying={isPlaying}
        delayMs={220}
        maxHeight={size}
      />
    </View>
  );
}

/**
 * Indicador pulsante ao vivo usado no perfil de amigos ("Ouvindo agora").
 */
export function PulsingLiveDot({
  color,
  size = 8,
}: {
  color: string;
  size?: number;
}) {
  const reducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (reducedMotion) return;
    scale.value = withRepeat(
      withSequence(
        withTiming(1.35, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      true
    );
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.45, { duration: 700 }),
        withTiming(1, { duration: 700 })
      ),
      -1,
      true
    );
  }, [opacity, reducedMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
        animatedStyle,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  eqRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  eqBar: {
    width: 3,
    borderRadius: 2,
  },
});
