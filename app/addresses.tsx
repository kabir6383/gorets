import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { C } from '../constants/colors';
import { useAuth } from '../store/auth';

export default function AddressesScreen() {
  const router = useRouter();
  const { user, addAddress, removeAddress } = useAuth();
  
  const [showAdd, setShowAdd] = useState(false);
  const [type, setType] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [landmark, setLandmark] = useState('');

  const handleSave = async () => {
    if (!line1.trim()) return alert('Address Line 1 is required');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addAddress({ type, line1, line2, landmark });
    setShowAdd(false);
    setLine1(''); setLine2(''); setLandmark('');
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Addresses</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        
        {user?.addresses?.map((addr) => (
          <View key={addr.id} style={s.addressCard}>
            <View style={s.addrHeader}>
              <View style={s.addrTypeBadge}>
                <Text style={s.addrTypeIcon}>{addr.type === 'Home' ? '🏠' : addr.type === 'Work' ? '🏢' : '📍'}</Text>
                <Text style={s.addrTypeText}>{addr.type}</Text>
              </View>
              <TouchableOpacity onPress={() => removeAddress(addr.id)}>
                <Text style={s.deleteBtn}>🗑️</Text>
              </TouchableOpacity>
            </View>
            <Text style={s.addrLine}>{addr.line1}</Text>
            {!!addr.line2 && <Text style={s.addrSub}>{addr.line2}</Text>}
            {!!addr.landmark && <Text style={s.addrSub}>Landmark: {addr.landmark}</Text>}
          </View>
        ))}

        {(!user?.addresses || user.addresses.length === 0) && !showAdd && (
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>📍</Text>
            <Text style={s.emptyTitle}>No saved addresses</Text>
            <Text style={s.emptySub}>Add an address for faster checkout</Text>
          </View>
        )}

        {!showAdd ? (
          <TouchableOpacity style={s.addBtn} onPress={() => setShowAdd(true)}>
            <LinearGradient colors={[C.accent, C.accentDark]} style={s.addGrad}>
              <Text style={s.addBtnText}>+ Add New Address</Text>
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <View style={s.addForm}>
            <Text style={s.formTitle}>Add New Address</Text>
            
            <View style={s.typeRow}>
              {['Home', 'Work', 'Other'].map((t) => (
                <TouchableOpacity 
                  key={t}
                  style={[s.typeChip, type === t && s.typeChipActive]}
                  onPress={() => setType(t as any)}
                >
                  <Text style={[s.typeText, type === t && s.typeTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={s.input}
              placeholder="House/Flat No, Building Name *"
              placeholderTextColor={C.textMuted}
              value={line1}
              onChangeText={setLine1}
            />
            <TextInput
              style={s.input}
              placeholder="Street, Area, Sector"
              placeholderTextColor={C.textMuted}
              value={line2}
              onChangeText={setLine2}
            />
            <TextInput
              style={s.input}
              placeholder="Nearby Landmark (Optional)"
              placeholderTextColor={C.textMuted}
              value={landmark}
              onChangeText={setLandmark}
            />

            <View style={s.formActions}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowAdd(false)}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
                <Text style={s.saveText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.surfaceHigh, alignItems: 'center', justifyContent: 'center' },
  backArrow: { fontSize: 18, color: C.text },
  headerTitle: { fontSize: 18, fontFamily: 'Outfit_800ExtraBold', color: C.text },

  content: { padding: 20 },

  addressCard: { backgroundColor: C.surfaceHigh, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: C.border },
  addrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  addrTypeBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(245,158,11,0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  addrTypeIcon: { fontSize: 12 },
  addrTypeText: { color: C.accent, fontFamily: 'Outfit_800ExtraBold', fontSize: 12, textTransform: 'uppercase' },
  deleteBtn: { fontSize: 16 },
  addrLine: { color: C.text, fontSize: 15, fontFamily: 'Outfit_600SemiBold', marginBottom: 4 },
  addrSub: { color: C.textSec, fontSize: 13, fontFamily: 'Outfit_400Regular' },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { color: C.text, fontSize: 18, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 },
  emptySub: { color: C.textMuted, fontSize: 14, fontFamily: 'Outfit_400Regular' },

  addBtn: { borderRadius: 16, overflow: 'hidden', marginTop: 8 },
  addGrad: { paddingVertical: 18, alignItems: 'center' },
  addBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },

  addForm: { backgroundColor: C.surfaceHigh, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border },
  formTitle: { color: C.text, fontSize: 18, fontFamily: 'Outfit_800ExtraBold', marginBottom: 16 },
  
  typeRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  typeChip: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface },
  typeChipActive: { backgroundColor: 'rgba(245,158,11,0.1)', borderColor: C.accent },
  typeText: { color: C.textSec, fontFamily: 'Outfit_600SemiBold', fontSize: 14 },
  typeTextActive: { color: C.accent, fontFamily: 'Outfit_800ExtraBold' },

  input: { backgroundColor: C.surface, color: C.text, fontSize: 15, fontFamily: 'Outfit_500Medium', borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 12 },

  formActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelBtn: { flex: 1, paddingVertical: 16, alignItems: 'center', borderRadius: 12, backgroundColor: C.surface },
  cancelText: { color: C.textSec, fontFamily: 'Outfit_700Bold', fontSize: 15 },
  saveBtn: { flex: 1, paddingVertical: 16, alignItems: 'center', borderRadius: 12, backgroundColor: C.accent },
  saveText: { color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 15 },
});
