import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { C } from '../constants/colors';
import { useAuth } from '../store/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = () => {
    if (phone.length < 10) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);
    // Simulate network delay for sending OTP
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 4) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);
    // Simulate network delay for verification
    setTimeout(async () => {
      await login(phone);
      setLoading(false);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    }, 1200);
  };

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity 
            onPress={() => step === 'otp' ? setStep('phone') : router.back()} 
            style={s.backCircle} 
            activeOpacity={0.7}
          >
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={s.content}>
          <View style={s.hero}>
            <Text style={s.logo}>GORET'S</Text>
            <Text style={s.title}>{step === 'phone' ? "Let's get started" : "Verify details"}</Text>
            <Text style={s.subtitle}>
              {step === 'phone' 
                ? "Enter your mobile number to log in or create an account." 
                : `We've sent a code to ${phone}. Enter it below.`}
            </Text>
          </View>

          {step === 'phone' ? (
            <View style={s.inputContainer}>
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
                autoFocus
              />
            </View>
          ) : (
            <View style={s.inputContainer}>
              <TextInput
                style={[s.input, { textAlign: 'center', fontSize: 24, letterSpacing: 8 }]}
                placeholder="------"
                placeholderTextColor={C.textMuted}
                keyboardType="number-pad"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
                autoFocus
              />
            </View>
          )}

          {step === 'otp' && (
            <Text style={s.resendText}>Didn't receive code? <Text style={s.resendLink}>Resend</Text></Text>
          )}

        </View>

        <View style={s.footer}>
          {step === 'phone' ? (
            <TouchableOpacity 
              style={[s.btn, phone.length < 10 && s.btnDisabled]} 
              onPress={handleSendOtp}
              disabled={phone.length < 10 || loading}
              activeOpacity={0.8}
            >
              <LinearGradient colors={phone.length < 10 ? [C.surfaceHigh, C.surfaceHigh] : [C.accent, C.accentDark]} style={s.btnGrad}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Continue</Text>}
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[s.btn, otp.length < 4 && s.btnDisabled]} 
              onPress={handleVerifyOtp}
              disabled={otp.length < 4 || loading}
              activeOpacity={0.8}
            >
              <LinearGradient colors={otp.length < 4 ? [C.surfaceHigh, C.surfaceHigh] : [C.accent, C.accentDark]} style={s.btnGrad}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.btnText}>Verify and Login</Text>}
              </LinearGradient>
            </TouchableOpacity>
          )}
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

  inputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
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
  
  resendText: { color: C.textMuted, textAlign: 'center', fontFamily: 'Outfit_400Regular', fontSize: 14 },
  resendLink: { color: C.accent, fontFamily: 'Outfit_700Bold' },

  footer: { padding: 20, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  btn: { borderRadius: 16, overflow: 'hidden' },
  btnDisabled: { opacity: 0.6 },
  btnGrad: { paddingVertical: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontFamily: 'Outfit_800ExtraBold' },
});
