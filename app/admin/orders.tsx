import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { C } from '../../constants/colors';
import { useAuth } from '../../store/auth';
import { db } from '../../utils/firebase';
import { ref, onValue, update } from 'firebase/database';

export default function AdminOrders() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<'active' | 'all'>('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.replace('/login'); return; }
    const unsub = onValue(ref(db, 'orders'), (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val()) as any[];
        data.sort((a: any, b: any) => b.id?.localeCompare(a.id));
        setOrders(data);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const forceCancel = async (orderId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    await update(ref(db, 'orders/' + orderId), { status: 'cancelled' });
  };

  const displayed = filter === 'active'
    ? orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled')
    : orders;

  const statusColor: Record<string, string> = {
    placed: '#F59E0B',
    preparing: '#10B981',
    ready: '#6366F1',
    out_for_delivery: '#3B82F6',
    completed: '#6B7280',
    cancelled: '#EF4444',
  };

  if (loading) return (
    <SafeAreaView style={[s.root, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={C.accent} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Order Management</Text>
        <Text style={s.headerSub}>{displayed.length} orders</Text>
      </View>

      {/* Filter Pills */}
      <View style={s.filterRow}>
        <TouchableOpacity style={[s.pill, filter === 'active' && s.pillActive]} onPress={() => setFilter('active')}>
          <Text style={[s.pillText, filter === 'active' && s.pillTextActive]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.pill, filter === 'all' && s.pillActive]} onPress={() => setFilter('all')}>
          <Text style={[s.pillText, filter === 'all' && s.pillTextActive]}>All Orders</Text>
        </TouchableOpacity>
      </View>

      {displayed.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>📋</Text>
          <Text style={s.emptyText}>No orders to show</Text>
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={item => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={s.card}>
              <View style={s.cardRow}>
                <Text style={s.orderId}>#{item.id?.split('-')[1] || item.id}</Text>
                <View style={[s.badge, { backgroundColor: (statusColor[item.status] || '#999') + '22' }]}>
                  <Text style={[s.badgeText, { color: statusColor[item.status] || '#999' }]}>{item.status?.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={s.customer}>👤 {item.customer_name}</Text>
              <Text style={s.total}>₹{item.total?.toFixed(2)}</Text>
              {item.status !== 'completed' && item.status !== 'cancelled' && (
                <TouchableOpacity style={s.cancelBtn} onPress={() => forceCancel(item.id)}>
                  <Text style={s.cancelText}>⛔ Force Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontSize: 22, fontFamily: 'Outfit_800ExtraBold', color: C.text },
  headerSub: { fontSize: 13, fontFamily: 'Outfit_400Regular', color: C.textSec, marginTop: 2 },
  filterRow: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 0 },
  pill: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border },
  pillActive: { backgroundColor: C.accent, borderColor: C.accent },
  pillText: { color: C.textSec, fontFamily: 'Outfit_700Bold', fontSize: 13 },
  pillTextActive: { color: '#fff' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 50, marginBottom: 12 },
  emptyText: { color: C.textSec, fontFamily: 'Outfit_600SemiBold', fontSize: 15 },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: C.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { color: C.text, fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 10, fontFamily: 'Outfit_800ExtraBold' },
  customer: { color: C.textSec, fontSize: 13, fontFamily: 'Outfit_500Medium', marginBottom: 4 },
  total: { color: C.text, fontSize: 14, fontFamily: 'Outfit_700Bold', marginBottom: 12 },
  cancelBtn: { backgroundColor: 'rgba(239,68,68,0.1)', paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  cancelText: { color: C.error, fontFamily: 'Outfit_700Bold', fontSize: 13 },
});
