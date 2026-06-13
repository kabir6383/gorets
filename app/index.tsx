import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import CartFAB from '../components/CartFAB';
import CategoryPill from '../components/CategoryPill';
import MenuCard from '../components/MenuCard';
import { C } from '../constants/colors';
import { CAT_ICONS, MenuItem, STATIC_MENU } from '../constants/menu';
import { useCart } from '../store/cart';
import { useAuth } from '../store/auth';
import { supabase } from '../utils/supabase';

const { width: SW } = Dimensions.get('window');
const NUM_COLS = SW > 600 ? 3 : 2;

// How far the hero needs to scroll before the header "locks"
const HERO_HEIGHT = 200;

export default function MenuScreen() {
  const router = useRouter();
  const { cart, cartCount, cartTotal, addToCart, removeFromCart } = useCart();
  const { user } = useAuth();

  const [menuItems, setMenuItems] = useState<MenuItem[]>(STATIC_MENU);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [itemRatings, setItemRatings] = useState<Record<string, { sum: number; count: number }>>({});
  const [storeRating, setStoreRating] = useState<{ avg: number; count: number } | null>(null);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Fetch menu from backend and ratings from local storage
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const ratingsStr = await AsyncStorage.getItem('item_ratings');
        if (ratingsStr) {
          const parsed = JSON.parse(ratingsStr);
          setItemRatings(parsed);
          
          let totalSum = 0;
          let totalCount = 0;
          Object.values(parsed).forEach((r: any) => {
            totalSum += r.sum;
            totalCount += r.count;
          });
          
          if (totalCount > 0) {
            setStoreRating({ avg: totalSum / totalCount, count: totalCount });
          }
        }
      } catch (e) {}

      try {
        const { data, error } = await supabase.from('menu').select('*');
        if (!error && data && data.length > 0) {
          setMenuItems(data);
        } else {
          setMenuItems(STATIC_MENU);
        }
      } catch (e) {
        setMenuItems(STATIC_MENU);
      }
      
      setLoading(false);
    };
    fetchAll();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(menuItems.map(i => i.category))];
    return ['All', ...cats];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    let items = menuItems;
    if (activeCategory !== 'All') items = items.filter(i => i.category === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
      );
    }
    return items;
  }, [menuItems, activeCategory, search]);

  const handleAdd = useCallback((item: MenuItem) => {
    addToCart(item);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [addToCart]);

  const renderItem = useCallback(({ item }: { item: MenuItem }) => {
    const rat = itemRatings[item.id];
    return (
      <MenuCard
        item={item}
        cartQty={cart[item.id]?.quantity || 0}
        rating={rat ? { avg: rat.sum / rat.count, count: rat.count } : undefined}
        onAdd={() => handleAdd(item)}
        onRemove={() => removeFromCart(item.id)}
      />
    );
  }, [cart, handleAdd, removeFromCart, itemRatings]);

  // Hero fades/slides as you scroll past it
  const heroOpacity = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT * 0.6],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const heroTranslate = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT],
    outputRange: [0, -HERO_HEIGHT * 0.3],
    extrapolate: 'clamp',
  });

  // Header title fades IN as hero fades out (collapsed header)
  const collapsedOpacity = scrollY.interpolate({
    inputRange: [HERO_HEIGHT * 0.5, HERO_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // ── Hero (scrollable, not sticky) ────────────────────────────────────────
  const HeroSection = (
    <Animated.View style={[s.heroWrap, { opacity: heroOpacity, transform: [{ translateY: heroTranslate }] }]}>
      <LinearGradient colors={['#1C0F00', '#0F0A00', '#0A0A0A']} style={s.hero}>
        <View style={s.heroBadge}>
          <Text style={s.heroBadgeText}>🟢 Open Now</Text>
        </View>
        <Text style={s.heroTitle}>What's on your{'\n'}mind today?</Text>
        <Text style={s.heroSub}>Fresh, hot & made with love</Text>
        <View style={s.statsRow}>
          {[
            { icon: '🍕', label: `${menuItems.length}+ dishes` },
            { icon: '⭐', label: storeRating ? `${storeRating.avg.toFixed(1)} rating` : 'New' },
            { icon: '⚡', label: '5 min' },
          ].map((st, i) => (
            <View key={i} style={s.statChip}>
              <Text style={s.statIcon}>{st.icon}</Text>
              <Text style={s.statLabel}>{st.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>
    </Animated.View>
  );

  // ── Sticky inner content (search + categories) ────────────────────────────
  // This is put in ListHeaderComponent AFTER the hero,
  // and we use stickyHeaderIndices={[1]} to pin it.
  const StickySearchCat = (
    <View style={s.stickyBlock}>
      {/* Search */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Search dishes, drinks..."
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={s.clearSearchBtn}>
            <Text style={s.clearSearchText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.catContent}
        style={s.catScroll}
      >
        {categories.map(cat => (
          <CategoryPill
            key={cat}
            label={cat}
            icon={CAT_ICONS[cat] || '🍽️'}
            active={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* Result count */}
      <View style={s.resultRow}>
        <Text style={s.resultCount}>
          <Text style={s.resultNum}>{filteredItems.length}</Text>
          {' '}{filteredItems.length === 1 ? 'item' : 'items'}
          {activeCategory !== 'All' && (
            <Text style={s.resultCat}> · {activeCategory.split(' ')[0]}</Text>
          )}
        </Text>
        {(activeCategory !== 'All' || search.length > 0) && (
          <TouchableOpacity
            style={s.clearFilterBtn}
            onPress={() => { setActiveCategory('All'); setSearch(''); }}
          >
            <Text style={s.clearFilterText}>Clear ✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.root} edges={['top']}>

      {/* ── FIXED HEADER (always solid, never overlaps) ───────────────────── */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Text style={s.logo}>GORET'S</Text>
          {/* Collapsed subtitle fades in on scroll */}
          <Animated.Text style={[s.logoCollapsed, { opacity: collapsedOpacity }]}>
            Premium Café
          </Animated.Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <TouchableOpacity
            style={s.profileBtn}
            onPress={() => router.push(user ? '/profile' : '/login')}
            activeOpacity={0.8}
          >
            <Text style={s.profileEmoji}>{user ? '👤' : '🔐'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.historyBtn}
            onPress={() => router.push('/history')}
            activeOpacity={0.8}
          >
            <Text style={s.historyEmoji}>📜</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.cartBtn}
            onPress={() => router.push('/cart')}
            activeOpacity={0.8}
          >
            <Text style={s.cartEmoji}>🛒</Text>
            {cartCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* ── SCROLLABLE CONTENT ────────────────────────────────────────────── */}
      {loading ? (
        <View style={s.loadingState}>
          <ActivityIndicator size="large" color={C.accent} />
          <Text style={s.loadingText}>Loading menu...</Text>
        </View>
      ) : filteredItems.length === 0 && (search || activeCategory !== 'All') ? (
        <>
          {StickySearchCat}
          <View style={s.emptyState}>
            <Text style={s.emptyEmoji}>🍽️</Text>
            <Text style={s.emptyTitle}>Nothing found</Text>
            <Text style={s.emptySub}>Try a different search or category</Text>
            <TouchableOpacity
              style={s.emptyBtn}
              onPress={() => { setSearch(''); setActiveCategory('All'); }}
            >
              <Text style={s.emptyBtnText}>Show All Items</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Animated.FlatList
          data={filteredItems}
          keyExtractor={(item: MenuItem) => item.id}
          renderItem={renderItem}
          numColumns={NUM_COLS}
          key={`grid-${NUM_COLS}`}
          // Index 0 = HeroSection, index 1 = StickySearchCat → stick index 1
          ListHeaderComponent={
            <>
              {HeroSection}
              {StickySearchCat}
            </>
          }
          // stickyHeaderIndices pins the Nth child of FlatList (0-indexed).
          // Child 0 = ListHeaderComponent (which we treat as a whole), 
          // so we need a wrapper trick — put hero + sticky as TWO separate items.
          contentContainerStyle={[
            s.listContent,
            { paddingBottom: cartCount > 0 ? 120 : 40 },
          ]}
          columnWrapperStyle={s.columnWrapper}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={5}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        />
      )}

      {/* ── Cart FAB ─────────────────────────────────────────────────────────── */}
      <CartFAB
        cartCount={cartCount}
        cartTotal={cartTotal}
        onPress={() => router.push('/cart')}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // ── Fixed header (solid, in-flow, never overlapping) ──────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerLeft: {},
  logo: {
    fontSize: 22,
    fontFamily: 'Outfit_900Black',
    color: C.accent,
    letterSpacing: 3,
  },
  logoCollapsed: {
    fontSize: 10,
    fontFamily: 'Outfit_400Regular',
    color: C.textMuted,
    letterSpacing: 1,
    marginTop: 1,
  },
  profileBtn: { padding: 6 },
  profileEmoji: { fontSize: 20 },
  cartBtn: { padding: 6, position: 'relative' },
  cartEmoji: { fontSize: 24 },
  historyBtn: { padding: 6 },
  historyEmoji: { fontSize: 22 },
  badge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: C.error,
    borderRadius: 9, minWidth: 18, height: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: C.bg,
  },
  badgeText: { color: '#fff', fontSize: 9, fontFamily: 'Outfit_800ExtraBold' },

  // ── Hero (scrolls away naturally) ─────────────────────────────────────────
  heroWrap: {},
  hero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(16,185,129,0.12)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.25)',
    marginBottom: 10,
  },
  heroBadgeText: { color: '#10B981', fontSize: 11, fontFamily: 'Outfit_600SemiBold' },
  heroTitle: {
    fontSize: 26,
    fontFamily: 'Outfit_900Black',
    color: C.text,
    lineHeight: 32,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    fontFamily: 'Outfit_400Regular',
    color: C.textSec,
    marginBottom: 16,
  },
  statsRow: { flexDirection: 'row', gap: 8 },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  statIcon: { fontSize: 12 },
  statLabel: { fontSize: 11, fontFamily: 'Outfit_600SemiBold', color: C.textSec },

  // ── Sticky block (search + categories + count) ────────────────────────────
  stickyBlock: {
    backgroundColor: C.bg,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: C.surfaceHigh,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: { fontSize: 15, marginRight: 8 },
  searchInput: { flex: 1, color: C.text, fontSize: 14, fontFamily: 'Outfit_400Regular' },
  clearSearchBtn: { padding: 4 },
  clearSearchText: { color: C.textMuted, fontSize: 14 },

  catScroll: { flexGrow: 0 },
  catContent: { paddingHorizontal: 16, gap: 6, paddingBottom: 2 },

  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 2,
  },
  resultCount: { fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: C.textSec },
  resultNum: { color: C.accent, fontFamily: 'Outfit_800ExtraBold' },
  resultCat: { color: C.textMuted },
  clearFilterBtn: {
    backgroundColor: 'rgba(245,158,11,0.1)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.2)',
  },
  clearFilterText: { color: C.accent, fontSize: 11, fontFamily: 'Outfit_600SemiBold' },

  // ── List ──────────────────────────────────────────────────────────────────
  listContent: { paddingHorizontal: 10, paddingTop: 10 },
  columnWrapper: { justifyContent: 'flex-start' },

  // ── States ────────────────────────────────────────────────────────────────
  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: C.textSec, marginTop: 14, fontSize: 14, fontFamily: 'Outfit_400Regular' },

  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontFamily: 'Outfit_800ExtraBold', color: C.text, marginBottom: 8 },
  emptySub: { fontSize: 14, fontFamily: 'Outfit_400Regular', color: C.textSec, textAlign: 'center', marginBottom: 24 },
  emptyBtn: { backgroundColor: C.accent, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 28 },
  emptyBtnText: { color: C.bg, fontFamily: 'Outfit_800ExtraBold', fontSize: 14 },
});
