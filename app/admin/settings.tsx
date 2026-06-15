import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { C } from '../../constants/colors';
import { useAuth } from '../../store/auth';
import { db } from '../../utils/firebase';
import { ref, get, update } from 'firebase/database';

export default function AdminSettings() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [openTime, setOpenTime] = useState('09:00 AM');
  const [closeTime, setCloseTime] = useState('11:00 PM');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'admin') { router.replace('/login'); return; }
    get(ref(db, 'settings/store')).then(snap => {
      if (snap.exists()) {
        const d = snap.val();
        setIsOpen(d.isOpen ?? true);
        setOpenTime(d.openTime || '09:00 AM');
        setCloseTime(d.closeTime || '11:00 PM');
        setNotice(d.notice || '');
      }
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSaving(true);
    try {
      await update(ref(db, 'settings/store'), { isOpen, openTime, closeTime, notice, updatedAt: Date.now() });
      alert('Settings saved!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <SafeAreaView style={[s.root, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={C.accent} />
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Store Settings</Text>
        <TouchableOpacity onPress={async () => { await logout(); router.replace('/login'); }} style={s.logoutBtn}>
          <Text style={s.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Store Open/Closed */}
        <View style={s.card}>
          <View style={s.cardHead}>
            <Text style={s.cardIcon}>🏪</Text>
            <Text style={s.cardTitle}>Store Status</Text>
          </View>
          <View style={s.row}>
            <View>
              <Text style={s.label}>Accepting Orders</Text>
              <Text style={s.hint}>{isOpen ? 'Customers can order now' : 'Store is closed'}</Text>
            </View>
            <Switch
              value={isOpen}
              onValueChange={setIsOpen}
              trackColor={{ false: C.border, true: 'rgba(16,185,129,0.4)' }}
              thumbColor={isOpen ? C.success : '#ccc'}
            />
          </View>
        </View>

        {/* Hours */}
        <View style={s.card}>
          <View style={s.cardHead}>
            <Text style={s.cardIcon}>⏰</Text>
            <Text style={s.cardTitle}>Operating Hours</Text>
          </View>
          <Text style={s.label}>Opening Time</Text>
          <TextInput style={s.input} value={openTime} onChangeText={setOpenTime} placeholder="e.g. 09:00 AM" placeholderTextColor={C.textMuted} />
          <Text style={s.label}>Closing Time</Text>
          <TextInput style={s.input} value={closeTime} onChangeText={setCloseTime} placeholder="e.g. 11:00 PM" placeholderTextColor={C.textMuted} />
        </View>

        {/* Notice */}
        <View style={s.card}>
          <View style={s.cardHead}>
            <Text style={s.cardIcon}>📢</Text>
            <Text style={s.cardTitle}>Announcement Banner</Text>
          </View>
          <Text style={s.label}>Notice Text (Optional)</Text>
          <TextInput
            style={[s.input, { minHeight: 90, textAlignVertical: 'top' }]}
            value={notice}
            onChangeText={setNotice}
            placeholder="e.g. Closed on Sunday for maintenance."
            placeholderTextColor={C.textMuted}
            multiline
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={s.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
          <LinearGradient colors={[C.accent, C.accentDark]} style={s.saveGrad}>
            <Text style={s.saveText}>{saving ? 'Saving...' : 'Save Settings'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontSize: 22, fontFamily: 'Outfit_800ExtraBold', color: C.text },
  logoutBtn: { padding: 8, backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 8, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  logoutText: { color: C.error, fontFamily: 'Outfit_700Bold', fontSize: 12 },
  content: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: C.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 16 },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardIcon: { fontSize: 20 },
  cardTitle: { color: C.text, fontSize: 15, fontFamily: 'Outfit_800ExtraBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { color: C.text, fontSize: 13, fontFamily: 'Outfit_700Bold', marginBottom: 6, marginTop: 4 },
  hint: { color: C.textMuted, fontSize: 12, fontFamily: 'Outfit_400Regular' },
  input: { backgroundColor: C.surfaceHigh, color: C.text, fontSize: 14, fontFamily: 'Outfit_500Medium', borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },
  saveBtn: { borderRadius: 16, overflow: 'hidden' },
  saveGrad: { paddingVertical: 18, alignItems: 'center' },
  saveText: { color: '#fff', fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
});
