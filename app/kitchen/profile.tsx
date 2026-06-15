import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C } from '../../constants/colors';
import { useAuth } from '../../store/auth';

export default function KitchenProfile() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Profile</Text>
      </View>

      <View style={s.content}>
        <View style={s.avatarWrap}>
          <Text style={s.avatarEmoji}>👨‍🍳</Text>
        </View>
        <Text style={s.name}>{user?.name || 'Kitchen Staff'}</Text>
        <View style={s.roleBadge}>
          <Text style={s.roleText}>KITCHEN STAFF</Text>
        </View>

        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Role</Text>
            <Text style={s.infoValue}>Kitchen Staff</Text>
          </View>
          <View style={s.divider} />
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Access</Text>
            <Text style={s.infoValue}>Order Management</Text>
          </View>
          <View style={s.divider} />
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Status</Text>
            <Text style={[s.infoValue, { color: C.success }]}>● Active</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleLogout} style={s.logoutBtn} activeOpacity={0.8}>
          <Text style={s.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { fontSize: 22, fontFamily: 'Outfit_800ExtraBold', color: C.text },
  content: { flex: 1, padding: 24, alignItems: 'center' },
  avatarWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(16,185,129,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(16,185,129,0.3)',
    marginTop: 30, marginBottom: 16,
  },
  avatarEmoji: { fontSize: 48 },
  name: { color: C.text, fontSize: 24, fontFamily: 'Outfit_800ExtraBold', marginBottom: 10 },
  roleBadge: { backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)', marginBottom: 32 },
  roleText: { color: C.success, fontSize: 11, fontFamily: 'Outfit_800ExtraBold', letterSpacing: 1 },
  infoCard: { width: '100%', backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 32 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  divider: { height: 1, backgroundColor: C.border },
  infoLabel: { color: C.textSec, fontSize: 14, fontFamily: 'Outfit_600SemiBold' },
  infoValue: { color: C.text, fontSize: 14, fontFamily: 'Outfit_700Bold' },
  logoutBtn: { width: '100%', backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  logoutText: { color: C.error, fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
});
