import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../utils/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import { clearUserSession } from '../utils/auth';
import BottomTabBar from '../components/BottomTabBar';

export default function ProfileScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserInfo({
            uid: user.uid,
            email: user.email,
            ...userDoc.data(),
          });
        }
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearUserSession();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể đăng xuất: ' + error.message);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={['#1E293B', '#0F172A']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Tài khoản</Text>
          <Text style={styles.headerSubtitle}>Quản lý thông tin cá nhân</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* Avatar & Name Section */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['rgba(99, 102, 241, 0.15)', 'rgba(139, 92, 246, 0.05)']}
              style={styles.profileCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  style={styles.avatar}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.avatarText}>
                    {userInfo?.email?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </LinearGradient>
                <View style={styles.roleBadgeProfile}>
                  <Ionicons 
                    name={userInfo?.role === 'admin' ? 'shield-checkmark' : 'person'} 
                    size={14} 
                    color={userInfo?.role === 'admin' ? '#FCD34D' : '#6366F1'} 
                  />
                  <Text style={[
                    styles.roleBadgeText,
                    { color: userInfo?.role === 'admin' ? '#FCD34D' : '#6366F1' }
                  ]}>
                    {userInfo?.role === 'admin' ? 'Admin' : 'Nhân viên'}
                  </Text>
                </View>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>
                  {userInfo?.email?.split('@')[0] || 'User'}
                </Text>
                <Text style={styles.profileEmail}>{userInfo?.email}</Text>
                <Text style={styles.profileId}>ID: {userInfo?.employeeId}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Account Info Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
            
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <View style={styles.infoLeft}>
                  <Ionicons name="mail-outline" size={20} color="#6366F1" />
                  <Text style={styles.infoLabel}>Email</Text>
                </View>
                <Text style={styles.infoValue}>{userInfo?.email}</Text>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoItem}>
                <View style={styles.infoLeft}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#6366F1" />
                  <Text style={styles.infoLabel}>Vai trò</Text>
                </View>
                <Text style={styles.infoValue}>
                  {userInfo?.role === 'admin' ? 'Quản trị viên' : 'Nhân viên'}
                </Text>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoItem}>
                <View style={styles.infoLeft}>
                  <Ionicons name="card-outline" size={20} color="#6366F1" />
                  <Text style={styles.infoLabel}>Mã nhân viên</Text>
                </View>
                <Text style={styles.infoValue}>{userInfo?.employeeId}</Text>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoItem}>
                <View style={styles.infoLeft}>
                  <Ionicons name="calendar-outline" size={20} color="#6366F1" />
                  <Text style={styles.infoLabel}>Ngày tạo</Text>
                </View>
                <Text style={styles.infoValue}>
                  {userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cài đặt</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="notifications-outline" size={20} color="#6366F1" />
                </View>
                <Text style={styles.settingText}>Thông báo</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="lock-closed-outline" size={20} color="#6366F1" />
                </View>
                <Text style={styles.settingText}>Bảo mật</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="help-circle-outline" size={20} color="#6366F1" />
                </View>
                <Text style={styles.settingText}>Trợ giúp</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIcon}>
                  <Ionicons name="information-circle-outline" size={20} color="#6366F1" />
                </View>
                <Text style={styles.settingText}>Về ứng dụng</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoutGradient}
            >
              <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>

      <BottomTabBar navigation={navigation} currentRoute="Profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    fontWeight: '500',
  },
  content: {
    padding: 20,
  },
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  profileCardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 20,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  roleBadgeProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  roleBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.3)',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    maxWidth: '50%',
    textAlign: 'right',
  },
  infoDivider: {
    height: 1,
    backgroundColor: 'rgba(71, 85, 105, 0.3)',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.3)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  logoutButton: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  logoutGradient: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  versionText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94A3B8',
  },
});