import React, { useRef } from 'react';
import {
  Animated, Image, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { C } from '../constants/colors';
import { MenuItem } from '../constants/menu';

interface Props {
  item: MenuItem;
  cartQty: number;
  rating?: { avg: number; count: number };
  onAdd: () => void;
  onRemove: () => void;
}

const MenuCard = React.memo(({ item, cartQty, rating, onAdd, onRemove }: Props) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleAdd = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: false }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: false }),
    ]).start();
    onAdd();
  };

  return (
    <Animated.View style={[s.card, { transform: [{ scale: scaleAnim }] }]}>
      {/* Image */}
      <View style={s.imageWrap}>
        <Image source={{ uri: item.image }} style={s.image} resizeMode="cover" />
        {/* Veg / Non-veg dot */}
        <View style={[s.vegDot, { borderColor: item.category.toLowerCase().includes('veg') && !item.category.toLowerCase().includes('non') ? '#22c55e' : '#ef4444' }]}>
          <View style={[s.vegDotInner, { backgroundColor: item.category.toLowerCase().includes('veg') && !item.category.toLowerCase().includes('non') ? '#22c55e' : '#ef4444' }]} />
        </View>
      </View>

      {/* Info */}
      <View style={s.info}>
        <Text style={s.name} numberOfLines={2}>{item.name}</Text>
        
        <View style={s.metaRow}>
          <Text style={s.cat} numberOfLines={1}>{item.category}</Text>
          <View style={s.ratingBadge}>
            <Text style={s.ratingStar}>★</Text>
            <Text style={s.ratingText}>
              {rating && rating.count > 0 ? `${rating.avg.toFixed(1)} (${rating.count})` : 'New'}
            </Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.price}>₹{item.price}</Text>

          {cartQty === 0 ? (
            <TouchableOpacity style={s.addBtn} onPress={handleAdd} activeOpacity={0.85}>
              <Text style={s.addBtnText}>+ ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={s.qtyRow}>
              <TouchableOpacity style={s.qtyMinus} onPress={onRemove} activeOpacity={0.8}>
                <Text style={s.qtyMinusText}>−</Text>
              </TouchableOpacity>
              <Text style={s.qtyNum}>{cartQty}</Text>
              <TouchableOpacity style={s.qtyPlus} onPress={handleAdd} activeOpacity={0.8}>
                <Text style={s.qtyPlusText}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
});

MenuCard.displayName = 'MenuCard';
export default MenuCard;

const s = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: C.surfaceHigh,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  vegDot: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
  },
  vegDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  info: {
    padding: 10,
    flex: 1,
  },
  name: {
    color: C.text,
    fontSize: 12,
    fontFamily: 'Outfit_700Bold',
    lineHeight: 17,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cat: {
    flex: 1,
    color: C.textMuted,
    fontSize: 9,
    fontFamily: 'Outfit_400Regular',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,158,11,0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingStar: { color: C.accent, fontSize: 10, marginRight: 2 },
  ratingText: { color: C.accent, fontSize: 9, fontFamily: 'Outfit_700Bold' },

  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    color: C.accent,
    fontSize: 15,
    fontFamily: 'Outfit_800ExtraBold',
  },

  addBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: C.accent,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addBtnText: {
    color: C.accent,
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 11,
    letterSpacing: 0.3,
  },

  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyMinus: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: C.surfaceHigh,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  qtyMinusText: { color: C.text, fontSize: 15, fontFamily: 'Outfit_700Bold', lineHeight: 20 },
  qtyNum: { color: C.text, fontFamily: 'Outfit_800ExtraBold', fontSize: 13, marginHorizontal: 6 },
  qtyPlus: {
    width: 26, height: 26, borderRadius: 8,
    backgroundColor: C.accent,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyPlusText: { color: C.bg, fontSize: 15, fontFamily: 'Outfit_700Bold', lineHeight: 20 },
});
