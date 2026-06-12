import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../constants/colors';

interface Props {
  cartCount: number;
  cartTotal: number;
  onPress: () => void;
}

export default function CartFAB({ cartCount, cartTotal, onPress }: Props) {
  const translateY = useRef(new Animated.Value(100)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (cartCount > 0) {
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, friction: 7, tension: 60, useNativeDriver: false }),
        Animated.spring(scale, { toValue: 1, friction: 7, tension: 60, useNativeDriver: false }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 100, duration: 200, useNativeDriver: false }),
        Animated.timing(scale, { toValue: 0.8, duration: 200, useNativeDriver: false }),
      ]).start();
    }
  }, [cartCount]);

  if (cartCount === 0) return null;

  return (
    <Animated.View style={[s.wrapper, { transform: [{ translateY }, { scale }] }]}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={s.touch}>
        <LinearGradient
          colors={[C.accent, C.accentDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={s.gradient}
        >
          <View style={s.left}>
            <View style={s.badge}>
              <Text style={s.badgeText}>{cartCount}</Text>
            </View>
            <Text style={s.label}>View Cart</Text>
          </View>
          <Text style={s.total}>₹{cartTotal} →</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    borderRadius: 18,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  touch: { borderRadius: 18, overflow: 'hidden' },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  left: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    backgroundColor: C.bg,
    borderRadius: 12,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeText: { color: C.accent, fontFamily: 'Outfit_900Black', fontSize: 13 },
  label: { color: C.bg, fontFamily: 'Outfit_700Bold', fontSize: 15 },
  total: { color: C.bg, fontFamily: 'Outfit_900Black', fontSize: 16 },
});
