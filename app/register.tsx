import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { C } from '../constants/colors';
import { useAuth } from '../store/auth';
import { auth, firebaseConfig, db } from '../utils/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!name.trim() || phone.length < 10) return alert('Enter a valid name and phone number');
    if (!username.trim() || password.length < 6) return alert('Enter a username and a 6+ char password');
    if (password !== confirmPassword) return alert('Passwords do not match');
    setLoading(true);
    
    try {
      const email = `${username.toLowerCase().trim()}@gorets.app`;
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      
      await set(ref(db, 'users/' + userCred.user.uid), {
        name: name.trim(),
        phone: phone.trim(),
        username: username.toLowerCase().trim(),
        role: 'customer'
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      alert('Registration successful! Please log in.');
      router.replace('/login');
    } catch (err: any) {
      console.error(err);
      alert(`Registration Error: ${err.message}`);
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
            onPress={() => router.replace('/login')} 
            style={s.backCircle} 
            activeOpacity={0.7}
          >
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={s.content} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={s.hero}>
            <Text style={s.logo}>GORET'S</Text>
            <Text style={s.title}>Create an account</Text>
            <Text style={s.subtitle}>Enter your details to get started.</Text>
          </View>

          <View>
            <View style={s.inputContainer}>
              <TextInput
                style={s.inputFull}
                placeholder="Your Full Name"
                placeholderTextColor={C.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
            <View style={s.phoneRow}>
              <View style={s.phonePrefix}>
                <Text style={s.prefixText}>+91</Text>
              </View>
              <TextInput
                style={s.input}
                placeholder="Mobile Number"
                placeholderTextColor={C.textMuted}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={s.inputContainer}>
              <TextInput
                style={s.inputFull}
                placeholder="Username (e.g. john123)"
                placeholderTextColor={C.textMuted}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
            <View style={s.inputContainer}>
              <TextInput
                style={s.inputWithIcon}
                placeholder="Create Password"
                placeholderTextColor={C.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity style={s.eyeBtn} onPress={() => setShowPassword(v => !v)}>
                <Text style={s.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
            <View style={s.inputContainer}>
              <TextInput
                style={s.inputWithIcon}
                placeholder="Confirm Password"
                placeholderTextColor={C.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity style={s.eyeBtn} onPress={() => setShowConfirmPassword(v => !v)}>
                <Text style={s.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>

        <View style={s.footer}>
          <TouchableOpacity 
            style={[s.btn, (!name.trim() || phone.length < 10 || !username.trim() || password.length < 6 || password !== confirmPassword) && s.btnDisabled]} 
            onPress={handleCreateAccount}
            disabled={!name.trim() || phone.length < 10 || !username.trim() || password.length < 6 || password !== confirmPassword || loading}
            activeOpacity={0.8}
          >
            <LinearGradient colors={(!name.trim() || phone.length < 10 || !username.trim() || password.length < 6 || password !== confirmPassword) ? [C.surfaceHigh, C.surfaceHigh] : [C.accent, C.accentDark]} style={s.btnGrad}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Complete Registration</Text>}
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
  
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 10 },
  hero: { marginBottom: 30 },
  logo: { color: C.accent, fontSize: 14, fontFamily: 'Outfit_900Black', letterSpacing: 2, marginBottom: 12 },
  title: { color: C.text, fontSize: 28, fontFamily: 'Outfit_800ExtraBold', marginBottom: 8 },
  subtitle: { color: C.textSec, fontSize: 15, fontFamily: 'Outfit_400Regular', lineHeight: 22 },

  inputContainer: { position: 'relative', marginBottom: 16 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  phonePrefix: {
    backgroundColor: C.surfaceHigh,
    height: 54, paddingHorizontal: 16,
    justifyContent: 'center',
    borderTopLeftRadius: 14, borderBottomLeftRadius: 14,
    borderWidth: 1, borderRightWidth: 0, borderColor: C.border,
  },
  prefixText: { color: C.textSec, fontFamily: 'Outfit_700Bold', fontSize: 16 },
  input: {
    flex: 1, height: 54,
    backgroundColor: C.surfaceHigh,
    color: C.text, fontSize: 18, fontFamily: 'Outfit_600SemiBold',
    borderTopRightRadius: 14, borderBottomRightRadius: 14,
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 16,
  },
  inputFull: {
    width: '100%', height: 54,
    backgroundColor: C.surfaceHigh,
    color: C.text, fontSize: 16, fontFamily: 'Outfit_600SemiBold',
    borderRadius: 14,
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: 16,
  },
  inputWithIcon: {
    width: '100%', height: 54,
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
  
  footer: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  btn: { borderRadius: 16, overflow: 'hidden' },
  btnDisabled: { opacity: 0.6 },
  btnGrad: { paddingVertical: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
});
