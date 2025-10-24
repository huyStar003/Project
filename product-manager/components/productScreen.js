import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../utils/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';

const screenWidth = Dimensions.get('window').width;

export default function ProductScreen() {
  const [products, setProducts] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('employee');

  useEffect(() => {
    checkUserRole();

    const q = query(
      collection(db, 'product_counts'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(data);

      if (data.length > 0) {
        const latest = data[0];
        const items = latest.products || {};
        const labels = Object.keys(items).map(label => 
          label.length > 8 ? label.substring(0, 8) + '...' : label
        );
        const values = Object.values(items);

        setChartData({
          labels,
          datasets: [{ data: values.length > 0 ? values : [0] }],
        });
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const checkUserRole = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role || 'employee');
      }
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Thống kê sản phẩm</Text>
        <Text style={styles.headerSubtitle}>Phân tích chi tiết từ AI</Text>
      </LinearGradient>

      <View style={styles.content}>
        {chartData && chartData.datasets[0].data.some(val => val > 0) ? (
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View style={styles.chartTitleContainer}>
                <Ionicons name="bar-chart" size={24} color="#6366F1" />
                <Text style={styles.chartTitle}>Biểu đồ thống kê</Text>
              </View>
              <TouchableOpacity style={styles.chartButton}>
                <Ionicons name="download-outline" size={20} color="#6366F1" />
              </TouchableOpacity>
            </View>
            
            <BarChart
              data={chartData}
              width={screenWidth - 60}
              height={240}
              yAxisLabel=""
              chartConfig={{
                backgroundColor: 'transparent',
                backgroundGradientFrom: '#1E293B',
                backgroundGradientTo: '#1E293B',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(203, 213, 225, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForBackgroundLines: {
                  strokeWidth: 1,
                  stroke: 'rgba(71, 85, 105, 0.3)',
                  strokeDasharray: '0',
                },
                propsForLabels: {
                  fontSize: 11,
                },
                barPercentage: 0.7,
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
              showValuesOnTopOfBars={true}
              fromZero={true}
            />
          </View>
        ) : (
          <View style={styles.emptyChart}>
            <Ionicons name="analytics-outline" size={64} color="#475569" />
            <Text style={styles.emptyText}>Chưa có dữ liệu biểu đồ</Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch sử cập nhật</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{products.length} bản ghi</Text>
          </View>
        </View>

        <View style={styles.historyList}>
          {products.length > 0 ? (
            products.map((item, index) => (
              <View key={item.id} style={styles.historyCard}>
                <LinearGradient
                  colors={
                    index === 0 
                      ? ['rgba(99, 102, 241, 0.15)', 'rgba(139, 92, 246, 0.05)']
                      : ['rgba(30, 41, 59, 0.6)', 'rgba(15, 23, 42, 0.4)']
                  }
                  style={styles.historyCardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {index === 0 && (
                    <View style={styles.latestBadge}>
                      <Ionicons name="flash" size={12} color="#FCD34D" />
                      <Text style={styles.latestText}>Mới nhất</Text>
                    </View>
                  )}
                  
                  <View style={styles.historyHeader}>
                    <View style={styles.timeContainer}>
                      <Ionicons name="time-outline" size={18} color="#6366F1" />
                      <Text style={styles.timeText}>
                        {item.timestamp || 'Không có thời gian'}
                      </Text>
                    </View>
                    {userRole === 'admin' && (
                      <TouchableOpacity style={styles.moreButton}>
                        <Ionicons name="ellipsis-horizontal" size={20} color="#64748B" />
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.productsGrid}>
                    {item.products && Object.entries(item.products).map(([name, qty]) => (
                      <View key={name} style={styles.productItem}>
                        <View style={styles.productItemLeft}>
                          <View style={styles.productDot} />
                          <Text style={styles.productItemName}>{name}</Text>
                        </View>
                        <View style={styles.productQtyBadge}>
                          <Text style={styles.productItemQty}>{qty}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  {userRole === 'admin' && (
                    <View style={styles.adminInfo}>
                      <Ionicons name="key-outline" size={12} color="#64748B" />
                      <Text style={styles.adminInfoText}>
                        ID: {item.id.substring(0, 12)}...
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="folder-open-outline" size={64} color="#475569" />
              <Text style={styles.emptyText}>Chưa có lịch sử</Text>
              <Text style={styles.emptySubtext}>
                Dữ liệu sẽ được cập nhật khi AI phát hiện sản phẩm
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

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
  chartCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chartButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChart: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    borderRadius: 20,
    padding: 60,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.3)',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94A3B8',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
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
  badge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6366F1',
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  historyCardGradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.3)',
    borderRadius: 16,
  },
  latestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(252, 211, 77, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginBottom: 12,
  },
  latestText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FCD34D',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E1',
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(71, 85, 105, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productsGrid: {
    gap: 10,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  productItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  productDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366F1',
  },
  productItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#E2E8F0',
    flex: 1,
  },
  productQtyBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  productItemQty: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366F1',
  },
  adminInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(71, 85, 105, 0.3)',
  },
  adminInfoText: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
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