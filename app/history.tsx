import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C } from '../constants/colors';
import { useAuth } from '../store/auth';
import { db } from '../utils/firebase';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';

export default function HistoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const snap = await get(ref(db, 'orders'));
        if (snap.exists()) {
          const val = snap.val();
          const allOrders = Object.keys(val).map(k => val[k]);
          
          // Filter to this user's orders (we match by phone or name, ideally phone)
          const myOrders = allOrders.filter(o => o.customer_phone === user.phone || o.customer_name === user.name);
          
          // Sort newest first
          myOrders.sort((a, b) => {
            const tA = parseInt(a.id.split('-')[1] || '0', 10);
            const tB = parseInt(b.id.split('-')[1] || '0', 10);
            return tB - tA;
          });
          
          setOrders(myOrders);
        }
      } catch (err) {}
      setLoading(false);
    };

    fetchHistory();
  }, [user]);

  const renderItem = ({ item }: { item: any }) => {
    const isCompleted = item.status === 'completed';
    const isCancelled = item.status === 'cancelled';
    
    // Calculate date
    const tsMatch = item.id.match(/ORD-(\d+)-/);
    const dateStr = tsMatch ? new Date(parseInt(tsMatch[1], 10)).toLocaleDateString() : 'Unknown Date';

    return (
      <TouchableOpacity 
        style={s.orderCard} 
        activeOpacity={0.8}
        onPress={() => router.push({ pathname: '/confirm', params: { orderId: item.id }})}
      >
        <View style={s.cardHeader}>
          <View>
            <Text style={s.orderId}>#{item.id.split('-')[1] || item.id}</Text>
            <Text style={s.date}>{dateStr} • {item.dining_mode}</Text>
          </View>
          <View style={[s.badge, isCompleted ? s.badgeSuccess : isCancelled ? s.badgeError : s.badgeActive]}>
            <Text style={[s.badgeText, isCompleted ? s.textSuccess : isCancelled ? s.textError : s.textActive]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={s.itemsList}>
          <Text style={s.itemsText} numberOfLines={2}>
            {item.items?.map((i: any) => `${i.qty}x ${i.name}`).join(', ')}
          </Text>
        </View>

        <View style={s.footer}>
          <Text style={s.total}>₹{item.total?.toFixed(2)}</Text>
          <Text style={s.reorderText}>Tap to view →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Order History</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator color={C.accent} size="large" />
        </View>
      ) : orders.length === 0 ? (
        <View style={s.center}>
          <Text style={s.emptyIcon}>🧾</Text>
          <Text style={s.emptyTitle}>No past orders</Text>
          <Text style={s.emptySub}>You haven't ordered anything yet.</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.surfaceHigh, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 18, color: C.text },
  headerTitle: { fontSize: 18, fontFamily: 'Outfit_800ExtraBold', color: C.text },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { color: C.text, fontSize: 18, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 },
  emptySub: { color: C.textMuted, fontSize: 14, fontFamily: 'Outfit_400Regular' },

  list: { padding: 16, gap: 16 },
  orderCard: { backgroundColor: C.surfaceHigh, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  orderId: { color: C.text, fontSize: 16, fontFamily: 'Outfit_800ExtraBold', marginBottom: 4 },
  date: { color: C.textMuted, fontSize: 12, fontFamily: 'Outfit_500Medium', textTransform: 'capitalize' },
  
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeSuccess: { backgroundColor: 'rgba(16,185,129,0.1)' },
  badgeError: { backgroundColor: 'rgba(239,68,68,0.1)' },
  badgeActive: { backgroundColor: 'rgba(245,158,11,0.1)' },
  badgeText: { fontSize: 10, fontFamily: 'Outfit_800ExtraBold' },
  textSuccess: { color: C.success },
  textError: { color: C.error },
  textActive: { color: C.accent },

  itemsList: { marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  itemsText: { color: C.textSec, fontSize: 13, fontFamily: 'Outfit_500Medium', lineHeight: 20 },

  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  total: { color: C.text, fontSize: 16, fontFamily: 'Outfit_900Black' },
  reorderText: { color: C.accent, fontSize: 13, fontFamily: 'Outfit_700Bold' },
});
