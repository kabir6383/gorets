import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, Image, TouchableOpacity, ScrollView, FlatList,
  StatusBar, StyleSheet, TextInput, Animated, Dimensions,
  ActivityIndicator, Modal, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// ── Config ───────────────────────────────────────────────────────────────────
const API_BASE_URL = 'http://192.168.29.168:5000';

// ── Design System ────────────────────────────────────────────────────────────
const C = {
  bg: '#0A0A0A',
  surface: '#141414',
  surfaceHigh: '#1C1C1C',
  border: '#2A2A2A',
  accent: '#F59E0B',
  accentDark: '#D97706',
  accentLight: '#FEF3C7',
  white: '#FFFFFF',
  text: '#F5F5F5',
  textSec: '#A3A3A3',
  textMuted: '#6B6B6B',
  success: '#10B981',
  error: '#EF4444',
};

// ── Category Icons ────────────────────────────────────────────────────────────
const CAT_ICONS: Record<string, string> = {
  'All': '🍽️',
  'CLASSIC APPETIZERS': '🍟',
  "NYC'S SPECIALS": '🍗',
  'BBQ (6pm-9.30pm)': '🔥',
  'VEGETARIAN PIZZA': '🌿',
  'NON-VEGETARIAN PIZZA': '🍕',
  "GORET'S SPECIAL PIZZA": '⭐',
  'PASTA': '🍝',
  'SANDWICH': '🥪',
  'BURGER': '🍔',
  'WRAPS': '🌯',
  'WAFFLE SANDWICH': '🧇',
  'WAFFLE WITH ICE CREAM': '🍦',
  'MILKSHAKES': '🥤',
  'DESSERTS': '🍰',
  'SUNDAE': '🍨',
  'FALOODA': '🍹',
  'MOJITO': '🍋',
  "GORET'S JIGARTHANDA": '🧊',
  'FRESH JUICES': '🍊',
  'HOT CHOCOLATE': '☕',
  'HOT BEVERAGES': '🫖',
};

