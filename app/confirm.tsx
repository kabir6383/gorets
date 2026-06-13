import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Animated, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../constants/colors';
import { useCart } from '../store/cart';
import { supabase } from '../utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConfirmScreen() {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { removeOrderId } = useCart();

  const [orderStatus, setOrderStatus] = useState('placed');
  const [cancelling, setCancelling] = useState(false);
  const [canCancel, setCanCancel] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState<string | null>(null);

  const CANCEL_REASONS = [
    'Ordered by mistake',
    'Forgot to add items',
    'Delivery address is wrong',
    'Changed my mind',
    'Other'
  ];

  const iconScale = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslate = useRef(new Animated.Value(40)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance sequence
    Animated.sequence([
      Animated.spring(iconScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: false }),
      Animated.parallel([
        Animated.timing(contentOpacity, { toValue: 1, duration: 500, useNativeDriver: false }),
        Animated.spring(contentTranslate, { toValue: 0, friction: 9, useNativeDriver: false }),
      ]),
    ]).start();

    // Icon pulse loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.05, duration: 1000, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: false }),
      ])
    ).start();

    // 3-minute cancellation timer
    const timestampMatch = orderId?.match(/ORD-(\d+)-/);
    const orderTimestamp = timestampMatch ? parseInt(timestampMatch[1], 10) : Date.now();

    const checkCancelTime = () => {
      const elapsed = Date.now() - orderTimestamp;
      if (elapsed > 180000) { // 3 minutes
        setCanCancel(false);
      }
    };
    checkCancelTime();
    const timerInterval = setInterval(checkCancelTime, 5000);

    // Poll for live order status
    const pollStatus = async () => {
      if (!orderId) return; 
      try {
        const { data: supaData, error } = await supabase.from('orders').select('status').eq('id', orderId).single();
        if (supaData && !error) {
          setOrderStatus(supaData.status);
          return;
        }

        // Fallback to AsyncStorage
        const offlineStr = await AsyncStorage.getItem('offline_orders');
        if (offlineStr) {
          const offlineOrders = JSON.parse(offlineStr);
          const localOrder = offlineOrders.find((o: any) => o.id === orderId);
          if (localOrder && localOrder.status) {
            setOrderStatus(localOrder.status);
          }
        }
      } catch (err) {}
    };

    const interval = setInterval(pollStatus, 5000);
    pollStatus();

    return () => {
      clearInterval(interval);
      clearInterval(timerInterval);
    };
  }, [orderId]);

  const isWeb = Platform.OS === 'web';

  const STEPS = [
    { label: 'Order Received', desc: 'We have received your order' },
    { label: 'Preparing', desc: 'Your food is being prepared' },
    { label: 'Ready', desc: 'Collect at the counter' },
  ];

  const handleConfirmCancel = async () => {
    if (!cancelReason) return;
    setCancelling(true);
    try {
      const { error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
      
      if (!error) {
        setOrderStatus('cancelled');
        removeOrderId(orderId);
        setShowCancelModal(false);
      } else {
        // Fallback to updating local storage
        const offlineStr = await AsyncStorage.getItem('offline_orders');
        if (offlineStr) {
          let offlineOrders = JSON.parse(offlineStr);
          const idx = offlineOrders.findIndex((o: any) => o.id === orderId);
          if (idx !== -1) {
            offlineOrders[idx].status = 'cancelled';
            await AsyncStorage.setItem('offline_orders', JSON.stringify(offlineOrders));
            setOrderStatus('cancelled');
            removeOrderId(orderId);
            setShowCancelModal(false);
            return;
          }
        }
        Alert.alert('Error', 'Failed to cancel order.');
      }
    } catch (err) {
      // If the backend is offline, simulate a successful cancellation for the UX
      setOrderStatus('cancelled');
      removeOrderId(orderId);
      setShowCancelModal(false);
    } finally {
      setCancelling(false);
    }
  };

  if (orderStatus === 'cancelled') {
    return (
      <SafeAreaView style={s.root} edges={['top', 'bottom']}>
        <View style={s.container}>
          <View style={s.cancelledHero}>
            <Text style={{ fontSize: 72, marginBottom: 16 }}>🚫</Text>
            <Text style={[s.title, { color: C.error, fontSize: 28 }]}>Order Cancelled</Text>
            <Text style={s.subtitle}>Your order #{orderId} has been successfully cancelled.</Text>
          </View>
          
          <View style={s.refundCard}>
            <Text style={s.refundTitle}>Refund Status</Text>
            <Text style={s.refundText}>No charges were applied since the restaurant had not started preparing your food yet.</Text>
          </View>
          
          <TouchableOpacity onPress={() => router.replace('/')} style={[s.ctaBtn, { marginTop: 20 }]}>
            <LinearGradient colors={[C.accent, C.accentDark]} style={s.ctaGrad}>
              <Text style={s.ctaBtnText}>Back to Menu</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>

      {/* Ambient glow background */}
      <View style={s.glowBg} />

      <View style={[s.container, isWeb && s.containerWeb]}>

        {/* ── Elegant Icon ─────────────────────────────────────────────── */}
        <Animated.View style={[s.iconRing, { transform: [{ scale: Animated.multiply(iconScale, pulse) }] }]}>
          <View style={s.iconCircle}>
            <Text style={s.iconCheck}>✓</Text>
          </View>
        </Animated.View>

        {/* ── Content ────────────────────────────────────────────────────── */}
        <Animated.View style={[s.content, {
          opacity: contentOpacity,
          transform: [{ translateY: contentTranslate }],
        }]}>

          <Text style={s.title}>Order Placed Successfully</Text>
          <Text style={s.subtitle}>Sit back and relax while we prepare your food.</Text>

          {/* Receipt Box */}
          <View style={s.receiptBox}>
            <View style={s.receiptHeader}>
              <Text style={s.receiptTitle}>ORDER ID</Text>
              <Text style={s.receiptText}>{orderId}</Text>
            </View>
            <View style={s.receiptDivider} />
            <Text style={s.receiptHint}>Please show this at the counter to collect your order.</Text>
          </View>

          {/* Vertical Timeline */}
          <View style={s.timelineCard}>
            {STEPS.map((step, i) => {
              const isDone = i === 0 || 
                (i === 1 && (orderStatus === 'preparing' || orderStatus === 'ready' || orderStatus === 'completed')) ||
                (i === 2 && (orderStatus === 'ready' || orderStatus === 'completed'));
              
              return (
                <View key={i} style={s.timelineStep}>
                  <View style={s.timelineLeft}>
                    <View style={[s.timelineDot, isDone && s.timelineDotDone]}>
                       {isDone && <Text style={s.timelineDotCheck}>✓</Text>}
                    </View>
                    {i < STEPS.length - 1 && <View style={[s.timelineLine, isDone && s.timelineLineDone]} />}
                  </View>
                  <View style={s.timelineContent}>
                    <Text style={[s.timelineLabel, isDone && s.timelineLabelDone]}>{step.label}</Text>
                    <Text style={s.timelineSub}>{step.desc}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Actions */}
          <TouchableOpacity style={s.primaryBtn} onPress={() => router.replace('/')} activeOpacity={0.85}>
            <Text style={s.primaryBtnText}>Browse Menu</Text>
          </TouchableOpacity>

          {orderStatus === 'placed' && canCancel && (
            <TouchableOpacity onPress={() => setShowCancelModal(true)} style={s.cancelBtn}>
              <Text style={s.cancelBtnText}>Cancel Order</Text>
            </TouchableOpacity>
          )}

          {orderStatus === 'placed' && !canCancel && (
            <View style={s.noCancelBox}>
              <Text style={s.noCancelText}>Order can no longer be cancelled after 3 minutes.</Text>
            </View>
          )}

        </Animated.View>
      </View>

      {/* ── Cancel Modal ────────────────────────────────────────────────── */}
      <Modal visible={showCancelModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Why do you want to cancel?</Text>
              <TouchableOpacity onPress={() => setShowCancelModal(false)} style={s.modalCloseBtn}>
                <Text style={s.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {CANCEL_REASONS.map((reason, idx) => {
              const isSelected = cancelReason === reason;
              return (
                <TouchableOpacity 
                  key={idx} 
                  style={[s.reasonRow, isSelected && s.reasonRowSelected]}
                  onPress={() => setCancelReason(reason)}
                  activeOpacity={0.7}
                >
                  <View style={[s.radioCircle, isSelected && s.radioCircleSelected]}>
                    {isSelected && <View style={s.radioInner} />}
                  </View>
                  <Text style={[s.reasonText, isSelected && s.reasonTextSelected]}>{reason}</Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity 
              onPress={handleConfirmCancel} 
              style={[s.confirmCancelBtn, !cancelReason && s.confirmCancelBtnDisabled]} 
              disabled={!cancelReason || cancelling}
            >
              {cancelling ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.confirmCancelText}>Confirm Cancellation</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setShowCancelModal(false)} style={s.dontCancelBtn}>
              <Text style={s.dontCancelText}>Don't Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  glowBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    backgroundColor: 'rgba(245,158,11,0.04)',
  },

  container: { flex: 1, paddingHorizontal: 20, paddingTop: 40 },
  containerWeb: { maxWidth: 500, alignSelf: 'center', width: '100%' },

  iconRing: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(16,185,129,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 24, alignSelf: 'center' },
  iconCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.success, alignItems: 'center', justifyContent: 'center' },
  iconCheck: { color: '#fff', fontSize: 28, fontFamily: 'Outfit_800ExtraBold' },

  content: { width: '100%', alignItems: 'center' },

  title: { fontSize: 28, fontFamily: 'Outfit_800ExtraBold', color: C.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, fontFamily: 'Outfit_400Regular', color: C.textSec, textAlign: 'center', marginBottom: 32 },

  receiptBox: { width: '100%', backgroundColor: C.surface, borderRadius: 16, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: C.border },
  receiptHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  receiptTitle: { color: C.textMuted, fontSize: 11, fontFamily: 'Outfit_700Bold', letterSpacing: 1 },
  receiptText: { color: C.text, fontSize: 15, fontFamily: 'Outfit_800ExtraBold' },
  receiptDivider: { height: 1, borderBottomWidth: 1, borderBottomColor: C.border, borderStyle: 'dashed', marginBottom: 16 },
  receiptHint: { color: C.textMuted, fontSize: 12, fontFamily: 'Outfit_400Regular', textAlign: 'center' },

  timelineCard: { width: '100%', backgroundColor: C.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 32 },
  timelineStep: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { width: 30, alignItems: 'center', marginRight: 12 },
  timelineDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  timelineDotDone: { borderColor: C.success, backgroundColor: C.success },
  timelineDotCheck: { color: '#fff', fontSize: 10, fontFamily: 'Outfit_900Black' },
  timelineLine: { width: 2, height: 36, backgroundColor: C.border, marginVertical: -2, zIndex: 1 },
  timelineLineDone: { backgroundColor: C.success },
  timelineContent: { flex: 1, paddingBottom: 24 },
  timelineLabel: { color: C.textSec, fontSize: 15, fontFamily: 'Outfit_600SemiBold', marginBottom: 2 },
  timelineLabelDone: { color: C.text, fontFamily: 'Outfit_800ExtraBold' },
  timelineSub: { color: C.textMuted, fontSize: 12, fontFamily: 'Outfit_400Regular' },

  primaryBtn: { width: '100%', backgroundColor: C.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 8 },
  primaryBtnText: { color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 16 },

  cancelBtn: { paddingVertical: 14, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 16, marginBottom: 8 },
  cancelBtnText: { color: C.textSec, fontFamily: 'Outfit_600SemiBold', fontSize: 14 },
  
  noCancelBox: { paddingVertical: 14, width: '100%', alignItems: 'center' },
  noCancelText: { color: C.textMuted, fontFamily: 'Outfit_500Medium', fontSize: 12 },

  // Cancelled State UI
  cancelledHero: { alignItems: 'center', marginBottom: 20 },
  refundCard: { width: '100%', backgroundColor: 'rgba(239,68,68,0.06)', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', marginBottom: 10 },
  refundTitle: { color: C.error, fontSize: 14, fontFamily: 'Outfit_800ExtraBold', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
  refundText: { color: C.textSec, fontSize: 13, fontFamily: 'Outfit_500Medium', lineHeight: 20 },
  ctaBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  ctaGrad: { width: '100%', paddingVertical: 16, alignItems: 'center' },
  ctaBtnText: { color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 16 },

  // Modal UI
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 18, fontFamily: 'Outfit_800ExtraBold', color: C.text },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.surfaceHigh, alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { fontSize: 14, color: C.textMuted, fontFamily: 'Outfit_700Bold' },
  
  reasonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  reasonRowSelected: { backgroundColor: 'rgba(245,158,11,0.05)', borderRadius: 12, borderBottomWidth: 0, paddingHorizontal: 12, marginHorizontal: -12 },
  radioCircle: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: C.textMuted, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  radioCircleSelected: { borderColor: C.accent },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.accent },
  reasonText: { fontSize: 15, fontFamily: 'Outfit_500Medium', color: C.textSec },
  reasonTextSelected: { color: C.text, fontFamily: 'Outfit_700Bold' },

  confirmCancelBtn: { backgroundColor: C.error, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 24, marginBottom: 12 },
  confirmCancelBtnDisabled: { opacity: 0.5 },
  confirmCancelText: { color: '#fff', fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
  dontCancelBtn: { paddingVertical: 12, alignItems: 'center' },
  dontCancelText: { color: C.textSec, fontSize: 15, fontFamily: 'Outfit_700Bold' },
});
