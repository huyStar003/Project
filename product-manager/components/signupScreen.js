import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Alert,
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
import { handleSignup } from '../utils/auth';
import { useResponsive } from '../utils/responsive';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureConfirm, setSecureConfirm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('employee');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  
  const r = useResponsive();

  const onSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      const result = await handleSignup(email, password, role);
      if (result.success) {
        Alert.alert('Thành công', 'Tạo tài khoản thành công!', [
          { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') },
        ]);
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra: ' + error.message);
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
      paddingTop: 50,
      paddingBottom: 20,
      justifyContent: 'center',
    },
    glowCircle1: {
      position: 'absolute',
      top: -100,
      right: -50,
      width: 250,
      height: 250,
      borderRadius: 125,
      backgroundColor: '#EC4899',
      opacity: 0.2,
    },
    glowCircle2: {
      position: 'absolute',
      bottom: -80,
      left: -80,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: '#6366F1',
      opacity: 0.15,
    },
    backButton: {
      position: 'absolute',
      top: 50,
      left: r.containerPadding.horizontal,
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: 'rgba(30, 41, 59, 0.6)',
      borderWidth: 1,
      borderColor: 'rgba(148, 163, 184, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: r.spacing.md,
    },
    logoIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      borderWidth: 2,
      borderColor: 'rgba(99, 102, 241, 0.3)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: r.spacing.xs,
    },
    logoImage: {
      width: "100%",
      height: "100%",
      resizeMode: 'contain',
      tintColor: '#6366F1',
    },
    brandTitle: {
      fontSize: r.fontSize.xl,
      fontWeight: '800',
      color: '#FFFFFF',
      marginBottom: 2,
      letterSpacing: -1,
    },
    brandSubtitle: {
      fontSize: r.fontSize.xs,
      color: '#94A3B8',
      textAlign: 'center',
      fontWeight: '500',
    },
    formContainer: {
      backgroundColor: 'rgba(30, 41, 59, 0.6)',
      borderRadius: 20,
      padding: r.spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(236, 72, 153, 0.2)',
      maxWidth: r.maxWidth.form,
      alignSelf: 'center',
      width: '100%',
    },
    inputWrapper: {
      marginBottom: r.spacing.sm,
    },
    inputLabel: {
      fontSize: r.fontSize.xs,
      fontWeight: '600',
      color: '#CBD5E1',
      marginBottom: 4,
      marginLeft: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      borderRadius: 12,
      borderWidth: 2,
      paddingHorizontal: r.spacing.sm,
      height: 44,
    },
    inputFocused: {
      borderColor: '#EC4899',
      backgroundColor: 'rgba(236, 72, 153, 0.05)',
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
      padding: 4,
    },
    roleSelectorContainer: {
      marginVertical: r.spacing.sm,
    },
    roleSelectorLabel: {
      fontSize: r.fontSize.xs,
      fontWeight: '600',
      color: '#CBD5E1',
      marginBottom: r.spacing.xs,
      textAlign: 'center',
    },
    roleSelector: {
      flexDirection: 'row',
      gap: r.spacing.sm,
    },
    roleButton: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: r.spacing.sm,
      borderRadius: 12,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    roleActive: {
      backgroundColor: 'rgba(236, 72, 153, 0.1)',
      borderColor: '#EC4899',
    },
    roleInactive: {
      backgroundColor: 'rgba(15, 23, 42, 0.5)',
      borderColor: 'rgba(148, 163, 184, 0.2)',
    },
    roleContent: {
      alignItems: 'center',
      gap: 4,
    },
    roleTextActive: {
      color: '#EC4899',
      fontWeight: '700',
      fontSize: r.fontSize.sm,
    },
    roleTextInactive: {
      color: '#64748B',
      fontWeight: '600',
      fontSize: r.fontSize.sm,
    },
    roleDescActive: {
      color: '#FDA4AF',
      fontSize: 10,
    },
    roleDescInactive: {
      color: '#475569',
      fontSize: 10,
    },
    signupButton: {
      height: 44,
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: r.spacing.xs,
    },
    signupGradient: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: r.spacing.xs,
    },
    signupButtonText: {
      fontSize: r.fontSize.sm,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: r.spacing.sm,
    },
    loginText: {
      fontSize: r.fontSize.xs,
      color: '#94A3B8',
    },
    loginLink: {
      fontSize: r.fontSize.xs,
      color: '#EC4899',
      fontWeight: '700',
    },
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.glowCircle1} />
      <View style={styles.glowCircle2} />
      
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#CBD5E1" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.headerContainer}>
          <View style={styles.logoIconContainer}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.brandTitle}>Tạo tài khoản</Text>
          <Text style={styles.brandSubtitle}>Bắt đầu hành trình quản lý thông minh</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={[
              styles.inputContainer,
              emailFocused ? styles.inputFocused : styles.inputUnfocused
            ]}>
              <View style={styles.inputIconContainer}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={16}
                  color={emailFocused ? '#EC4899' : '#64748B'}
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
                  size={16} 
                  color={passwordFocused ? '#EC4899' : '#64748B'} 
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Tối thiểu 6 ký tự"
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
                  size={14}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
            <View style={[
              styles.inputContainer,
              confirmFocused ? styles.inputFocused : styles.inputUnfocused
            ]}>
              <View style={styles.inputIconContainer}>
                <Feather 
                  name="check-circle" 
                  size={16} 
                  color={confirmFocused ? '#EC4899' : '#64748B'} 
                />
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#475569"
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                secureTextEntry={secureConfirm}
                editable={!loading}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => setConfirmFocused(false)}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setSecureConfirm(!secureConfirm)}
              >
                <Feather
                  name={secureConfirm ? 'eye-off' : 'eye'}
                  size={14}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.roleSelectorContainer}>
            <Text style={styles.roleSelectorLabel}>Chọn vai trò</Text>
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[styles.roleButton, role === 'admin' ? styles.roleActive : styles.roleInactive]}
                onPress={() => setRole('admin')}
              >
                <View style={styles.roleContent}>
                  <Ionicons 
                    name="shield-checkmark" 
                    size={20} 
                    color={role === 'admin' ? '#EC4899' : '#64748B'} 
                  />
                  <Text style={role === 'admin' ? styles.roleTextActive : styles.roleTextInactive}>
                    Admin
                  </Text>
                  <Text style={role === 'admin' ? styles.roleDescActive : styles.roleDescInactive}>
                    Toàn quyền
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.roleButton, role === 'employee' ? styles.roleActive : styles.roleInactive]}
                onPress={() => setRole('employee')}
              >
                <View style={styles.roleContent}>
                  <Ionicons 
                    name="person" 
                    size={20} 
                    color={role === 'employee' ? '#EC4899' : '#64748B'} 
                  />
                  <Text style={role === 'employee' ? styles.roleTextActive : styles.roleTextInactive}>
                    Nhân viên
                  </Text>
                  <Text style={role === 'employee' ? styles.roleDescActive : styles.roleDescInactive}>
                    Chỉ xem
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.signupButton, loading && styles.buttonDisabled]}
            onPress={onSignup}
            disabled={loading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#EC4899', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signupGradient}
            >
              <Text style={styles.signupButtonText}>
                {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
              </Text>
              {!loading && <Ionicons name="arrow-forward" size={14} color="#fff" />}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}