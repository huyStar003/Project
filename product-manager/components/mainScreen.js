import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../utils/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

const { width } = Dimensions.get('window');

export default function MainScreen() {
  const [latestData, setLatestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState('employee');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    checkUserInfo();
    
    const q = query(
      collection(db, 'product_counts'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        setLatestData({
          id: doc.id,
          ...doc.data(),
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkUserInfo = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserRole(data.role || 'employee');
        setUserName(data.email?.split('@')[0] || 'User');
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const calculateTotal = (products) => {
    if (!products) return 0;
    return Object.values(products).reduce((sum, qty) => sum + qty, 0);
  };

  const getProductCount = (products) => {
    if (!products) return 0;
    return Object.keys(products).length;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  const totalProducts = calculateTotal(latestData?.products);
  const productTypes = getProductCount(latestData?.products);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#6366F1"
        />
      }
    >
      <LinearGradient
        colors={['#1E293B', '#0F172A']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greetingText}>Xin chào, {userName}!</Text>
            <View style={styles.roleBadge}>
              <Ionicons 
                name={userRole === 'admin' ? 'shield-checkmark' : 'person'} 
                size={12} 
                color={userRole === 'admin' ? '#FCD34D' : '#6366F1'} 
              />
              <Text style={[
                styles.roleText,
                { color: userRole === 'admin' ? '#FCD34D' : '#6366F1' }
              ]}>
                {userRole === 'admin' ? 'Admin' : 'Nhân viên'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#CBD5E1" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statsRow}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIconContainer}>
                <Ionicons name="cube" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{totalProducts}</Text>
              <Text style={styles.statLabel}>Tổng sản phẩm</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#EC4899', '#F472B6']}
              style={styles.statCard}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.statIconContainer}>
                <Ionicons name="albums" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.statValue}>{productTypes}</Text>
              <Text style={styles.statLabel}>Loại sản phẩm</Text>
            </LinearGradient>
          </View>

          <LinearGradient
            colors={['#10B981', '#34D399']}
            style={styles.statCardWide}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.statCardWideContent}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time" size={24} color="#FFFFFF" />
              </View>
              <View style={styles.statCardWideText}>
                <Text style={styles.statLabel}>Cập nhật lần cuối</Text>
                <Text style={styles.statValueSmall}>
                  {latestData?.timestamp || 'Không có dữ liệu'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chi tiết sản phẩm</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {latestData?.products && Object.keys(latestData.products).length > 0 ? (
          <View style={styles.productList}>
            {Object.entries(latestData.products).map(([name, qty], index) => (
              <View key={name} style={styles.productCard}>
                <LinearGradient
                  colors={['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.05)']}
                  style={styles.productCardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.productIconContainer}>
                    <MaterialCommunityIcons 
                      name={getProductIcon(index)} 
                      size={28} 
                      color="#6366F1" 
                    />
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{name}</Text>
                    <Text style={styles.productSubtext}>Sản phẩm</Text>
                  </View>
                  <View style={styles.productQtyContainer}>
                    <Text style={styles.productQty}>{qty}</Text>
                    <Text style={styles.productQtyLabel}>đơn vị</Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="cube-outline" size={64} color="#475569" />
            <Text style={styles.emptyText}>Chưa có dữ liệu sản phẩm</Text>
            <Text style={styles.emptySubtext}>Dữ liệu sẽ hiển thị khi AI phát hiện sản phẩm</Text>
          </View>
        )}

        {userRole === 'admin' && latestData && (
          <View style={styles.adminSection}>
            <View style={styles.adminCard}>
              <View style={styles.adminHeader}>
                <Ionicons name="information-circle" size={20} color="#6366F1" />
                <Text style={styles.adminTitle}>Thông tin quản trị</Text>
              </View>
              <View style={styles.adminRow}>
                <Text style={styles.adminLabel}>Document ID:</Text>
                <Text style={styles.adminValue}>{latestData.id}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const getProductIcon = (index) => {
  const icons = [
    'coffee', 'tea', 'bottle-soda', 'food-apple', 
    'food', 'glass-cocktail', 'fruit-cherries', 'cupcake'
  ];
  return icons[index % icons.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  content: {
    padding: 20,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    minHeight: 140,
  },
  statCardWide: {
    padding: 20,
    borderRadius: 20,
  },
  statCardWideContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statCardWideText: {
    flex: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statValueSmall: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  seeAll: {
    fontSize: 14,
    color: '#6366F1',
    fontWeight: '600',
  },
  productList: {
    gap: 12,
  },
  productCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  productCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  productIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  productSubtext: {
    fontSize: 13,
    color: '#94A3B8',
  },
  productQtyContainer: {
    alignItems: 'flex-end',
  },
  productQty: {
    fontSize: 24,
    fontWeight: '800',
    color: '#6366F1',
  },
  productQtyLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#CBD5E1',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  adminSection: {
    marginTop: 24,
  },
  adminCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  adminHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  adminTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  adminRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  adminLabel: {
    fontSize: 14,
    color: '#94A3B8',
  },
  adminValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
    maxWidth: '60%',
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