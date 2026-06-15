import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { C } from '../../constants/colors';
import { useAuth } from '../../store/auth';
import { db } from '../../utils/firebase';
import { ref, onValue, update } from 'firebase/database';

export default function DriverDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'driver') {
      router.replace('/login');
      return;
    }

    const ordersRef = ref(db, 'orders');
    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const data = Object.keys(val).map(k => val[k]);
        
        // Drivers only see orders that are ready for pickup or currently out for delivery by them
        const activeOrders = data.filter(o => 
          (o.status === 'ready' && o.dining_mode === 'delivery') || 
          (o.status === 'out_for_delivery' && o.driver_id === user.id)
        );
        
        activeOrders.sort((a, b) => {
          const tA = parseInt(a.id.split('-')[1] || '0', 10);
          const tB = parseInt(b.id.split('-')[1] || '0', 10);
          return tA - tB;
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

  const acceptDelivery = async (orderId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await update(ref(db, 'orders/' + orderId), { 
        status: 'out_for_delivery',
        driver_id: user?.id,
        driver_name: user?.name || 'Your Driver'
      });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const completeDelivery = async (orderId: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    try {
      await update(ref(db, 'orders/' + orderId), { status: 'completed' });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const openMaps = (address: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
      web: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    });
    Linking.openURL(url!);
  };

  const renderItem = ({ item }: { item: any }) => {
    const isReady = item.status === 'ready';
    const addressStr = item.address ? `${item.address.line1}, ${item.address.line2 || ''}` : 'No address provided';

    return (
      <View style={[s.orderCard, isReady ? s.cardReady : s.cardTransit]}>
        <View style={s.cardHeader}>
          <View>
            <Text style={s.orderId}>#{item.id.split('-')[1] || item.id}</Text>
            <Text style={s.customerText}>👤 {item.customer_name}</Text>
          </View>
          <View style={[s.badge, isReady ? s.badgeReady : s.badgeTransit]}>
            <Text style={isReady ? s.textReady : s.textTransit}>
              {isReady ? 'READY TO PICKUP' : 'IN TRANSIT'}
            </Text>
          </View>
        </View>

        <View style={s.addressBox}>
          <Text style={s.addressLabel}>DELIVER TO:</Text>
          <Text style={s.addressText}>{addressStr}</Text>
          <TouchableOpacity onPress={() => openMaps(addressStr)} style={s.mapBtn}>
            <Text style={s.mapText}>📍 Open in Maps</Text>
          </TouchableOpacity>
        </View>

        <View style={s.actions}>
          {isReady ? (
            <TouchableOpacity style={s.acceptBtn} onPress={() => acceptDelivery(item.id)}>
              <Text style={s.acceptText}>Accept Delivery</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.completeBtn} onPress={() => completeDelivery(item.id)}>
              <Text style={s.completeText}>Mark Delivered</Text>
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
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Driver App</Text>
          <Text style={s.headerSub}>{orders.length} Active Deliveries</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={s.logoutBtn}>
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {orders.length === 0 ? (
        <View style={s.emptyState}>
          <Text style={s.emptyIcon}>🛵</Text>
          <Text style={s.emptyTitle}>No deliveries right now.</Text>
          <Text style={s.emptySub}>Wait for the kitchen to finish orders.</Text>
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
  headerSub: { fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: C.accent },
  logoutBtn: { padding: 8, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 8 },
  logoutText: { color: C.error, fontFamily: 'Outfit_700Bold', fontSize: 13 },

  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { color: C.text, fontSize: 22, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 },
  emptySub: { color: C.textSec, fontSize: 15, fontFamily: 'Outfit_400Regular' },

  list: { padding: 16, gap: 16 },

  orderCard: { borderRadius: 16, padding: 16, borderWidth: 2 },
  cardReady: { backgroundColor: C.surface, borderColor: 'rgba(245,158,11,0.3)' },
  cardTransit: { backgroundColor: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.3)' },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  orderId: { color: C.text, fontSize: 18, fontFamily: 'Outfit_900Black' },
  customerText: { color: C.textSec, fontSize: 13, fontFamily: 'Outfit_500Medium', marginTop: 4 },
  
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  badgeReady: { backgroundColor: 'rgba(245,158,11,0.1)' },
  badgeTransit: { backgroundColor: 'rgba(59,130,246,0.1)' },
  textReady: { color: C.accent, fontFamily: 'Outfit_800ExtraBold', fontSize: 10, letterSpacing: 0.5 },
  textTransit: { color: '#3b82f6', fontFamily: 'Outfit_800ExtraBold', fontSize: 10, letterSpacing: 0.5 },

  addressBox: { backgroundColor: C.surfaceHigh, padding: 12, borderRadius: 12, marginBottom: 16 },
  addressLabel: { fontSize: 10, fontFamily: 'Outfit_800ExtraBold', color: C.textMuted, marginBottom: 4 },
  addressText: { fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: C.text, marginBottom: 12 },
  mapBtn: { flexDirection: 'row', alignItems: 'center' },
  mapText: { color: '#3b82f6', fontSize: 13, fontFamily: 'Outfit_700Bold' },

  actions: { flexDirection: 'row', gap: 10 },
  acceptBtn: { flex: 1, backgroundColor: C.accent, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  acceptText: { color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 15 },
  
  completeBtn: { flex: 1, backgroundColor: '#3b82f6', paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  completeText: { color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 15 },
});