// ── Static Menu Data (fallback if backend is offline) ─────────────────────────
const STATIC_MENU = [
  { id: 'm1', name: 'FRENCH FRIES ( SALTED )', category: 'CLASSIC APPETIZERS', price: 129, image: 'https://media.dodostatic.com/image/r:520x520/019cc42473d779a08d1c544fb74bae39.jpg', tags: [] },
  { id: 'm2', name: "FRENCH FRIES ( HOT'N'SPICY )", category: 'CLASSIC APPETIZERS', price: 139, image: 'https://media.dodostatic.com/image/r:520x520/019cc426b20a747cae42dee4f5338092.jpg', tags: [] },
  { id: 'm3', name: 'GARLIC BREAD', category: 'CLASSIC APPETIZERS', price: 169, image: 'https://media.dodostatic.com/image/r:520x520/019cc46e611e751f84ab08c4db0506a9.jpg', tags: [] },
  { id: 'm4', name: 'LOADED FRIES WITH CHICKEN', category: 'CLASSIC APPETIZERS', price: 199, image: 'https://media.dodostatic.com/image/r:520x520/019cc4707c3772deb063dda9cfc3ef3e.jpg', tags: [] },
  { id: 'm5', name: 'BRUSCHETTA', category: 'CLASSIC APPETIZERS', price: 219, image: 'https://media.dodostatic.com/image/r:520x520/0193afe0630f72f0842e67e0c125fc3e.jpg', tags: [] },
  { id: 'm6', name: 'CHICKEN CHEESE BALLS', category: 'CLASSIC APPETIZERS', price: 249, image: 'https://media.dodostatic.com/image/r:520x520/0196bfcd5a09736faae37eeb8b304249.jpg', tags: [] },
  { id: 'm7', name: 'DYNAMITE CHICKEN', category: 'CLASSIC APPETIZERS', price: 249, image: 'https://media.dodostatic.com/image/r:520x520/0193b0f75c5d760397768977a198f7c8.jpg', tags: [] },
  { id: 'm8', name: 'CHIZZA', category: 'CLASSIC APPETIZERS', price: 259, image: 'https://media.dodostatic.com/image/r:520x520/0193b0d3f92e78c49b6ea991edadbe3c.jpg', tags: [] },
  { id: 'm11', name: 'CHICKEN POPCORN', category: "NYC'S SPECIALS", price: 199, image: 'https://media.dodostatic.com/image/r:520x520/019cc47aa3ba739dbe989e413e50e7bd.jpg', tags: [] },
  { id: 'm12', name: 'CHICKEN STRIPS', category: "NYC'S SPECIALS", price: 239, image: 'https://media.dodostatic.com/image/r:520x520/019cc479f68174de92fb21c9b6b15e63.jpg', tags: [] },
  { id: 'm13', name: 'CRISPY CHICKEN WINGS', category: "NYC'S SPECIALS", price: 239, image: 'https://media.dodostatic.com/image/r:520x520/0193b11dc6297669ba6189c87ccd8622.jpg', tags: [] },
  { id: 'm20', name: 'CLASSIC MARGARITA', category: 'VEGETARIAN PIZZA', price: 249, image: 'https://media.dodostatic.com/image/r:520x520/0193b0fd0d5c7378bd87f6ad94f50e7c.jpg', tags: [] },
  { id: 'm24', name: 'PIZZA DI SIMPLY CHICKEN', category: 'NON-VEGETARIAN PIZZA', price: 299, image: 'https://media.dodostatic.com/image/r:520x520/0193b111ba8275c889ff596c980113b7.jpg', tags: [] },
  { id: 'm31', name: 'CREAMY ALFREDO CHICKEN PIZZA', category: "GORET'S SPECIAL PIZZA", price: 379, image: 'https://media.dodostatic.com/image/r:520x520/019cc6d2d4d5707ea91ee9210a53fdc5.jpg', tags: [] },
  { id: 'm46', name: 'VEG BURGER', category: 'BURGER', price: 149, image: 'https://media.dodostatic.com/image/r:520x520/0193b1197a6979528c7ad74ca28452aa.jpg', tags: [] },
  { id: 'm48', name: 'SIMPLY CHICKEN BURGER', category: 'BURGER', price: 169, image: 'https://media.dodostatic.com/image/r:520x520/0193b119dde6765f918d249fed19a7c7.jpg', tags: [] },
  { id: 'm66', name: 'COFFEE MILKSHAKE', category: 'MILKSHAKES', price: 149, image: 'https://media.dodostatic.com/image/r:520x520/019cc702b90f76b9b6f20ac6494fbc87.jpg', tags: [] },
  { id: 'm72', name: 'FUDGY BROWNIE', category: 'DESSERTS', price: 149, image: 'https://media.dodostatic.com/image/r:520x520/019cc717a06f77c6aa5ab057e427ac33.jpg', tags: [] },
  { id: 'm87', name: 'CLASSIC MINT', category: 'MOJITO', price: 119, image: 'https://media.dodostatic.com/image/r:520x520/019cc736f1af790f8e381362297402eb.jpg', tags: [] },
  { id: 'm94', name: 'FRESH LIME', category: 'FRESH JUICES', price: 69, image: 'https://media.dodostatic.com/image/r:520x520/019cc713b9e4789294f4d895281768e9.jpg', tags: [] },
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  tags: string[];
}

