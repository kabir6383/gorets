import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C } from '../constants/colors';

interface Props {
  label: string;
  icon: string;
  active: boolean;
  onPress: () => void;
}

export default function CategoryPill({ label, icon, active, onPress }: Props) {
  const shortLabel = label === 'All' ? 'All' : label.length > 10 ? label.split(' ')[0] : label;

  return (
    <TouchableOpacity
      style={[s.pill, active && s.pillActive]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={s.icon}>{icon}</Text>
      {active && <Text style={[s.text, s.textActive]} numberOfLines={1}>{shortLabel}</Text>}
      {!active && <Text style={s.text} numberOfLines={1}>{shortLabel}</Text>}
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: C.surfaceHigh,
    borderWidth: 1,
    borderColor: C.border,
    marginRight: 8,
    gap: 5,
  },
  pillActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  icon: { fontSize: 15 },
  text: {
    color: C.textSec,
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    maxWidth: 72,
  },
  textActive: { color: C.bg },
});
