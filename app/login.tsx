import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { C } from '../constants/colors';
import { useAuth } from '../store/auth';
import { auth, db } from '../utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      const email = username.includes('@') ? username.trim().toLowerCase() : `${username.trim().toLowerCase()}@gorets.app`;
      
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      
      const snap = await get(ref(db, 'users/' + userCred.user.uid));
      if (snap.exists()) {
        const profile = snap.val();
        await login(profile.phone || 'no_phone', profile.name || username.trim(), profile.role || 'customer');
        if (profile.role === 'admin') router.replace('/admin' as any);
        else if (profile.role === 'kitchen') router.replace('/kitchen' as any);
        else if (profile.role === 'driver') router.replace('/driver' as any);
        else router.replace('/');
      } else {
        // Handle Role-based routing fallback if no RTDB profile exists
        if (email === 'gorets@admin.com') {
          await login('admin_phone', 'Store Admin', 'admin');
          router.replace('/admin' as any);
        } else if (email === 'kitchen@gorets.com') {
          await login('kitchen_phone', 'Kitchen Staff', 'kitchen');
          router.replace('/kitchen' as any);
        } else if (email === 'driver@gorets.com') {
          await login('driver_phone', 'Delivery Driver', 'driver');
          router.replace('/driver' as any);
        } else {
          await login('customer_phone', username.trim(), 'customer');
          router.replace('/');
        }
      }
      
    } catch (err: any) {
      console.error(err);
      alert(`Login Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity 
            onPress={() => router.replace('/')} 
            style={s.backCircle} 
            activeOpacity={0.7}
          >
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={s.content}>
          <View style={s.hero}>
            <Text style={s.logo}>GORET'S</Text>
            <Text style={s.title}>Welcome back</Text>
            <Text style={s.subtitle}>Log in with your username and password.</Text>
          </View>

          <View style={s.inputContainer}>
            <TextInput
              style={s.inputFull}
              placeholder="Username or Email"
              placeholderTextColor={C.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={s.inputContainer}>
            <TextInput
              style={s.inputWithIcon}
              placeholder="Password"
              placeholderTextColor={C.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPassword(v => !v)}>
              <Text style={s.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push('/register')} style={s.registerLink}>
            <Text style={s.registerText}>Don't have an account? <Text style={s.registerHighlight}>Register here</Text></Text>
          </TouchableOpacity>
        </View>

        <View style={s.footer}>
          <TouchableOpacity 
            style={[s.btn, (!username.trim() || !password) && s.btnDisabled]} 
            onPress={handleLogin}
            disabled={!username.trim() || !password || loading}
            activeOpacity={0.8}
          >
            <LinearGradient colors={!username.trim() || !password ? [C.surfaceHigh, C.surfaceHigh] : [C.accent, C.accentDark]} style={s.btnGrad}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Log In</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { padding: 16 },
  backCircle: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: C.surfaceHigh,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: C.border,
  },
  backArrow: { fontSize: 18, color: C.text },
  
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20 },
  hero: { marginBottom: 40 },
  logo: { color: C.accent, fontSize: 14, fontFamily: 'Outfit_900Black', letterSpacing: 2, marginBottom: 12 },
  title: { color: C.text, fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 },
  subtitle: { color: C.textSec, fontSize: 15, fontFamily: 'Outfit_400Regular', lineHeight: 22 },

  inputContainer: { marginBottom: 16, position: 'relative' },
  inputFull: {
    width: '100%', height: 56,
    backgroundColor: C.surfaceHigh,
    color: C.text, fontSize: 16, fontFamily: 'Outfit_600SemiBold',
    borderRadius: 14,
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 16,
  },
  inputWithIcon: {
    width: '100%', height: 56,
    backgroundColor: C.surfaceHigh,
    color: C.text, fontSize: 16, fontFamily: 'Outfit_600SemiBold',
    borderRadius: 14,
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 16,
    paddingRight: 52,
  },
  eyeBtn: {
    position: 'absolute', right: 14, top: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', width: 36,
  },
  eyeIcon: { fontSize: 18 },
  
  registerLink: { marginTop: 8, paddingVertical: 10, alignItems: 'center' },
  registerText: { color: C.textSec, fontFamily: 'Outfit_500Medium', fontSize: 14 },
  registerHighlight: { color: C.accent, fontFamily: 'Outfit_800ExtraBold' },

  footer: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  btn: { borderRadius: 16, overflow: 'hidden' },
  btnDisabled: { opacity: 0.6 },
  btnGrad: { paddingVertical: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
});
