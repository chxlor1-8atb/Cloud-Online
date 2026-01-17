import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    useColorScheme,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const { user, logout } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            'ออกจากระบบ',
            'คุณต้องการออกจากระบบหรือไม่?',
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'ออกจากระบบ',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    const styles = createStyles(isDark);

    const SettingItem = ({
        icon,
        label,
        value,
        onPress,
        danger,
    }: {
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        value?: string;
        onPress?: () => void;
        danger?: boolean;
    }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress} disabled={!onPress}>
            <View style={[styles.settingIcon, danger && styles.dangerIcon]}>
                <Ionicons name={icon} size={22} color={danger ? '#ef4444' : '#6366f1'} />
            </View>
            <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, danger && styles.dangerText]}>{label}</Text>
                {value && <Text style={styles.settingValue}>{value}</Text>}
            </View>
            {onPress && (
                <Ionicons name="chevron-forward" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
            )}
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                </View>
                <Text style={styles.userName}>{user?.name || 'ผู้ใช้'}</Text>
                <Text style={styles.userEmail}>{user?.email || ''}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>{user?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}</Text>
                </View>
            </View>

            {/* Settings List */}
            <View style={styles.settingsGroup}>
                <Text style={styles.groupTitle}>บัญชี</Text>
                <SettingItem icon="person-outline" label="แก้ไขโปรไฟล์" />
                <SettingItem icon="shield-outline" label="ความปลอดภัย" />
                <SettingItem icon="notifications-outline" label="การแจ้งเตือน" />
            </View>

            <View style={styles.settingsGroup}>
                <Text style={styles.groupTitle}>พื้นที่จัดเก็บ</Text>
                <SettingItem
                    icon="cloud-outline"
                    label="พื้นที่ที่ใช้"
                    value={`${((user?.storageUsedBytes || 0) / (1024 * 1024 * 1024)).toFixed(2)} GB / ${user?.storageQuotaGB || 5} GB`}
                />
            </View>

            <View style={styles.settingsGroup}>
                <Text style={styles.groupTitle}>เกี่ยวกับ</Text>
                <SettingItem icon="information-circle-outline" label="เวอร์ชัน" value="1.0.0" />
                <SettingItem icon="document-text-outline" label="นโยบายความเป็นส่วนตัว" />
                <SettingItem icon="help-circle-outline" label="ช่วยเหลือ" />
            </View>

            <View style={styles.settingsGroup}>
                <SettingItem
                    icon="log-out-outline"
                    label="ออกจากระบบ"
                    onPress={handleLogout}
                    danger
                />
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Cloud Online © 2026</Text>
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
        profileSection: {
            alignItems: 'center',
            padding: 24,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#1e293b' : '#e2e8f0',
        },
        avatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#6366f1',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
        },
        avatarText: {
            fontSize: 32,
            fontWeight: 'bold',
            color: '#fff',
        },
        userName: {
            fontSize: 22,
            fontWeight: 'bold',
            color: isDark ? '#f8fafc' : '#0f172a',
        },
        userEmail: {
            fontSize: 14,
            color: isDark ? '#94a3b8' : '#64748b',
            marginTop: 4,
        },
        roleBadge: {
            marginTop: 8,
            paddingHorizontal: 12,
            paddingVertical: 4,
            backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
            borderRadius: 12,
        },
        roleText: {
            fontSize: 12,
            color: '#6366f1',
            fontWeight: '500',
        },
        settingsGroup: {
            marginTop: 24,
        },
        groupTitle: {
            fontSize: 13,
            fontWeight: '600',
            color: isDark ? '#64748b' : '#94a3b8',
            textTransform: 'uppercase',
            marginLeft: 16,
            marginBottom: 8,
        },
        settingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 14,
            paddingHorizontal: 16,
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#334155' : '#f1f5f9',
        },
        settingIcon: {
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: isDark ? '#334155' : '#f1f5f9',
            justifyContent: 'center',
            alignItems: 'center',
        },
        dangerIcon: {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
        },
        settingContent: {
            flex: 1,
            marginLeft: 12,
        },
        settingLabel: {
            fontSize: 16,
            color: isDark ? '#f8fafc' : '#0f172a',
        },
        settingValue: {
            fontSize: 13,
            color: isDark ? '#64748b' : '#94a3b8',
            marginTop: 2,
        },
        dangerText: {
            color: '#ef4444',
        },
        footer: {
            padding: 24,
            alignItems: 'center',
        },
        footerText: {
            fontSize: 13,
            color: isDark ? '#475569' : '#94a3b8',
        },
    });
