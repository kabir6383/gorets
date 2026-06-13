import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C } from '../constants/colors';

import { useCart } from '../store/cart';
import { useAuth } from '../store/auth';
import { supabase } from '../utils/supabase';

type DiningMode = 'dine-in' | 'takeaway';
type PaymentMethod = 'cash' | 'upi';

export default function OrderScreen() {
  const router = useRouter();
  const { cartItems, cartTotal, cartCount, clearCart, addOrderId, deviceId } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [diningMode, setDiningMode] = useState<DiningMode>('dine-in');
  const [tableNo, setTableNo] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [landmark, setLandmark] = useState('');
  const [payment, setPayment] = useState<PaymentMethod>('cash');
  const [placing, setPlacing] = useState(false);

  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + tax;

  const placeOrder = async () => {
    if (!name.trim()) return Alert.alert('Required', 'Please enter your name');
    if (!phone.trim() || phone.length < 10) return Alert.alert('Required', 'Enter a valid 10-digit phone number');
    if (diningMode === 'takeaway' && !addressLine1.trim()) return Alert.alert('Required', 'Please enter your delivery address');

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPlacing(true);

    try {
      const items = cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.quantity }));
      const orderId = `ORD-${Date.now()}-GP`;
      const payload = {
        id: orderId,
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        items,
        subtotal: cartTotal,
        tax,
        total,
        payment_method: payment,
        dining_mode: diningMode,
        table_number: diningMode === 'dine-in' ? tableNo : null,
        delivery_address: diningMode === 'takeaway'
          ? [addressLine1.trim(), addressLine2.trim(), landmark.trim()].filter(Boolean).join(', ')
          : null,
      };

      const { error } = await supabase.from('orders').insert([{
        id: orderId,
        user_id: user?.id || deviceId,
        customer_name: payload.customer_name,
        customer_phone: payload.customer_phone,
        items: payload.items,
        total: payload.total,
        status: 'placed'
      }]);

      if (error) {
        console.log('Supabase insert failed, saving to local offline storage:', error.message);
        
        // Save to local offline storage
        try {
          const offlineOrdersStr = await AsyncStorage.getItem('offline_orders');
          const offlineOrders = offlineOrdersStr ? JSON.parse(offlineOrdersStr) : [];
          offlineOrders.unshift({
            id: orderId,
            user_id: deviceId,
            customer_name: payload.customer_name,
            customer_phone: payload.customer_phone,
            items: payload.items,
            total: payload.total,
            status: 'placed',
            created_at: new Date().toISOString()
          });
          await AsyncStorage.setItem('offline_orders', JSON.stringify(offlineOrders));
        } catch (e) {
          console.warn('Failed to save offline order', e);
        }
      }

      clearCart();
      addOrderId(orderId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({ pathname: '/confirm', params: { orderId } });
    } catch {
      const fallbackId = `ORD-${Date.now()}-GP`;
      clearCart();
      addOrderId(fallbackId);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace({ pathname: '/confirm', params: { orderId: fallbackId } });
    } finally {
      setPlacing(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* ── Header ──────────────────────────────────────────────────────── */}
        <View style={s.header}>
          <TouchableOpacity 
            onPress={() => router.canGoBack() ? router.back() : router.replace('/')} 
            style={s.backCircle} 
            activeOpacity={0.7}
          >
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <View>
            <Text style={s.title}>Place Order</Text>
            <Text style={s.subtitle}>{cartCount} items · ₹{total} total</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

          {/* ── Order Summary Card ────────────────────────────────────────── */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardIcon}>🧾</Text>
              <Text style={s.cardTitle}>Order Summary</Text>
            </View>
            {cartItems.map(item => (
              <View key={item.id} style={s.summaryRow}>
                <Text style={s.summaryName} numberOfLines={1}>{item.name}</Text>
                <Text style={s.summaryMeta}>×{item.quantity}</Text>
                <Text style={s.summaryPrice}>₹{item.price * item.quantity}</Text>
              </View>
            ))}
            <View style={s.divider} />
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>Subtotal</Text>
              <Text style={s.summaryValue}>₹{cartTotal}</Text>
            </View>
            <View style={s.summaryRow}>
              <Text style={s.summaryLabel}>GST (5%)</Text>
              <Text style={s.summaryValue}>₹{tax}</Text>
            </View>
            <LinearGradient colors={['rgba(245,158,11,0.08)', 'rgba(217,119,6,0.05)']} style={s.totalRow}>
              <Text style={s.totalLabel}>Total Payable</Text>
              <Text style={s.totalValue}>₹{total}</Text>
            </LinearGradient>
          </View>

          {/* ── Your Details ──────────────────────────────────────────────── */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardIcon}>👤</Text>
              <Text style={s.cardTitle}>Your Details</Text>
            </View>
            <Text style={s.inputLabel}>Full Name *</Text>
            <TextInput
              style={s.input}
              placeholder="Enter your name"
              placeholderTextColor={C.textMuted}
              value={name}
              onChangeText={setName}
            />
            <Text style={s.inputLabel}>Phone Number *</Text>
            <TextInput
              style={s.input}
              placeholder="10-digit phone number"
              placeholderTextColor={C.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          {/* ── Dining Mode ───────────────────────────────────────────────── */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardIcon}>🍽️</Text>
              <Text style={s.cardTitle}>Dining Mode</Text>
            </View>
            <View style={s.toggleRow}>
              {(['dine-in', 'takeaway'] as DiningMode[]).map(mode => (
                <TouchableOpacity
                  key={mode}
                  style={[s.toggleBtn, diningMode === mode && s.toggleBtnActive]}
                  onPress={() => setDiningMode(mode)}
                  activeOpacity={0.8}
                >
                  <Text style={s.toggleIcon}>{mode === 'dine-in' ? '🪑' : '📦'}</Text>
                  <Text style={[s.toggleText, diningMode === mode && s.toggleTextActive]}>
                    {mode === 'dine-in' ? 'Dine In' : 'Takeaway'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {diningMode === 'dine-in' && (
              <>
                <Text style={[s.inputLabel, { marginTop: 12 }]}>Table Number (optional)</Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g. Table 4"
                  placeholderTextColor={C.textMuted}
                  value={tableNo}
                  onChangeText={setTableNo}
                  keyboardType="number-pad"
                />
              </>
            )}

            {diningMode === 'takeaway' && (
              <View style={s.addressBlock}>
                <View style={s.addressBanner}>
                  <Text style={s.addressBannerIcon}>🚗</Text>
                  <Text style={s.addressBannerText}>Enter delivery address</Text>
                </View>
                <Text style={[s.inputLabel, { marginTop: 4 }]}>Street / Area *</Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g. 12, Anna Nagar, Chennai"
                  placeholderTextColor={C.textMuted}
                  value={addressLine1}
                  onChangeText={setAddressLine1}
                  returnKeyType="next"
                />
                <Text style={s.inputLabel}>Apartment / Floor (optional)</Text>
                <TextInput
                  style={s.input}
                  placeholder="e.g. Flat 3B, 2nd Floor"
                  placeholderTextColor={C.textMuted}
                  value={addressLine2}
                  onChangeText={setAddressLine2}
                  returnKeyType="next"
                />
                <Text style={s.inputLabel}>Landmark (optional)</Text>
                <TextInput
                  style={[s.input, { marginBottom: 0 }]}
                  placeholder="e.g. Near Bus Stand"
                  placeholderTextColor={C.textMuted}
                  value={landmark}
                  onChangeText={setLandmark}
                  returnKeyType="done"
                />
              </View>
            )}
          </View>

          {/* ── Payment ───────────────────────────────────────────────────── */}
          <View style={s.card}>
            <View style={s.cardHeader}>
              <Text style={s.cardIcon}>💳</Text>
              <Text style={s.cardTitle}>Payment Method</Text>
            </View>
            <View style={s.toggleRow}>
              {(['cash', 'upi'] as PaymentMethod[]).map(method => (
                <TouchableOpacity
                  key={method}
                  style={[s.toggleBtn, payment === method && s.toggleBtnActive]}
                  onPress={() => setPayment(method)}
                  activeOpacity={0.8}
                >
                  <Text style={s.toggleIcon}>{method === 'cash' ? '💵' : '📱'}</Text>
                  <Text style={[s.toggleText, payment === method && s.toggleTextActive]}>
                    {method === 'cash' ? 'Cash' : 'UPI'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* ── Place Order Footer ────────────────────────────────────────────── */}
        <View style={s.footer}>
          <TouchableOpacity
            onPress={placeOrder}
            disabled={placing}
            activeOpacity={0.85}
            style={s.placeTouch}
          >
            <LinearGradient
              colors={placing ? ['#555', '#444'] : [C.accent, C.accentDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.placeBtn}
            >
              {placing
                ? <ActivityIndicator color={C.bg} />
                : <Text style={s.placeBtnText}>Confirm Order · ₹{total}</Text>
              }
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
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
    gap: 14,
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

  scroll: { paddingHorizontal: 16, paddingTop: 16 },

  card: {
    backgroundColor: C.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  cardIcon: { fontSize: 18 },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Outfit_800ExtraBold',
    color: C.text,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryName: { flex: 1, color: C.text, fontSize: 13, fontFamily: 'Outfit_400Regular' },
  summaryMeta: { color: C.textMuted, fontSize: 12, width: 28, textAlign: 'center', fontFamily: 'Outfit_600SemiBold' },
  summaryPrice: { color: C.text, fontSize: 13, fontFamily: 'Outfit_700Bold', width: 56, textAlign: 'right' },
  summaryLabel: { flex: 1, color: C.textSec, fontSize: 13, fontFamily: 'Outfit_400Regular' },
  summaryValue: { color: C.text, fontSize: 13, fontFamily: 'Outfit_600SemiBold' },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 10 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  totalLabel: { color: C.accent, fontSize: 15, fontFamily: 'Outfit_700Bold' },
  totalValue: { color: C.accent, fontSize: 18, fontFamily: 'Outfit_900Black' },

  inputLabel: { color: C.textMuted, fontSize: 11, fontFamily: 'Outfit_600SemiBold', letterSpacing: 0.8, marginBottom: 6, textTransform: 'uppercase' },
  input: {
    backgroundColor: C.surfaceHigh,
    color: C.text,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    fontSize: 14,
    fontFamily: 'Outfit_400Regular',
  },

  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surfaceHigh,
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(245,158,11,0.12)',
    borderColor: C.accent,
  },
  toggleIcon: { fontSize: 18 },
  toggleText: { color: C.textSec, fontFamily: 'Outfit_700Bold', fontSize: 14 },
  toggleTextActive: { color: C.accent },

  // Address block (takeaway)
  addressBlock: { marginTop: 14 },
  addressBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245,158,11,0.08)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  addressBannerIcon: { fontSize: 16 },
  addressBannerText: { color: C.accent, fontSize: 13, fontFamily: 'Outfit_600SemiBold' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: C.bg,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  placeTouch: { borderRadius: 16, overflow: 'hidden' },
  placeBtn: { borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  placeBtnText: { color: C.bg, fontFamily: 'Outfit_900Black', fontSize: 17 },
});
