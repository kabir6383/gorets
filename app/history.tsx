import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../constants/colors';
import { useCart } from '../store/cart';
import { supabase } from '../utils/supabase';

export default function HistoryScreen() {
  const router = useRouter();
  const { deviceId, removeOrderId } = useCart();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Rating State
  const [ratedOrders, setRatedOrders] = useState<Record<string, number>>({});
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [ratingOrder, setRatingOrder] = useState<any>(null);
  const [stars, setStars] = useState(0);
  const [feedback, setFeedback] = useState('');

  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    fetchHistory();
    loadRatedOrders();
  }, [deviceId]);

  const loadRatedOrders = async () => {
    try {
      const stored = await AsyncStorage.getItem('rated_orders');
      if (stored) setRatedOrders(JSON.parse(stored));
    } catch (e) {}
  };

  const fetchHistory = async () => {
    if (!deviceId) return;
    setLoading(true);
    let allOrders: any[] = [];
    
    // Fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', deviceId)
        .order('created_at', { ascending: false });
      
      if (data) {
        allOrders = [...data];
      }
    } catch (err) {
      console.warn('Supabase fetch error', err);
    }

    // Fetch from Offline Storage
    try {
      const offlineStr = await AsyncStorage.getItem('offline_orders');
      if (offlineStr) {
        const offlineOrders = JSON.parse(offlineStr);
        // Merge without duplicates
        offlineOrders.forEach((offO: any) => {
          if (!allOrders.find(o => o.id === offO.id)) {
            allOrders.push(offO);
          }
        });
      }
    } catch (err) {}

    // Sort combined descending
    allOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setOrders(allOrders);
    setLoading(false);
  };

  const handleDelete = async (orderId: string) => {
    const performDelete = async () => {
      let deletedFromCloud = false;
      // Try delete from Supabase
      try {
        const { error } = await supabase.from('orders').delete().eq('id', orderId);
        if (!error) deletedFromCloud = true;
      } catch (err) {}

      // Delete from local storage
      try {
        const offlineStr = await AsyncStorage.getItem('offline_orders');
        if (offlineStr) {
          let offlineOrders = JSON.parse(offlineStr);
          offlineOrders = offlineOrders.filter((o: any) => o.id !== orderId);
          await AsyncStorage.setItem('offline_orders', JSON.stringify(offlineOrders));
        }
      } catch (err) {}

      setOrders(prev => prev.filter(o => o.id !== orderId));
      removeOrderId(orderId);
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to delete this order from history?')) performDelete();
    } else {
      Alert.alert('Delete History', 'Are you sure you want to delete this order?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: performDelete }
      ]);
    }
  };

  const openRatingModal = (order: any) => {
    setRatingOrder(order);
    setStars(0);
    setFeedback('');
    setRatingModalVisible(true);
  };

  const submitRating = async () => {
    if (!ratingOrder || stars === 0) return;
    
    // Save to rated orders mapping
    const newRated = { ...ratedOrders, [ratingOrder.id]: stars };
    setRatedOrders(newRated);
    try { await AsyncStorage.setItem('rated_orders', JSON.stringify(newRated)); } catch(e){}

    // Save individual item ratings
    try {
      const existingStr = await AsyncStorage.getItem('item_ratings');
      const itemRatings = existingStr ? JSON.parse(existingStr) : {};
      
      ratingOrder.items.forEach((item: any) => {
        if (!itemRatings[item.id]) itemRatings[item.id] = { sum: 0, count: 0 };
        itemRatings[item.id].sum += stars;
        itemRatings[item.id].count += 1;
      });
      
      await AsyncStorage.setItem('item_ratings', JSON.stringify(itemRatings));
    } catch(e) {}

    setRatingModalVisible(false);
    Alert.alert('Thank You!', 'Your feedback has been recorded.');
  };

  const renderItem = ({ item }: { item: any }) => {
    const isPlaced = item.status === 'placed';
    const isCancelled = item.status === 'cancelled';
    const isReady = item.status === 'ready' || item.status === 'completed';

    let statusColor = C.accent;
    let statusBg = 'rgba(245,158,11,0.1)';
    if (isCancelled) {
      statusColor = C.error;
      statusBg = 'rgba(239,68,68,0.1)';
    } else if (isReady) {
      statusColor = C.success;
      statusBg = 'rgba(16,185,129,0.1)';
    }

    // Check if within 3 minutes for placed orders
    let canCancel = false;
    if (isPlaced && item.created_at) {
      const orderTime = new Date(item.created_at).getTime();
      if (Date.now() - orderTime <= 180000) canCancel = true;
    }

    return (
      <View style={s.orderCard}>
        <View style={s.orderHeader}>
          <Text style={s.orderId}>{item.id}</Text>
          <View style={[s.statusBadge, { backgroundColor: statusBg }]}>
            <Text style={[s.statusText, { color: statusColor }]}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={s.dateText}>{item.created_at ? new Date(item.created_at).toLocaleString() : 'Unknown Date'}</Text>
        
        <View style={s.itemsContainer}>
          {Array.isArray(item.items) && item.items.map((cartItem: any, idx: number) => (
            <Text key={idx} style={s.itemText}>
              {cartItem.qty}x {cartItem.name}
            </Text>
          ))}
        </View>

        <View style={s.totalRow}>
          <Text style={s.totalLabel}>Total Paid:</Text>
          <Text style={s.totalAmount}>₹{item.total}</Text>
        </View>

        <View style={s.actionRow}>
          {canCancel && (
            <TouchableOpacity 
              style={[s.actionBtn, { borderColor: C.error }]} 
              onPress={() => router.push({ pathname: '/confirm', params: { orderId: item.id } })}
            >
              <Text style={[s.actionBtnText, { color: C.error }]}>Cancel Order</Text>
            </TouchableOpacity>
          )}
          {isReady && !ratedOrders[item.id] && (
            <TouchableOpacity 
              style={[s.actionBtn, { borderColor: C.success }]} 
              onPress={() => openRatingModal(item)}
            >
              <Text style={[s.actionBtnText, { color: C.success }]}>Rate Order</Text>
            </TouchableOpacity>
          )}
          {isReady && ratedOrders[item.id] && (
            <View style={[s.actionBtn, { borderColor: C.border, backgroundColor: C.surfaceHigh }]}>
              <Text style={[s.actionBtnText, { color: C.accent }]}>Rated {ratedOrders[item.id]} ⭐</Text>
            </View>
          )}
          <TouchableOpacity style={[s.actionBtn, s.deleteBtn]} onPress={() => handleDelete(item.id)}>
            <Text style={s.deleteBtnText}>Delete History</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <View style={[s.container, isWeb && s.containerWeb]}>
        
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backCircle}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.title}>Order History</Text>
          <View style={{ width: 38 }} />
        </View>

        {loading ? (
          <View style={s.center}>
            <ActivityIndicator size="large" color={C.accent} />
          </View>
        ) : orders.length === 0 ? (
          <View style={s.center}>
            <Text style={s.emptyIcon}>🕰️</Text>
            <Text style={s.emptyTitle}>No Order History</Text>
            <Text style={s.emptySub}>Your past orders will appear here.</Text>
            <TouchableOpacity style={s.ctaBtn} onPress={() => router.replace('/')}>
              <LinearGradient colors={[C.accent, C.accentDark]} style={s.ctaGrad}>
                <Text style={s.ctaBtnText}>Browse Menu</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={s.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Rating Modal */}
      <Modal visible={ratingModalVisible} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={[s.modalContent, isWeb && s.modalContentWeb]}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Rate Your Order</Text>
              <TouchableOpacity onPress={() => setRatingModalVisible(false)} style={s.modalCloseBtn}>
                <Text style={s.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={s.ratingSub}>How was the food and service for order {ratingOrder?.id}?</Text>

            <View style={s.starsRow}>
              {[1, 2, 3, 4, 5].map(num => (
                <TouchableOpacity key={num} onPress={() => setStars(num)}>
                  <Text style={[s.starIcon, stars >= num && s.starIconActive]}>
                    {stars >= num ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={s.feedbackInput}
              placeholder="What did you like or dislike?"
              placeholderTextColor={C.textMuted}
              multiline
              value={feedback}
              onChangeText={setFeedback}
            />

            <TouchableOpacity 
              style={[s.submitBtn, stars === 0 && s.submitBtnDisabled]} 
              onPress={submitRating}
              disabled={stars === 0}
            >
              <Text style={s.submitBtnText}>Submit Feedback</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  container: { flex: 1 },
  containerWeb: { maxWidth: 600, width: '100%', alignSelf: 'center' },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  backCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: C.surfaceHigh, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  backArrow: { fontSize: 18, color: C.text },
  title: { fontSize: 18, fontFamily: 'Outfit_800ExtraBold', color: C.text },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 24, fontFamily: 'Outfit_800ExtraBold', color: C.text, marginBottom: 8 },
  emptySub: { fontSize: 15, color: C.textSec, fontFamily: 'Outfit_400Regular', textAlign: 'center', marginBottom: 24 },

  listContent: { padding: 16, gap: 16 },

  orderCard: { backgroundColor: C.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderId: { color: C.text, fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 10, fontFamily: 'Outfit_800ExtraBold', letterSpacing: 1 },
  dateText: { color: C.textMuted, fontSize: 12, fontFamily: 'Outfit_400Regular', marginBottom: 12 },

  itemsContainer: { backgroundColor: C.surfaceHigh, borderRadius: 12, padding: 12, marginBottom: 12 },
  itemText: { color: C.textSec, fontSize: 13, fontFamily: 'Outfit_500Medium', marginBottom: 4 },

  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderTopWidth: 1, borderTopColor: C.border, paddingTop: 12 },
  totalLabel: { color: C.text, fontSize: 14, fontFamily: 'Outfit_600SemiBold' },
  totalAmount: { color: C.accent, fontSize: 16, fontFamily: 'Outfit_900Black' },

  actionRow: { flexDirection: 'row', gap: 8 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  actionBtnText: { fontFamily: 'Outfit_700Bold', fontSize: 13 },
  deleteBtn: { borderColor: C.textMuted },
  deleteBtnText: { color: C.textMuted, fontFamily: 'Outfit_700Bold', fontSize: 13 },

  ctaBtn: { width: '100%', borderRadius: 16, overflow: 'hidden' },
  ctaGrad: { paddingVertical: 16, alignItems: 'center' },
  ctaBtnText: { color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  modalContentWeb: { maxWidth: 500, width: '100%', alignSelf: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, marginBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 20, fontFamily: 'Outfit_800ExtraBold', color: C.text },
  modalCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.surfaceHigh, alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { fontSize: 14, color: C.textMuted, fontFamily: 'Outfit_700Bold' },
  ratingSub: { color: C.textSec, fontSize: 14, fontFamily: 'Outfit_400Regular', marginBottom: 24 },
  
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 24 },
  starIcon: { fontSize: 40, color: C.border },
  starIconActive: { color: C.accent },

  feedbackInput: { backgroundColor: C.surfaceHigh, borderRadius: 12, padding: 16, color: C.text, fontSize: 14, fontFamily: 'Outfit_400Regular', minHeight: 100, textAlignVertical: 'top', marginBottom: 24, borderWidth: 1, borderColor: C.border },
  submitBtn: { backgroundColor: C.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
});
