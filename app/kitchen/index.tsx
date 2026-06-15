import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { C } from '../../constants/colors';
import { useAuth } from '../../store/auth';
import { db } from '../../utils/firebase';
import { ref, onValue, update } from 'firebase/database';

export default function KitchenDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'kitchen') {
      router.replace('/login');
      return;
    }

    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const data = Object.values(val) as any[];
        // Show only placed or preparing orders
        const activeOrders = data.filter((o: any) => o.status === 'placed' || o.status === 'preparing');
        activeOrders.sort((a: any, b: any) => {
          const tA = parseInt(a.id?.split('-')[1] || '0', 10);
          const tB = parseInt(b.id?.split('-')[1] || '0', 10);
          return tA - tB; // oldest first
        });
        setOrders(activeOrders);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  // Accept order: sets status to preparing + stamps estimated ready time (20 mins)
  const acceptOrder = async (orderId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const estimatedReadyAt = Date.now() + 20 * 60 * 1000; // 20 minutes from now
    try {
      await update(ref(db, 'orders/' + orderId), {
        status: 'preparing',
        accepted_at: Date.now(),
        estimated_ready_at: estimatedReadyAt,
      });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  // Reject order: sets status to cancelled with a reason
  const rejectOrder = async (orderId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert(
      'Reject Order',
      'Are you sure you want to reject this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              await update(ref(db, 'orders/' + orderId), {
                status: 'cancelled',
                rejection_reason: 'Rejected by kitchen',
                rejected_at: Date.now(),
              });
            } catch (err: any) {
              Alert.alert('Error', err.message);
            }
          },
        },
      ]
    );
  };

  // Mark as ready for pickup/delivery
  const markReady = async (orderId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      await update(ref(db, 'orders/' + orderId), {
        status: 'ready',
        ready_at: Date.now(),
      });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isPlaced = item.status === 'placed';

    // Calculate time elapsed for preparing orders
    let elapsedText = '';
    if (!isPlaced && item.accepted_at) {
      const mins = Math.floor((Date.now() - item.accepted_at) / 60000);
      elapsedText = `${mins}m in kitchen`;
    }

    return (
      <View style={[s.orderCard, isPlaced ? s.cardPlaced : s.cardPreparing]}>
        {/* Header */}
        <View style={s.cardHeader}>
          <Text style={s.orderId}>#{item.id?.split('-')[1] || item.id}</Text>
          <View style={[s.badge, isPlaced ? s.badgePlaced : s.badgePreparing]}>
            <Text style={isPlaced ? s.textPlaced : s.textPreparing}>
              {isPlaced ? '⏳ NEW' : '🔥 PREPARING'}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={s.customerInfo}>
          <Text style={s.customerText}>👤 {item.customer_name}</Text>
          {item.table_number && <Text style={s.customerText}>🪑 Table {item.table_number}</Text>}
          {item.dining_mode === 'takeaway' && <Text style={s.customerText}>📦 Takeaway</Text>}
          {item.dining_mode === 'delivery' && <Text style={s.customerText}>🛵 Delivery</Text>}
          {elapsedText ? <Text style={s.elapsedText}>⏱ {elapsedText}</Text> : null}
        </View>

        {/* Items List */}
        <View style={s.itemsList}>
          {item.items?.map((i: any, idx: number) => (
            <View key={idx} style={s.itemRow}>
              <Text style={s.itemQty}>{i.qty}x</Text>
              <Text style={s.itemName}>{i.name}</Text>
              {i.variant ? <Text style={s.itemVariant}>{i.variant}</Text> : null}
            </View>
          ))}
        </View>

        {/* Notes */}
        {item.notes ? (
          <View style={s.notesBox}>
            <Text style={s.notesText}>📝 {item.notes}</Text>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={s.actions}>
          {isPlaced ? (
            <>
              <TouchableOpacity style={s.rejectBtn} onPress={() => rejectOrder(item.id)} activeOpacity={0.8}>
                <Text style={s.rejectText}>✗ Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.acceptBtn} onPress={() => acceptOrder(item.id)} activeOpacity={0.8}>
                <Text style={s.acceptText}>✓ Accept</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={s.readyBtn} onPress={() => markReady(item.id)} activeOpacity={0.8}>
              <Text style={s.readyText}>🔔 Mark as Ready</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) return (
    <SafeAreaView style={[s.root, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={C.accent} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Kitchen Display</Text>
          <Text style={s.headerSub}>
            {orders.filter(o => o.status === 'placed').length} new · {orders.filter(o => o.status === 'preparing').length} preparing
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={s.logoutBtn}>
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={s.emptyState}>
          <Text style={s.emptyIcon}>🍳</Text>
          <Text style={s.emptyTitle}>Kitchen is clear!</Text>
          <Text style={s.emptySub}>No active orders at the moment.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 20, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  headerTitle: { fontSize: 22, fontFamily: 'Outfit_800ExtraBold', color: C.text },
  headerSub: { fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: C.accent, marginTop: 2 },
  logoutBtn: { padding: 8, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  logoutText: { color: C.error, fontFamily: 'Outfit_700Bold', fontSize: 12 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { color: C.text, fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 },
  emptySub: { color: C.textSec, fontSize: 15, fontFamily: 'Outfit_400Regular' },

  list: { padding: 16, gap: 16 },

  orderCard: { borderRadius: 16, padding: 16, borderWidth: 2 },
  cardPlaced: { backgroundColor: C.surface, borderColor: 'rgba(245,158,11,0.5)' },
  cardPreparing: { backgroundColor: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.4)' },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  orderId: { color: C.text, fontSize: 20, fontFamily: 'Outfit_900Black' },

  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  badgePlaced: { backgroundColor: 'rgba(245,158,11,0.15)' },
  badgePreparing: { backgroundColor: 'rgba(16,185,129,0.15)' },
  textPlaced: { color: C.accent, fontFamily: 'Outfit_800ExtraBold', fontSize: 12 },
  textPreparing: { color: C.success, fontFamily: 'Outfit_800ExtraBold', fontSize: 12 },

  customerInfo: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  customerText: { color: C.textSec, fontSize: 13, fontFamily: 'Outfit_600SemiBold' },
  elapsedText: { color: C.accent, fontSize: 13, fontFamily: 'Outfit_700Bold' },

  itemsList: { marginBottom: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  itemQty: { color: C.text, fontSize: 16, fontFamily: 'Outfit_900Black', width: 34 },
  itemName: { flex: 1, color: C.text, fontSize: 15, fontFamily: 'Outfit_600SemiBold' },
  itemVariant: { color: C.textMuted, fontSize: 12, fontFamily: 'Outfit_500Medium' },

  notesBox: { backgroundColor: 'rgba(245,158,11,0.08)', borderRadius: 8, padding: 10, marginBottom: 14, borderWidth: 1, borderColor: 'rgba(245,158,11,0.2)' },
  notesText: { color: C.accent, fontSize: 13, fontFamily: 'Outfit_600SemiBold' },

  actions: { flexDirection: 'row', gap: 10 },
  rejectBtn: { flex: 1, backgroundColor: 'rgba(239,68,68,0.1)', paddingVertical: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  rejectText: { color: C.error, fontFamily: 'Outfit_800ExtraBold', fontSize: 15 },
  acceptBtn: { flex: 2, backgroundColor: C.accent, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  acceptText: { color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 15 },
  readyBtn: { flex: 1, backgroundColor: C.success, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  readyText: { color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 15 },
});
