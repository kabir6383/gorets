import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { C } from '../constants/colors';
import { useAuth } from '../store/auth';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout, updateName } = useAuth();
  
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [isEditing, setIsEditing] = useState(false);

  // If somehow not logged in, redirect
  if (!user) {
    router.replace('/login');
    return null;
  }

  const handleSaveName = async () => {
    await updateName(nameInput);
    setIsEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={s.root} edges={['top', 'bottom']}>
      <View style={s.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={s.backCircle} 
          activeOpacity={0.7}
        >
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>My Profile</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        
        {/* User Card */}
        <View style={s.card}>
          <View style={s.avatarWrap}>
            <Text style={s.avatarEmoji}>👤</Text>
          </View>
          
          {isEditing ? (
            <View style={s.editRow}>
              <TextInput
                style={s.input}
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Enter your name"
                placeholderTextColor={C.textMuted}
                autoFocus
              />
              <TouchableOpacity style={s.saveBtn} onPress={handleSaveName}>
                <Text style={s.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.nameRow}>
              <Text style={s.nameText}>{user.name || 'Foodie'}</Text>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text style={s.editIcon}>✏️</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={s.phoneText}>+91 {user.phone}</Text>
          <View style={s.badge}>
            <Text style={s.badgeText}>Verified Customer</Text>
          </View>
        </View>

        {/* Quick Links */}
        <Text style={s.sectionTitle}>Dashboard</Text>
        <View style={s.linkGroup}>
          <TouchableOpacity 
            style={s.linkRow} 
            onPress={() => router.push('/cart')}
            activeOpacity={0.7}
          >
            <View style={s.linkIconWrap}><Text>📜</Text></View>
            <Text style={s.linkText}>My Orders</Text>
            <Text style={s.linkArrow}>→</Text>
          </TouchableOpacity>
          <View style={s.divider} />
          <TouchableOpacity 
            style={s.linkRow} 
            activeOpacity={0.7}
          >
            <View style={s.linkIconWrap}><Text>📍</Text></View>
            <Text style={s.linkText}>Saved Addresses</Text>
            <Text style={s.linkArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout} style={s.logoutBtn} activeOpacity={0.8}>
          <Text style={s.logoutText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { color: C.text, fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
  backCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: C.surfaceHigh, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  backArrow: { fontSize: 18, color: C.text },

  scroll: { flex: 1 },
  content: { padding: 16 },

  card: {
    backgroundColor: C.surface, borderRadius: 20, padding: 24,
    alignItems: 'center', borderWidth: 1, borderColor: C.border,
    marginBottom: 24,
  },
  avatarWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(245,158,11,0.1)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(245,158,11,0.3)',
    marginBottom: 16,
  },
  avatarEmoji: { fontSize: 40 },
  
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  nameText: { color: C.text, fontSize: 22, fontFamily: 'Outfit_900Black' },
  editIcon: { fontSize: 16 },
  
  editRow: { flexDirection: 'row', gap: 8, marginBottom: 8, width: '100%' },
  input: {
    flex: 1, backgroundColor: C.surfaceHigh, color: C.text,
    fontFamily: 'Outfit_600SemiBold', fontSize: 16,
    borderRadius: 12, paddingHorizontal: 16, height: 48,
    borderWidth: 1, borderColor: C.border,
  },
  saveBtn: {
    backgroundColor: C.accent, borderRadius: 12,
    paddingHorizontal: 20, justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontFamily: 'Outfit_800ExtraBold' },

  phoneText: { color: C.textSec, fontSize: 15, fontFamily: 'Outfit_500Medium', marginBottom: 16 },
  badge: { backgroundColor: 'rgba(16,185,129,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)' },
  badgeText: { color: C.success, fontSize: 11, fontFamily: 'Outfit_700Bold', textTransform: 'uppercase' },

  sectionTitle: { color: C.textSec, fontSize: 12, fontFamily: 'Outfit_700Bold', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10, marginLeft: 4 },
  linkGroup: { backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 32 },
  linkRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  linkIconWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.surfaceHigh, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  linkText: { flex: 1, color: C.text, fontSize: 15, fontFamily: 'Outfit_600SemiBold' },
  linkArrow: { color: C.textMuted, fontSize: 18 },
  divider: { height: 1, backgroundColor: C.border, marginLeft: 60 },

  logoutBtn: { backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 16, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  logoutText: { color: C.error, fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
});
