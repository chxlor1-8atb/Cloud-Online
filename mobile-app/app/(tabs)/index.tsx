import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();

  const categories = [
    { icon: 'document-text-outline', label: 'เอกสาร', color: '#3b82f6', count: 0 },
    { icon: 'image-outline', label: 'รูปภาพ', color: '#10b981', count: 0 },
    { icon: 'musical-notes-outline', label: 'มีเดีย', color: '#f59e0b', count: 0 },
    { icon: 'ellipsis-horizontal-circle-outline', label: 'อื่นๆ', color: '#8b5cf6', count: 0 },
  ];

  const styles = createStyles(isDark);

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>สวัสดี, {user?.name || 'ผู้ใช้'} 👋</Text>
        <Text style={styles.subText}>จัดการไฟล์ของคุณได้ที่นี่</Text>
      </View>

      {/* Storage Card */}
      <View style={styles.storageCard}>
        <View style={styles.storageHeader}>
          <Ionicons name="cloud" size={24} color="#6366f1" />
          <Text style={styles.storageTitle}>พื้นที่จัดเก็บ</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '15%' }]} />
          </View>
          <Text style={styles.storageText}>
            {((user?.storageUsedBytes || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB จาก {user?.storageQuotaGB || 5} GB
          </Text>
        </View>
      </View>

      {/* Categories Grid */}
      <Text style={styles.sectionTitle}>หมวดหมู่</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryCard}
            onPress={() => router.push('/files')}
          >
            <View style={[styles.categoryIcon, { backgroundColor: `${cat.color}20` }]}>
              <Ionicons name={cat.icon as any} size={28} color={cat.color} />
            </View>
            <Text style={styles.categoryLabel}>{cat.label}</Text>
            <Text style={styles.categoryCount}>{cat.count} รายการ</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>การดำเนินการ</Text>
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="cloud-upload-outline" size={24} color="#6366f1" />
          <Text style={styles.actionText}>อัพโหลด</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="folder-open-outline" size={24} color="#6366f1" />
          <Text style={styles.actionText}>สร้างโฟลเดอร์</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#0f172a' : '#f8fafc',
    },
    welcomeSection: {
      padding: 20,
    },
    welcomeText: {
      fontSize: 28,
      fontWeight: 'bold',
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    subText: {
      fontSize: 16,
      color: isDark ? '#94a3b8' : '#64748b',
      marginTop: 4,
    },
    storageCard: {
      margin: 16,
      padding: 20,
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    storageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    storageTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#f8fafc' : '#0f172a',
      marginLeft: 10,
    },
    progressContainer: {
      gap: 8,
    },
    progressBar: {
      height: 8,
      backgroundColor: isDark ? '#334155' : '#e2e8f0',
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#6366f1',
      borderRadius: 4,
    },
    storageText: {
      fontSize: 14,
      color: isDark ? '#94a3b8' : '#64748b',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: isDark ? '#f8fafc' : '#0f172a',
      marginHorizontal: 16,
      marginTop: 16,
      marginBottom: 12,
    },
    categoriesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 12,
      justifyContent: 'space-between',
    },
    categoryCard: {
      width: '47%',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    categoryIcon: {
      width: 56,
      height: 56,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    categoryLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#f8fafc' : '#0f172a',
    },
    categoryCount: {
      fontSize: 13,
      color: isDark ? '#94a3b8' : '#64748b',
      marginTop: 2,
    },
    actionsRow: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      gap: 12,
      marginBottom: 24,
    },
    actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? '#1e293b' : '#ffffff',
      borderRadius: 12,
      padding: 16,
      gap: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    actionText: {
      fontSize: 15,
      fontWeight: '500',
      color: isDark ? '#f8fafc' : '#0f172a',
    },
  });
