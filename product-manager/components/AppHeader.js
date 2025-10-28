// components/AppHeader.js
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AppHeader({
  title = 'Smart Shelf AI',
  subtitle = 'Dashboard Quản Lý',
  userName = 'User',
  role = 'employee',        // 'admin' | 'employee'
  onProfilePress,
  onLogoutPress,
}) {
  const roleText = role === 'admin' ? 'Quản trị viên' : 'Nhân viên';
  const roleColor = role === 'admin' ? '#0ea5e9' : '#64748B';

  return (
    <View style={styles.container}>
      {/* Left: App brand */}
      <View style={styles.left}>
        <View style={styles.logoWrap}>
          <Image
            source={require('../assets/icon.png')} // đổi nếu bạn có logo riêng
            style={styles.logo}
          />
        </View>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      {/* Right: user chip + logout */}
      <View style={styles.right}>
        <TouchableOpacity style={styles.userChip} onPress={onProfilePress}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={16} color="#2563eb" />
          </View>
          <View style={styles.userTexts}>
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
            <Text style={[styles.role, { color: roleColor }]} numberOfLines={1}>
              {roleText}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logout} onPress={onLogoutPress} accessibilityLabel="Đăng xuất">
          <Ionicons name="log-out-outline" size={18} color="#0f172a" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoWrap: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#e0e7ff',
    alignItems: 'center', justifyContent: 'center',
  },
  logo: { width: 20, height: 20, resizeMode: 'contain', tintColor: '#2563eb' },
  title: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#6b7280', marginTop: 2 },

  right: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  userChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderWidth: 1, borderColor: '#dbeafe',
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 999,
    maxWidth: 220,
  },
  avatar: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#dbeafe',
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
  },
  userTexts: { maxWidth: 180 },
  userName: { fontSize: 13, fontWeight: '600', color: '#0f172a' },
  role: { fontSize: 11 },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e2e8f0',
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 8,
  },
  logoutText: { marginLeft: 6, fontSize: 12, color: '#0f172a', fontWeight: '600' },
});
