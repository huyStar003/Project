import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  MaterialCommunityIcons,
  Feather,
  Ionicons,
} from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { handleLogin } from '../utils/auth';
import { useResponsive } from '../utils/responsive';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const r = useResponsive();

  const onLogin = async () => {
    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const result = await handleLogin(email, password);

      if (result.success) {
        navigation.replace('Main');
      } else {
        alert(result.message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      alert('Lỗi đăng nhập: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0F172A',
    },
    content: {
      flex: 1,
      paddingHorizontal: r.containerPadding.horizontal,
      justifyContent: 'center',
    },
    gradientBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 300,
      opacity: 0.3,
    },
    glowCircle1: {
      position: 'absolute',
      top: -100,
      right: -50,
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor: '#6366F1',
      opacity: 0.2,
    },
    glowCircle2: {
      position: 'absolute',
      top: 100,
      left: -80,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: '#EC4899',
      opacity: 0.15,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: r.spacing.lg,
    },
    logoIconContainer: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderWidth: 2,
      borderColor: 'rgba(99, 102, 241, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: r.spacing.sm,
    },
    logoImage: {
      width: "100%",
      height: "100%",
      resizeMode: 'contain',
      tintColor: '#6366F1',
    },
    brandTitle: {
      fontSize: r.fontSize.xxl,
      fontWeight: '800',
      color: '#FFFFFF',
      marginBottom: 4,
      textAlign: 'center',
      letterSpacing: -1,
    },
    brandSubtitle: {
      fontSize: r.fontSize.sm,
      color: '#94A3B8',
      textAlign: 'center',
      fontWeight: '500',
    },
    formContainer: {
      backgroundColor: 'rgba(30, 41, 59, 0.6)',
      borderRadius: 20,
      padding: r.spacing.lg,
      borderWidth: 1,
      borderColor: 'rgba(99, 102, 241, 0.2)',
      maxWidth: r.maxWidth.form,
      alignSelf: 'center',
      width: '100%',
    },
    welcomeText: {
      fontSize: r.fontSize.xl,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    subText: {
      fontSize: r.fontSize.sm,
      color: '#94A3B8',
      marginBottom: r.spacing.md,
    },
    inputWrapper: {
      marginBottom: r.spacing.md,
    },
    inputLabel: {
      fontSize: r.fontSize.xs,
      fontWeight: '600',
      color: '#CBD5E1',
      marginBottom: r.spacing.xs,
      marginLeft: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      borderRadius: 12,
      borderWidth: 2,
      paddingHorizontal: r.spacing.sm,
      height: 48,
    },
    inputFocused: {
      borderColor: '#6366F1',
      backgroundColor: 'rgba(99, 102, 241, 0.05)',
    },
    inputUnfocused: {
      borderColor: 'rgba(148, 163, 184, 0.2)',
    },
    inputIconContainer: {
      marginRight: r.spacing.xs,
    },
    textInput: {
      flex: 1,
      fontSize: r.fontSize.sm,
      color: '#FFFFFF',
      outlineStyle: 'none',
    },
    eyeButton: {
      padding: r.spacing.xs,
    },
    loginButton: {
      height: 48,
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: r.spacing.sm,
    },
    loginGradient: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: r.spacing.xs,
    },
    loginButtonText: {
      fontSize: r.fontSize.base,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: r.spacing.md,
    },
    divider: {
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(148, 163, 184, 0.2)',
    },
    dividerText: {
      marginHorizontal: r.spacing.sm,
      fontSize: r.fontSize.xs,
      color: '#64748B',
      fontWeight: '500',
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    signupText: {
      fontSize: r.fontSize.sm,
      color: '#94A3B8',
    },
    signupLink: {
      fontSize: r.fontSize.sm,
      color: '#6366F1',
      fontWeight: '700',
    },
    featureContainer: {
      marginTop: r.spacing.md,
      gap: r.spacing.xs,
    },
    featureItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: r.spacing.xs,
    },
    featureText: {
      fontSize: r.fontSize.xs,
      color: '#94A3B8',
    },
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.gradientBackground} />
      <View style={styles.glowCircle1} />
      <View style={styles.glowCircle2} />
      
      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <View style={styles.logoIconContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.brandTitle}>Product AI</Text>
          <Text style={styles.brandSubtitle}>Quản lý thông minh với AI</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>Chào mừng trở lại</Text>
          <Text style={styles.subText}>Đăng nhập để tiếp tục quản lý</Text>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={[
              styles.inputContainer,
              emailFocused ? styles.inputFocused : styles.inputUnfocused
            ]}>
              <View style={styles.inputIconContainer}>
                <MaterialCommunityIcons 
                  name="email-outline" 
                  size={18} 
                  color={emailFocused ? '#6366F1' : '#64748B'} 
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="your@email.com"
                placeholderTextColor="#475569"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <View style={[
              styles.inputContainer,
              passwordFocused ? styles.inputFocused : styles.inputUnfocused
            ]}>
              <View style={styles.inputIconContainer}>
                <Feather 
                  name="lock" 
                  size={18} 
                  color={passwordFocused ? '#6366F1' : '#64748B'} 
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#475569"
                onChangeText={setPassword}
                value={password}
                secureTextEntry={secureText}
                editable={!loading}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setSecureText(!secureText)}
              >
                <Feather
                  name={secureText ? 'eye-off' : 'eye'}
                  size={16}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.buttonDisabled]}
            onPress={onLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loginGradient}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </Text>
              {!loading && <Ionicons name="arrow-forward" size={16} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featureContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={14} color="#6366F1" />
              <Text style={styles.featureText}>Nhận diện sản phẩm bằng AI</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={14} color="#6366F1" />
              <Text style={styles.featureText}>Thống kê realtime</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={14} color="#6366F1" />
              <Text style={styles.featureText}>Bảo mật cao</Text>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}