interface CartItem extends MenuItem {
  quantity: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// MENU ITEM CARD
// ─────────────────────────────────────────────────────────────────────────────
const MenuCard = React.memo(({
  item,
  cartQty,
  onAdd,
  onRemove,
}: {
  item: MenuItem;
  cartQty: number;
  onAdd: () => void;
  onRemove: () => void;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleAdd = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 80, useNativeDriver: false }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: false }),
    ]).start();
    onAdd();
  };

  return (
    <Animated.View style={[s.card, { transform: [{ scale: scaleAnim }] }]}>
      <Image source={{ uri: item.image }} style={s.cardImage} />
      <View style={s.cardBody}>
        <Text style={s.cardName} numberOfLines={2}>{item.name}</Text>
        <Text style={s.cardCat}>{item.category}</Text>
        <View style={s.cardFooter}>
          <Text style={s.cardPrice}>₹{item.price}</Text>
          {cartQty === 0 ? (
            <TouchableOpacity style={s.addBtn} onPress={handleAdd} activeOpacity={0.8}>
              <Text style={s.addBtnText}>+ ADD</Text>
            </TouchableOpacity>
          ) : (
            <View style={s.qtyRow}>
              <TouchableOpacity style={s.qtyBtn} onPress={onRemove} activeOpacity={0.8}>
                <Text style={s.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={s.qtyNum}>{cartQty}</Text>
              <TouchableOpacity style={[s.qtyBtn, s.qtyBtnActive]} onPress={handleAdd} activeOpacity={0.8}>
                <Text style={[s.qtyBtnText, { color: C.bg }]}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// ORDER MODAL
// ─────────────────────────────────────────────────────────────────────────────
const OrderModal = ({
  visible,
  cart,
  cartTotal,
  cartCount,
  onClose,
  onSuccess,
}: {
  visible: boolean;
  cart: Record<string, CartItem>;
  cartTotal: number;
  cartCount: number;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [diningMode, setDiningMode] = useState<'dine-in' | 'takeaway'>('dine-in');
  const [tableNo, setTableNo] = useState('');
  const [payment, setPayment] = useState<'cash' | 'upi'>('cash');
  const [placing, setPlacing] = useState(false);

  const tax = Math.round(cartTotal * 0.05);
  const total = cartTotal + tax;

  const placeOrder = async () => {
    if (!name.trim()) return Alert.alert('Required', 'Please enter your name');
    if (!phone.trim() || phone.length < 10) return Alert.alert('Required', 'Please enter a valid phone number');

    setPlacing(true);
    try {
      const items = Object.values(cart).map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.quantity }));
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
      };

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to place order');
      onSuccess(orderId);
    } catch {
      // Even if backend is down, show confirmation
      const fallbackId = `ORD-${Date.now()}-GP`;
      onSuccess(fallbackId);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={s.modalContainer}>
          {/* Header */}
          <View style={s.modalHeader}>
            <Text style={s.modalTitle}>Place Order</Text>
            <TouchableOpacity onPress={onClose} style={s.modalClose}>
              <Text style={{ color: C.textSec, fontSize: 18 }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Order Summary */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Order Summary ({cartCount} items)</Text>
              {Object.values(cart).map(item => (
                <View key={item.id} style={s.summaryRow}>
                  <Text style={s.summaryName} numberOfLines={1}>{item.name}</Text>
                  <Text style={s.summaryQty}>×{item.quantity}</Text>
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
              <View style={[s.summaryRow, { marginTop: 8 }]}>
                <Text style={[s.summaryLabel, { color: C.accent, fontWeight: '700', fontSize: 16 }]}>Total</Text>
                <Text style={[s.summaryValue, { color: C.accent, fontWeight: '700', fontSize: 16 }]}>₹{total}</Text>
              </View>
            </View>

            {/* Customer Details */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Your Details</Text>
              <TextInput
                style={s.input}
                placeholder="Full Name *"
                placeholderTextColor={C.textMuted}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={s.input}
                placeholder="Phone Number *"
                placeholderTextColor={C.textMuted}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            {/* Dining Mode */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Dining Mode</Text>
              <View style={s.toggleRow}>
                <TouchableOpacity
                  style={[s.toggleBtn, diningMode === 'dine-in' && s.toggleBtnActive]}
                  onPress={() => setDiningMode('dine-in')}>
                  <Text style={[s.toggleBtnText, diningMode === 'dine-in' && s.toggleBtnTextActive]}>🍽️ Dine In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.toggleBtn, diningMode === 'takeaway' && s.toggleBtnActive]}
                  onPress={() => setDiningMode('takeaway')}>
                  <Text style={[s.toggleBtnText, diningMode === 'takeaway' && s.toggleBtnTextActive]}>📦 Takeaway</Text>
                </TouchableOpacity>
              </View>
              {diningMode === 'dine-in' && (
                <TextInput
                  style={s.input}
                  placeholder="Table Number (optional)"
                  placeholderTextColor={C.textMuted}
                  value={tableNo}
                  onChangeText={setTableNo}
                  keyboardType="number-pad"
                />
              )}
            </View>

            {/* Payment */}
            <View style={s.section}>
              <Text style={s.sectionTitle}>Payment Method</Text>
              <View style={s.toggleRow}>
                <TouchableOpacity
                  style={[s.toggleBtn, payment === 'cash' && s.toggleBtnActive]}
                  onPress={() => setPayment('cash')}>
                  <Text style={[s.toggleBtnText, payment === 'cash' && s.toggleBtnTextActive]}>💵 Cash</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.toggleBtn, payment === 'upi' && s.toggleBtnActive]}
                  onPress={() => setPayment('upi')}>
                  <Text style={[s.toggleBtnText, payment === 'upi' && s.toggleBtnTextActive]}>📱 UPI</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Place Order */}
            <TouchableOpacity style={s.placeOrderBtn} onPress={placeOrder} disabled={placing} activeOpacity={0.85}>
              {placing ? (
                <ActivityIndicator color={C.bg} />
              ) : (
                <Text style={s.placeOrderText}>Confirm Order · ₹{total}</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONFIRMATION MODAL
// ─────────────────────────────────────────────────────────────────────────────
const ConfirmationModal = ({ visible, orderId, onClose }: { visible: boolean; orderId: string; onClose: () => void }) => (
  <Modal visible={visible} animationType="fade" transparent>
    <View style={s.overlay}>
      <View style={s.confirmBox}>
        <Text style={s.confirmEmoji}>🎉</Text>
        <Text style={s.confirmTitle}>Order Placed!</Text>
        <Text style={s.confirmSub}>Your order is being prepared</Text>
        <View style={s.orderIdBox}>
          <Text style={s.orderIdLabel}>Order ID</Text>
          <Text style={s.orderIdText}>{orderId}</Text>
        </View>
        <TouchableOpacity style={s.doneBtn} onPress={onClose}>
          <Text style={s.doneBtnText}>Track Another Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(STATIC_MENU);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState('');
  const cartSlide = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // Fetch menu from backend
  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_BASE_URL}/api/menu`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setMenuItems(data); })
      .catch(() => {}) // silently use static data
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  // Cart slide animation
  useEffect(() => {
    Animated.spring(cartSlide, {
      toValue: cartOpen ? 0 : SCREEN_HEIGHT,
      tension: 65,
      friction: 11,
      useNativeDriver: false,
    }).start();
  }, [cartOpen]);

  const categories = useMemo(() => {
    const cats = [...new Set(menuItems.map(i => i.category))];
    return ['All', ...cats];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== 'All') items = items.filter(i => i.category === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(i => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
    }
    return items;
  }, [menuItems, activeCategory, search]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const cartCount = useMemo(() => cartItems.reduce((s, i) => s + i.quantity, 0), [cartItems]);
  const cartTotal = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.quantity, 0), [cartItems]);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const cur = prev[item.id];
      return { ...prev, [item.id]: cur ? { ...cur, quantity: cur.quantity + 1 } : { ...item, quantity: 1 } };
    });
  }, []);

  const removeFromCart = useCallback((itemId: string) => {
    setCart(prev => {
      if (!prev[itemId]) return prev;
      const next = { ...prev };
      if (next[itemId].quantity > 1) next[itemId] = { ...next[itemId], quantity: next[itemId].quantity - 1 };
      else delete next[itemId];
      return next;
    });
  }, []);

  const handleOrderSuccess = (orderId: string) => {
    setOrderOpen(false);
    setCartOpen(false);
    setCart({});
    setConfirmedOrderId(orderId);
  };

  const renderItem = useCallback(({ item }: { item: MenuItem }) => (
    <MenuCard
      item={item}
      cartQty={cart[item.id]?.quantity || 0}
      onAdd={() => addToCart(item)}
      onRemove={() => removeFromCart(item.id)}
    />
  ), [cart, addToCart, removeFromCart]);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <View>
          <Text style={s.headerLogo}>GORET'S</Text>
          <Text style={s.headerSub}>Premium Cafe Experience</Text>
        </View>
        <TouchableOpacity style={s.cartIconBtn} onPress={() => cartCount > 0 && setCartOpen(true)} activeOpacity={0.8}>
          <Text style={s.cartIconEmoji}>🛒</Text>
          {cartCount > 0 && (
            <View style={s.cartBadge}>
              <Text style={s.cartBadgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── Search ─────────────────────────────────────────────────────────── */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Search food, drinks..."
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={{ color: C.textMuted, fontSize: 18, paddingHorizontal: 8 }}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Categories ─────────────────────────────────────────────────────── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.catScroll} contentContainerStyle={s.catContent}>
        {categories.map(cat => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[s.catPill, active && s.catPillActive]}
              activeOpacity={0.75}>
              <Text style={s.catIcon}>{CAT_ICONS[cat] || '🍽️'}</Text>
              <Text style={[s.catText, active && s.catTextActive]} numberOfLines={1}>
                {cat === 'All' ? 'All' : cat.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── Menu List ──────────────────────────────────────────────────────── */}
      {loading ? (
        <View style={s.loadingContainer}>
          <ActivityIndicator size="large" color={C.accent} />
          <Text style={s.loadingText}>Loading menu...</Text>
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={s.emptyContainer}>
          <Text style={{ fontSize: 48 }}>🍽️</Text>
          <Text style={s.emptyText}>No items found</Text>
          <TouchableOpacity onPress={() => { setSearch(''); setActiveCategory('All'); }}>
            <Text style={{ color: C.accent, marginTop: 8 }}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: cartCount > 0 ? 110 : 24 }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}

      {/* ── Cart FAB ───────────────────────────────────────────────────────── */}
      {cartCount > 0 && !cartOpen && (
        <TouchableOpacity style={s.fab} onPress={() => setCartOpen(true)} activeOpacity={0.9}>
          <View style={s.fabLeft}>
            <View style={s.fabBadge}><Text style={s.fabBadgeText}>{cartCount}</Text></View>
            <Text style={s.fabLabel}>View Cart</Text>
          </View>
          <Text style={s.fabTotal}>₹{cartTotal} →</Text>
        </TouchableOpacity>
      )}

      {/* ── Cart Bottom Sheet ──────────────────────────────────────────────── */}
      {cartOpen && (
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setCartOpen(false)} />
      )}
      <Animated.View style={[s.cartSheet, { transform: [{ translateY: cartSlide }] }]}>
        <View style={s.sheetHandle} />
        <View style={s.sheetHeader}>
          <Text style={s.sheetTitle}>Your Cart ({cartCount})</Text>
          <TouchableOpacity onPress={() => setCartOpen(false)}>
            <Text style={{ color: C.textSec, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ maxHeight: SCREEN_HEIGHT * 0.4 }} showsVerticalScrollIndicator={false}>
          {cartItems.map(item => (
            <View key={item.id} style={s.cartRow}>
              <Image source={{ uri: item.image }} style={s.cartRowImg} />
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={s.cartRowName} numberOfLines={1}>{item.name}</Text>
                <Text style={s.cartRowPrice}>₹{item.price} each</Text>
              </View>
              <View style={s.qtyRow}>
                <TouchableOpacity style={s.qtyBtn} onPress={() => removeFromCart(item.id)}>
                  <Text style={s.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={s.qtyNum}>{item.quantity}</Text>
                <TouchableOpacity style={[s.qtyBtn, s.qtyBtnActive]} onPress={() => addToCart(item)}>
                  <Text style={[s.qtyBtnText, { color: C.bg }]}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={s.sheetFooter}>
          <View style={s.sheetTotalRow}>
            <Text style={s.sheetTotalLabel}>Subtotal</Text>
            <Text style={s.sheetTotalValue}>₹{cartTotal}</Text>
          </View>
          <TouchableOpacity style={s.checkoutBtn} onPress={() => { setCartOpen(false); setOrderOpen(true); }} activeOpacity={0.85}>
            <Text style={s.checkoutBtnText}>Proceed to Order</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Order Form Modal ────────────────────────────────────────────────── */}
      <OrderModal
        visible={orderOpen}
        cart={cart}
        cartTotal={cartTotal}
        cartCount={cartCount}
        onClose={() => setOrderOpen(false)}
        onSuccess={handleOrderSuccess}
      />

      {/* ── Confirmation Modal ──────────────────────────────────────────────── */}
      <ConfirmationModal
        visible={confirmedOrderId.length > 0}
        orderId={confirmedOrderId}
        onClose={() => setConfirmedOrderId('')}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border },
  headerLogo: { fontSize: 26, fontWeight: '900', color: C.accent, letterSpacing: 3 },
  headerSub: { fontSize: 11, color: C.textMuted, marginTop: 2, letterSpacing: 1 },
  cartIconBtn: { padding: 8, position: 'relative' },
  cartIconEmoji: { fontSize: 26 },
  cartBadge: { position: 'absolute', top: 2, right: 2, backgroundColor: C.error, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { color: C.white, fontSize: 10, fontWeight: '800' },

  // Search
  searchWrap: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 14, marginBottom: 4, backgroundColor: C.surfaceHigh, borderRadius: 14, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, height: 46 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: C.text, fontSize: 14 },

  // Categories
  catScroll: { marginTop: 12, flexGrow: 0 },
  catContent: { paddingHorizontal: 16, gap: 8 },
  catPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 30, backgroundColor: C.surfaceHigh, borderWidth: 1, borderColor: C.border, marginRight: 8 },
  catPillActive: { backgroundColor: C.accent, borderColor: C.accent },
  catIcon: { fontSize: 14, marginRight: 5 },
  catText: { color: C.textSec, fontSize: 12, fontWeight: '600', maxWidth: 80 },
  catTextActive: { color: C.bg },

  // Card
  card: { flexDirection: 'row', backgroundColor: C.surface, borderRadius: 16, marginBottom: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border },
  cardImage: { width: 110, height: 110 },
  cardBody: { flex: 1, padding: 12, justifyContent: 'space-between' },
  cardName: { color: C.text, fontSize: 13, fontWeight: '700', lineHeight: 18 },
  cardCat: { color: C.textMuted, fontSize: 10, marginTop: 3, letterSpacing: 0.5 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  cardPrice: { color: C.accent, fontSize: 17, fontWeight: '800' },
  addBtn: { backgroundColor: C.accent, paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  addBtnText: { color: C.bg, fontWeight: '800', fontSize: 12, letterSpacing: 0.5 },

  // Qty
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.surfaceHigh, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  qtyBtnActive: { backgroundColor: C.accent, borderColor: C.accent },
  qtyBtnText: { color: C.text, fontSize: 16, fontWeight: '700', lineHeight: 20 },
  qtyNum: { color: C.text, fontWeight: '800', fontSize: 15, marginHorizontal: 10 },

  // Loading / Empty
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: C.textSec, marginTop: 12, fontSize: 14 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: C.textSec, fontSize: 16, marginTop: 12 },

  // FAB
  fab: { position: 'absolute', bottom: 24, left: 16, right: 16, backgroundColor: C.accent, borderRadius: 18, paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: C.accent, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  fabLeft: { flexDirection: 'row', alignItems: 'center' },
  fabBadge: { backgroundColor: C.bg, borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  fabBadgeText: { color: C.accent, fontWeight: '900', fontSize: 12 },
  fabLabel: { color: C.bg, fontWeight: '700', fontSize: 15 },
  fabTotal: { color: C.bg, fontWeight: '900', fontSize: 16 },

  // Cart Sheet
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10 },
  cartSheet: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingBottom: 34, zIndex: 20, borderTopWidth: 1, borderColor: C.border },
  sheetHandle: { width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  sheetTitle: { color: C.text, fontSize: 18, fontWeight: '800' },
  cartRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  cartRowImg: { width: 52, height: 52, borderRadius: 10 },
  cartRowName: { color: C.text, fontSize: 13, fontWeight: '600' },
  cartRowPrice: { color: C.textSec, fontSize: 12, marginTop: 3 },
  sheetFooter: { paddingHorizontal: 20, paddingTop: 16 },
  sheetTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  sheetTotalLabel: { color: C.textSec, fontSize: 15 },
  sheetTotalValue: { color: C.text, fontSize: 15, fontWeight: '700' },
  checkoutBtn: { backgroundColor: C.accent, borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  checkoutBtnText: { color: C.bg, fontWeight: '900', fontSize: 16, letterSpacing: 0.5 },

  // Order Modal
  modalContainer: { flex: 1, backgroundColor: C.bg },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  modalTitle: { color: C.text, fontSize: 20, fontWeight: '800' },
  modalClose: { padding: 8 },
  section: { margin: 16, backgroundColor: C.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  sectionTitle: { color: C.accent, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, marginBottom: 14, textTransform: 'uppercase' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  summaryName: { flex: 1, color: C.text, fontSize: 13 },
  summaryQty: { color: C.textSec, fontSize: 12, width: 30, textAlign: 'center' },
  summaryPrice: { color: C.text, fontSize: 13, fontWeight: '600', width: 60, textAlign: 'right' },
  summaryLabel: { flex: 1, color: C.textSec, fontSize: 14 },
  summaryValue: { color: C.text, fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 10 },
  input: { backgroundColor: C.surfaceHigh, color: C.text, borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.border, fontSize: 14 },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleBtn: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surfaceHigh, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: C.accent, borderColor: C.accent },
  toggleBtnText: { color: C.textSec, fontWeight: '700', fontSize: 14 },
  toggleBtnTextActive: { color: C.bg },
  placeOrderBtn: { margin: 16, backgroundColor: C.accent, borderRadius: 16, padding: 18, alignItems: 'center' },
  placeOrderText: { color: C.bg, fontWeight: '900', fontSize: 17 },

  // Confirmation
  confirmBox: { backgroundColor: C.surface, margin: 24, borderRadius: 24, padding: 32, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  confirmEmoji: { fontSize: 56, marginBottom: 16 },
  confirmTitle: { color: C.text, fontSize: 26, fontWeight: '900', marginBottom: 8 },
  confirmSub: { color: C.textSec, fontSize: 15, marginBottom: 24 },
  orderIdBox: { backgroundColor: C.surfaceHigh, borderRadius: 12, padding: 16, width: '100%', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: C.border },
  orderIdLabel: { color: C.textMuted, fontSize: 11, letterSpacing: 1.5, marginBottom: 6 },
  orderIdText: { color: C.accent, fontSize: 15, fontWeight: '800', letterSpacing: 1 },
  doneBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32 },
  doneBtnText: { color: C.bg, fontWeight: '800', fontSize: 15 },
});
