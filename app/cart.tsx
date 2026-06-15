import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../constants/colors';
import { STATIC_MENU } from '../constants/menu';
import { db } from '../utils/firebase';
import { ref, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCart } from '../store/cart';
import { useAuth } from '../store/auth';

// A few popular suggestions shown when cart is empty
const SUGGESTIONS = STATIC_MENU.slice(0, 6);

export default function CartScreen() {
  const router = useRouter();
  const { cartItems, cartCount, cartTotal, addToCart, removeFromCart, clearCart, myOrders } = useCart();
  const { user } = useAuth();
  const [orderStatuses, setOrderStatuses] = useState<Record<string, string>>({});

  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + tax;

  const handleClear = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    clearCart();
  };

  useEffect(() => {
    if (!myOrders || myOrders.length === 0) return;
    
    const checkStatuses = async () => {
      try {
        const newStatuses: Record<string, string> = {};
        
        // Check Realtime Database
        const promises = myOrders.map(id => get(ref(db, 'orders/' + id)));
        const snapshots = await Promise.all(promises);
        snapshots.forEach(snap => {
          if (snap.exists()) {
            const d = snap.val();
            newStatuses[d.id] = d.status;
          }
        });
        
        // Check local fallback
        const offlineStr = await AsyncStorage.getItem('offline_orders');
        if (offlineStr) {
          const offlineOrders = JSON.parse(offlineStr);
          offlineOrders.forEach((offO: any) => {
            if (!newStatuses[offO.id]) {
              newStatuses[offO.id] = offO.status;
            }
          });
        }
        
        setOrderStatuses(newStatuses);
      } catch {}
    };
    
    checkStatuses();
    const interval = setInterval(checkStatuses, 5000);
    return () => clearInterval(interval);
  }, [myOrders]);

  const renderMyOrders = () => {
    if (!myOrders || myOrders.length === 0) return null;
    return (
      <View style={s.myOrdersContainer}>
        <Text style={s.myOrdersHeader}>📦 Your Recent Orders</Text>
        {myOrders.map(id => {
          const st = orderStatuses[id] || 'fetching...';
          const isDone = st === 'cancelled' || st === 'completed';
          const isCancelled = st === 'cancelled';
          return (
            <TouchableOpacity 
              key={id}
              style={[s.activeOrderBanner, isDone && s.activeOrderBannerDone]} 
              activeOpacity={0.8}
              onPress={() => router.push({ pathname: '/confirm', params: { orderId: id } })}
            >
              <LinearGradient 
                colors={isCancelled ? ['rgba(239,68,68,0.1)', 'rgba(239,68,68,0.02)'] : isDone ? ['rgba(156,163,175,0.1)', 'rgba(156,163,175,0.02)'] : ['rgba(16,185,129,0.15)', 'rgba(16,185,129,0.05)']} 
                style={s.activeOrderGrad}
              >
                <View style={s.activeOrderInfo}>
                  <Text style={s.activeOrderTitle}>Order {id.split('-')[1] || id}</Text>
                  <Text style={[s.activeOrderStatus, isCancelled && {color: C.error}, isDone && !isCancelled && {color: C.textSec}]}>
                    Status: {st.toUpperCase()}
                  </Text>
                </View>
                <Text style={[s.activeOrderArrow, isCancelled && {color: C.error}, isDone && !isCancelled && {color: C.textSec}]}>
                  Track →
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // ── Empty Cart ─────────────────────────────────────────────────────────────
  if (cartCount === 0) {
    return (
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity 
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
            style={s.backCircle} 
            activeOpacity={0.7}
          >
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={s.title}>Your Cart</Text>
            <Text style={s.subtitle}>0 items</Text>
          </View>
        </View>

        {renderMyOrders()}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.emptyScroll}>

          {/* Empty illustration */}
          <View style={s.emptyHero}>
            <Text style={s.emptyCartEmoji}>🛒</Text>
            <Text style={s.emptyTitle}>Your cart is empty!</Text>
            <Text style={s.emptySubtitle}>
              Looks like you haven't added{'\n'}anything yet. Let's fix that!
            </Text>
            <TouchableOpacity
              style={s.browseBtn}
              onPress={() => router.replace('/')}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[C.accent, C.accentDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={s.browseBtnGrad}
              >
                <Text style={s.browseBtnText}>Browse Menu →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={s.suggestionHeader}>
            <View style={s.suggestionLine} />
            <Text style={s.suggestionLabel}>✨  Popular picks for you</Text>
            <View style={s.suggestionLine} />
          </View>

          {/* Suggestion cards */}
          <View style={s.suggestionGrid}>
            {SUGGESTIONS.map(item => (
              <View key={item.id} style={s.suggCard}>
                <Image source={{ uri: item.image }} style={s.suggImg} resizeMode="cover" />
                <View style={s.suggInfo}>
                  <Text style={s.suggName} numberOfLines={2}>{item.name}</Text>
                  <Text style={s.suggCat} numberOfLines={1}>{item.category}</Text>
                  <View style={s.suggFooter}>
                    <Text style={s.suggPrice}>₹{item.price}</Text>
                    <TouchableOpacity
                      style={s.suggAddBtn}
                      onPress={() => {
                        addToCart(item);
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={s.suggAddText}>+ ADD</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Cart with items ────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity 
          onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
          style={s.backCircle} 
          activeOpacity={0.7}
        >
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.title}>Your Cart</Text>
          <Text style={s.subtitle}>{cartCount} {cartCount === 1 ? 'item' : 'items'}</Text>
        </View>
        <TouchableOpacity onPress={handleClear} style={s.clearBtn} activeOpacity={0.7}>
          <Text style={s.clearBtnText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {renderMyOrders()}

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Cart Items */}
        <View style={s.itemsCard}>
          {cartItems.map((item, idx) => (
            <View key={item.id}>
              <View style={s.cartRow}>
                <Image source={{ uri: item.image }} style={s.rowImg} resizeMode="cover" />
                <View style={s.rowInfo}>
                  <Text style={s.rowName} numberOfLines={2}>{item.name}</Text>
                  <Text style={s.rowCat}>{item.category}</Text>
                  <Text style={s.rowPrice}>
                    ₹{item.price} × {item.quantity}{' '}
                    = <Text style={s.rowTotal}>₹{item.price * item.quantity}</Text>
                  </Text>
                </View>
                <View style={s.qtyCol}>
                  <TouchableOpacity
                    style={s.qtyBtnWrap}
                    onPress={() => { addToCart(item); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    activeOpacity={0.8}
                  >
                    <LinearGradient colors={[C.accent, C.accentDark]} style={s.qtyBtnGrad}>
                      <Text style={s.qtyBtnText}>+</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  <Text style={s.qtyNum}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={s.qtyBtnPlain}
                    onPress={() => { removeFromCart(item.id); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                    activeOpacity={0.8}
                  >
                    <Text style={s.qtyBtnPlainText}>−</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {idx < cartItems.length - 1 && <View style={s.sep} />}
            </View>
          ))}
        </View>

        {/* Savings banner */}
        <View style={s.savingsBanner}>
          <Text style={s.savingsIcon}>🎉</Text>
          <Text style={s.savingsText}>You're dining in — no delivery charges!</Text>
        </View>

        {/* Bill breakdown */}
        <View style={s.billCard}>
          <Text style={s.billTitle}>Bill Details</Text>
          <View style={s.billRow}>
            <Text style={s.billLabel}>Item Total</Text>
            <Text style={s.billValue}>₹{cartTotal}</Text>
          </View>
          <View style={s.billRow}>
            <Text style={s.billLabel}>GST (5%)</Text>
            <Text style={s.billValue}>₹{tax}</Text>
          </View>
          <View style={s.billDivider} />
          <View style={s.billRow}>
            <Text style={s.billTotalLabel}>To Pay</Text>
            <Text style={s.billTotalValue}>₹{total}</Text>
          </View>
        </View>

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* Checkout footer */}
      <View style={s.footer}>
        <View style={s.footerTop}>
          <Text style={s.footerTotal}>₹{total}</Text>
          <Text style={s.footerHint}>Total payable</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            if (!user) {
              router.push('/login');
            } else {
              router.push('/order');
            }
          }}
          activeOpacity={0.88}
          style={s.checkoutTouch}
        >
          <LinearGradient
            colors={[C.accent, C.accentDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={s.checkoutBtn}
          >
            <Text style={s.checkoutText}>Proceed to Order →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    gap: 12,
  },
  backCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: C.surfaceHigh,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  backArrow: { fontSize: 18, color: C.text },
  title: { fontSize: 18, fontFamily: 'Outfit_800ExtraBold', color: C.text },
  subtitle: { fontSize: 12, fontFamily: 'Outfit_400Regular', color: C.textMuted, marginTop: 1 },
  clearBtn: { marginLeft: 'auto' },
  clearBtnText: { color: C.error, fontFamily: 'Outfit_600SemiBold', fontSize: 13 },

  // Active Order Banner
  myOrdersContainer: { marginTop: 16, marginBottom: 8 },
  myOrdersHeader: { marginHorizontal: 16, fontSize: 14, fontFamily: 'Outfit_800ExtraBold', color: C.text, marginBottom: 6 },
  activeOrderBanner: { marginHorizontal: 16, marginBottom: 8, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)' },
  activeOrderBannerDone: { borderColor: C.border },
  activeOrderGrad: { padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  activeOrderInfo: { flex: 1 },
  activeOrderTitle: { color: C.text, fontSize: 13, fontFamily: 'Outfit_800ExtraBold', marginBottom: 2 },
  activeOrderStatus: { color: C.success, fontSize: 11, fontFamily: 'Outfit_700Bold', letterSpacing: 0.5 },
  activeOrderArrow: { color: C.success, fontSize: 13, fontFamily: 'Outfit_800ExtraBold' },

  // ── Empty cart ─────────────────────────────────────────────────────────────
  emptyScroll: { paddingHorizontal: 16 },

  emptyHero: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
  },
  emptyCartEmoji: { fontSize: 80, marginBottom: 16 },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Outfit_900Black',
    color: C.text,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
    color: C.textSec,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  browseBtn: { borderRadius: 16, overflow: 'hidden', width: '100%' },
  browseBtnGrad: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  browseBtnText: { color: C.bg, fontFamily: 'Outfit_900Black', fontSize: 16 },

  // Suggestions
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  suggestionLine: { flex: 1, height: 1, backgroundColor: C.border },
  suggestionLabel: {
    color: C.textSec,
    fontSize: 12,
    fontFamily: 'Outfit_600SemiBold',
    letterSpacing: 0.3,
  },

  suggestionGrid: { gap: 12 },
  suggCard: {
    flexDirection: 'row',
    backgroundColor: C.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
  },
  suggImg: { width: 90, height: 90 },
  suggInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  suggName: {
    color: C.text, fontSize: 13,
    fontFamily: 'Outfit_700Bold', lineHeight: 18,
  },
  suggCat: {
    color: C.textMuted, fontSize: 10,
    fontFamily: 'Outfit_400Regular',
    textTransform: 'uppercase', letterSpacing: 0.3,
  },
  suggFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  suggPrice: { color: C.accent, fontSize: 15, fontFamily: 'Outfit_800ExtraBold' },
  suggAddBtn: {
    borderWidth: 1.5, borderColor: C.accent,
    borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5,
  },
  suggAddText: { color: C.accent, fontFamily: 'Outfit_800ExtraBold', fontSize: 11 },

  // ── Filled cart ────────────────────────────────────────────────────────────
  scroll: { flex: 1 },

  itemsCard: {
    margin: 16, backgroundColor: C.surface,
    borderRadius: 20, borderWidth: 1, borderColor: C.border, overflow: 'hidden',
  },
  cartRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  rowImg: { width: 68, height: 68, borderRadius: 12 },
  rowInfo: { flex: 1, marginHorizontal: 12 },
  rowName: { color: C.text, fontSize: 13, fontFamily: 'Outfit_700Bold', lineHeight: 18 },
  rowCat: {
    color: C.textMuted, fontSize: 10, fontFamily: 'Outfit_400Regular',
    marginTop: 2, textTransform: 'uppercase',
  },
  rowPrice: { color: C.textSec, fontSize: 12, fontFamily: 'Outfit_400Regular', marginTop: 6 },
  rowTotal: { color: C.accent, fontFamily: 'Outfit_700Bold' },
  sep: { height: 1, backgroundColor: C.border, marginHorizontal: 14 },

  qtyCol: { alignItems: 'center', gap: 4 },
  qtyBtnWrap: { borderRadius: 10, overflow: 'hidden' },
  qtyBtnGrad: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },
  qtyBtnText: { color: C.bg, fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 22 },
  qtyNum: { color: C.text, fontFamily: 'Outfit_800ExtraBold', fontSize: 15, minWidth: 20, textAlign: 'center' },
  qtyBtnPlain: {
    width: 30, height: 30, borderRadius: 10,
    backgroundColor: C.surfaceHigh, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  qtyBtnPlainText: { color: C.text, fontSize: 18, fontFamily: 'Outfit_700Bold', lineHeight: 22 },

  savingsBanner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: 'rgba(16,185,129,0.08)',
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)', gap: 8,
  },
  savingsIcon: { fontSize: 18 },
  savingsText: { color: '#10B981', fontSize: 13, fontFamily: 'Outfit_600SemiBold' },

  billCard: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: C.surface,
    borderRadius: 20, padding: 18, borderWidth: 1, borderColor: C.border,
  },
  billTitle: {
    fontSize: 13, fontFamily: 'Outfit_800ExtraBold', color: C.text,
    marginBottom: 14, textTransform: 'uppercase', letterSpacing: 1,
  },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  billLabel: { color: C.textSec, fontSize: 14, fontFamily: 'Outfit_400Regular' },
  billValue: { color: C.text, fontSize: 14, fontFamily: 'Outfit_600SemiBold' },
  billDivider: { height: 1, backgroundColor: C.border, marginVertical: 8 },
  billTotalLabel: { fontSize: 16, fontFamily: 'Outfit_800ExtraBold', color: C.text },
  billTotalValue: { fontSize: 18, fontFamily: 'Outfit_900Black', color: C.accent },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.surface, paddingHorizontal: 16,
    paddingTop: 14, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: C.border, gap: 10,
  },
  footerTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  footerTotal: { fontSize: 22, fontFamily: 'Outfit_900Black', color: C.accent },
  footerHint: { fontSize: 12, fontFamily: 'Outfit_400Regular', color: C.textMuted, marginTop: 2 },
  checkoutTouch: { borderRadius: 16, overflow: 'hidden' },
  checkoutBtn: { borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  checkoutText: { color: C.bg, fontFamily: 'Outfit_900Black', fontSize: 16 },
});
