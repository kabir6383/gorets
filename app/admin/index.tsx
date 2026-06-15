import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C } from '../../constants/colors';
import { useAuth } from '../../store/auth';
import { db } from '../../utils/firebase';
import { ref, onValue } from 'firebase/database';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [revenue, setRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      router.replace('/login');
      return;
    }
    const ordersRef = ref(db, 'orders');
    const unsub = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const data = Object.values(val) as any[];
        let rev = 0;
        let tOrders = 0;
        let completed = 0;
        const active: any[] = [];
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        data.forEach((o: any) => {
          const tsMatch = o.id?.match(/ORD-(\d+)-/);
          const ts = tsMatch ? parseInt(tsMatch[1], 10) : 0;
          if (ts > todayStart.getTime()) {
            tOrders++;
            if (o.status === 'completed') { rev += o.total || 0; completed++; }
          }
          if (o.status !== 'completed' && o.status !== 'cancelled') active.push(o);
        });

        active.sort((a, b) => b.id?.localeCompare(a.id));
        setRevenue(rev);
        setTotalOrders(tOrders);
        setCompletedOrders(completed);
        setActiveOrders(active);
      } else {
        setRevenue(0); setTotalOrders(0); setCompletedOrders(0); setActiveOrders([]);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  if (loading) return (
    <SafeAreaView style={[s.root, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={C.accent} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Dashboard</Text>
          <Text style={s.headerSub}>Welcome back, Admin 👋</Text>
        </View>
        <TouchableOpacity onPress={async () => { await logout(); router.replace('/login'); }} style={s.logoutBtn}>
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <Text style={s.sectionLabel}>TODAY'S OVERVIEW</Text>
        <View style={s.statsRow}>
          <View style={[s.statBox, { borderColor: 'rgba(245,158,11,0.3)' }]}>
            <Text style={s.statEmoji}>💰</Text>
            <Text style={s.statValue}>₹{revenue.toFixed(0)}</Text>
            <Text style={s.statLabel}>Revenue</Text>
          </View>
          <View style={[s.statBox, { borderColor: 'rgba(16,185,129,0.3)' }]}>
            <Text style={s.statEmoji}>📦</Text>
            <Text style={s.statValue}>{totalOrders}</Text>
            <Text style={s.statLabel}>Orders</Text>
          </View>
          <View style={[s.statBox, { borderColor: 'rgba(99,102,241,0.3)' }]}>
            <Text style={s.statEmoji}>✅</Text>
            <Text style={s.statValue}>{completedOrders}</Text>
            <Text style={s.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Active orders summary */}
        <Text style={s.sectionLabel}>LIVE ORDERS</Text>
        {activeOrders.length === 0 ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyEmoji}>🎉</Text>
            <Text style={s.emptyText}>All caught up! No active orders.</Text>
          </View>
        ) : (
          activeOrders.slice(0, 5).map((order, i) => (
            <View key={i} style={s.orderCard}>
              <View style={s.orderRow}>
                <Text style={s.orderId}>#{order.id?.split('-')[1] || order.id}</Text>
                <View style={[s.statusBadge, order.status === 'placed' ? s.badgePlaced : s.badgePreparing]}>
                  <Text style={s.statusText}>{order.status?.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={s.orderCustomer}>{order.customer_name} · ₹{order.total?.toFixed(2)}</Text>
            </View>
          ))
        )}
        {activeOrders.length > 5 && (
          <Text style={s.moreText}>+{activeOrders.length - 5} more orders — see Orders tab</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontSize: 22, fontFamily: 'Outfit_800ExtraBold', color: C.text },
  headerSub: { fontSize: 13, fontFamily: 'Outfit_400Regular', color: C.textSec },
  logoutBtn: { padding: 8, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  logoutText: { color: C.error, fontFamily: 'Outfit_700Bold', fontSize: 12 },
  content: { padding: 16, paddingBottom: 40 },
  sectionLabel: { color: C.textMuted, fontSize: 11, fontFamily: 'Outfit_700Bold', letterSpacing: 1.5, marginBottom: 12, marginTop: 8 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statBox: { flex: 1, backgroundColor: C.surface, borderRadius: 16, padding: 14, borderWidth: 1, alignItems: 'center' },
  statEmoji: { fontSize: 22, marginBottom: 6 },
  statValue: { color: C.text, fontSize: 20, fontFamily: 'Outfit_900Black' },
  statLabel: { color: C.textSec, fontSize: 11, fontFamily: 'Outfit_600SemiBold', marginTop: 2 },
  emptyCard: { backgroundColor: C.surface, borderRadius: 16, padding: 30, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  emptyEmoji: { fontSize: 36, marginBottom: 10 },
  emptyText: { color: C.textSec, fontFamily: 'Outfit_500Medium', fontSize: 14 },
  orderCard: { backgroundColor: C.surface, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderId: { color: C.text, fontSize: 15, fontFamily: 'Outfit_800ExtraBold' },
  orderCustomer: { color: C.textSec, fontSize: 13, fontFamily: 'Outfit_500Medium' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgePlaced: { backgroundColor: 'rgba(245,158,11,0.15)' },
  badgePreparing: { backgroundColor: 'rgba(16,185,129,0.15)' },
  statusText: { fontSize: 10, fontFamily: 'Outfit_800ExtraBold', color: C.accent },
  moreText: { color: C.textMuted, fontFamily: 'Outfit_500Medium', fontSize: 13, textAlign: 'center', marginTop: 4 },
});
