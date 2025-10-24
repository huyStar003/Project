import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsive } from '../utils/responsive';

export default function BottomTabBar({ navigation, currentRoute }) {
  const r = useResponsive();

  const tabs = [
    {
      name: 'Main',
      label: 'Trang chủ',
      icon: 'home',
      iconFocused: 'home',
    },
    {
      name: 'Product',
      label: 'Thống kê',
      icon: 'bar-chart-outline',
      iconFocused: 'bar-chart',
    },
    {
      name: 'Profile',
      label: 'Cá nhân',
      icon: 'person-outline',
      iconFocused: 'person',
    },
  ];

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'transparent',
    },
    tabBarContainer: {
      marginHorizontal: 16,
      marginBottom: Platform.OS === 'ios' ? 20 : 16,
      borderRadius: 24,
      overflow: 'hidden',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    gradient: {
      flexDirection: 'row',
      paddingTop: 12,
      paddingBottom: Platform.OS === 'ios' ? 16 : 12,
      paddingHorizontal: 8,
      backgroundColor: 'rgba(30, 41, 59, 0.95)',
      borderWidth: 1,
      borderColor: 'rgba(99, 102, 241, 0.3)',
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      borderRadius: 16,
    },
    tabButtonActive: {
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
    },
    iconContainer: {
      marginBottom: 4,
    },
    activeIndicator: {
      position: 'absolute',
      top: -2,
      width: 32,
      height: 3,
      borderRadius: 2,
      backgroundColor: '#6366F1',
    },
    label: {
      fontSize: r.fontSize.xs,
      fontWeight: '600',
      color: '#94A3B8',
    },
    labelActive: {
      color: '#6366F1',
      fontWeight: '700',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.tabBarContainer}>
        <View style={styles.gradient}>
          {tabs.map((tab) => {
            const isActive = currentRoute === tab.name;
            return (
              <TouchableOpacity
                key={tab.name}
                style={[
                  styles.tabButton,
                  isActive && styles.tabButtonActive,
                ]}
                onPress={() => navigation.navigate(tab.name)}
                activeOpacity={0.7}
              >
                {isActive && <View style={styles.activeIndicator} />}
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={isActive ? tab.iconFocused : tab.icon}
                    size={24}
                    color={isActive ? '#6366F1' : '#94A3B8'}
                  />
                </View>
                <Text style={[styles.label, isActive && styles.labelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}