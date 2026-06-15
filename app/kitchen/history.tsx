import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C } from '../../constants/colors';
import { useAuth } from '../../store/auth';
import { db } from '../../utils/firebase';
import { ref, onValue } from 'firebase/database';

export default function KitchenHistory() {
  const router = useRouter();
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'kitchen') {
      router.replace('/login');
      return;
    }
    const ordersRef = ref(db, 'orders');
    const unsub = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const data = Object.values(val) as any[];
        const completed = data
          .filter((o: any) => o.status === 'ready' || o.status === 'completed' || o.status === 'out_for_delivery')
          .sort((a: any, b: any) => b.id?.localeCompare(a.id));
        setOrders(completed);
      } else {
        setOrders([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  if (loading) return (
    <SafeAreaView style={[s.root, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={C.success} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Completed Orders</Text>
        <Text style={s.headerSub}>{orders.length} orders done</Text>
      </View>

      {orders.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>📭</Text>
          <Text style={s.emptyTitle}>No completed orders yet</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={s.card}>
              <View style={s.cardRow}>
                <Text style={s.orderId}>#{item.id?.split('-')[1] || item.id}</Text>
                <View style={[s.badge, item.status === 'ready' ? s.badgeReady : s.badgeDone]}>
                  <Text style={s.badgeText}>{item.status?.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={s.customer}>👤 {item.customer_name}</Text>
              <View style={s.itemsList}>
                {item.items?.map((i: any, idx: number) => (
                  <Text key={idx} style={s.itemText}>· {i.qty}x {i.name}</Text>
                ))}
              </View>
              <Text style={s.total}>₹{item.total?.toFixed(2)}</Text>
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
  headerSub: { fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: C.success, marginTop: 2 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 50, marginBottom: 12 },
  emptyTitle: { color: C.textSec, fontSize: 16, fontFamily: 'Outfit_600SemiBold' },
  list: { padding: 16, gap: 12 },
  card: { backgroundColor: C.surface, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { color: C.text, fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeReady: { backgroundColor: 'rgba(245,158,11,0.15)' },
  badgeDone: { backgroundColor: 'rgba(16,185,129,0.15)' },
  badgeText: { fontSize: 10, fontFamily: 'Outfit_800ExtraBold', color: C.success },
  customer: { color: C.textSec, fontSize: 13, fontFamily: 'Outfit_600SemiBold', marginBottom: 8 },
  itemsList: { marginBottom: 8 },
  itemText: { color: C.text, fontSize: 13, fontFamily: 'Outfit_500Medium', marginBottom: 2 },
  total: { color: C.accent, fontSize: 15, fontFamily: 'Outfit_800ExtraBold' },
});
