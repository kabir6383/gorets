import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Switch, SectionList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { C } from '../../constants/colors';
import { useAuth } from '../../store/auth';
import { db } from '../../utils/firebase';
import { ref, onValue, update } from 'firebase/database';

export default function AdminMenu() {
  const router = useRouter();
  const { user } = useAuth();
  const [sections, setSections] = useState<{ title: string; data: any[] }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.replace('/login'); return; }

    // Listen to menu in real-time so toggles reflect instantly
    const unsub = onValue(ref(db, 'menu'), (snap) => {
      if (snap.exists()) {
        const val = snap.val();
        const firstVal = Object.values(val)[0];
        const isNested = firstVal && typeof firstVal === 'object' && !('name' in firstVal);

        const built: { title: string; data: any[] }[] = [];

        if (isNested) {
          // Nested: { category: { id: { name, price, available, ... } } }
          Object.keys(val).sort().forEach(cat => {
            const items = Object.keys(val[cat]).map(id => ({
              id,
              category: cat,
              ...val[cat][id],
            }));
            built.push({ title: cat, data: items });
          });
        } else {
          // Flat: { id: { name, price, category, available, ... } }
          const byCategory: Record<string, any[]> = {};
          Object.keys(val).forEach(id => {
            const item = { id, ...val[id] };
            const cat = item.category || 'Uncategorized';
            if (!byCategory[cat]) byCategory[cat] = [];
            byCategory[cat].push(item);
          });
          Object.keys(byCategory).sort().forEach(cat => {
            built.push({ title: cat, data: byCategory[cat] });
          });
        }

        setSections(built);
      } else {
        setSections([]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  const toggleAvailability = async (item: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newVal = item.available === false ? true : false; // toggle
    try {
      // Determine path: nested or flat
      const path = `menu/${item.category}/${item.id}`;
      await update(ref(db, path), { available: newVal });
    } catch (err: any) {
      // Try flat path as fallback
      try {
        await update(ref(db, `menu/${item.id}`), { available: newVal });
      } catch (e2: any) {
        console.error('Toggle failed:', e2.message);
      }
    }
  };

  if (loading) return (
    <SafeAreaView style={[s.root, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={C.accent} />
    </SafeAreaView>
  );

  const totalItems = sections.reduce((acc, sec) => acc + sec.data.length, 0);
  const unavailableCount = sections.reduce((acc, sec) => acc + sec.data.filter((i: any) => i.available === false).length, 0);

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Menu Management</Text>
          <Text style={s.headerSub}>{totalItems} items · {unavailableCount} unavailable</Text>
        </View>
      </View>

      {sections.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>🍽️</Text>
          <Text style={s.emptyText}>No menu items in database yet.</Text>
          <Text style={s.emptyHint}>Items will appear here once menu data is loaded to Firebase.</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
          renderSectionHeader={({ section }) => (
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{section.title}</Text>
              <Text style={s.sectionCount}>{section.data.length} items</Text>
            </View>
          )}
          renderItem={({ item }) => {
            const isAvailable = item.available !== false;
            return (
              <View style={[s.card, !isAvailable && s.cardUnavailable]}>
                <View style={s.cardRow}>
                  <View style={s.itemInfo}>
                    <Text style={s.itemName}>{item.name}</Text>
                    <Text style={s.itemPrice}>₹{item.price}</Text>
                  </View>
                  <View style={s.switchWrap}>
                    <Text style={[s.statusLabel, { color: isAvailable ? C.success : C.error }]}>
                      {isAvailable ? 'Available' : 'Unavailable'}
                    </Text>
                    <Switch
                      value={isAvailable}
                      onValueChange={() => toggleAvailability(item)}
                      trackColor={{ false: 'rgba(239,68,68,0.3)', true: 'rgba(16,185,129,0.4)' }}
                      thumbColor={isAvailable ? C.success : '#EF4444'}
                    />
                  </View>
                </View>
                {!isAvailable && (
                  <Text style={s.unavailableNote}>🚫 Customers cannot add this item to cart</Text>
                )}
              </View>
            );
          }}
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
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 50, marginBottom: 12 },
  emptyText: { color: C.text, fontFamily: 'Outfit_700Bold', fontSize: 16, marginBottom: 6, textAlign: 'center' },
  emptyHint: { color: C.textSec, fontFamily: 'Outfit_400Regular', fontSize: 13, textAlign: 'center' },
  list: { paddingBottom: 40 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: C.surfaceHigh, paddingHorizontal: 16, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  sectionTitle: { color: C.text, fontFamily: 'Outfit_800ExtraBold', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, flex: 1 },
  sectionCount: { color: C.textMuted, fontFamily: 'Outfit_600SemiBold', fontSize: 12 },
  card: { backgroundColor: C.surface, padding: 14, marginHorizontal: 12, marginTop: 8, borderRadius: 12, borderWidth: 1, borderColor: C.border },
  cardUnavailable: { borderColor: 'rgba(239,68,68,0.3)', backgroundColor: 'rgba(239,68,68,0.04)' },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemInfo: { flex: 1, marginRight: 12 },
  itemName: { color: C.text, fontSize: 14, fontFamily: 'Outfit_700Bold', marginBottom: 2 },
  itemPrice: { color: C.accent, fontSize: 13, fontFamily: 'Outfit_800ExtraBold' },
  switchWrap: { alignItems: 'center', gap: 4 },
  statusLabel: { fontSize: 10, fontFamily: 'Outfit_700Bold' },
  unavailableNote: { color: C.error, fontSize: 11, fontFamily: 'Outfit_600SemiBold', marginTop: 8, opacity: 0.8 },
});
