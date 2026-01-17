import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    useColorScheme,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getFiles, deleteFile, type DriveFile } from '@/lib/api';

export default function FilesScreen() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const [files, setFiles] = useState<DriveFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentFolder, setCurrentFolder] = useState<string | undefined>(undefined);
    const [breadcrumbs, setBreadcrumbs] = useState<{ id: string; name: string }[]>([
        { id: 'root', name: 'ไฟล์ของฉัน' },
    ]);

    const loadFiles = useCallback(async () => {
        try {
            const result = await getFiles(currentFolder);
            if (result.success && result.data?.files) {
                setFiles(result.data.files);
            }
        } catch (error) {
            console.error('Error loading files:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [currentFolder]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    const onRefresh = () => {
        setRefreshing(true);
        loadFiles();
    };

    const handleFilePress = (file: DriveFile) => {
        if (file.mimeType === 'application/vnd.google-apps.folder') {
            setCurrentFolder(file.id);
            setBreadcrumbs([...breadcrumbs, { id: file.id, name: file.name }]);
        }
    };

    const handleBreadcrumbPress = (index: number) => {
        const crumb = breadcrumbs[index];
        if (index === 0) {
            setCurrentFolder(undefined);
        } else {
            setCurrentFolder(crumb.id);
        }
        setBreadcrumbs(breadcrumbs.slice(0, index + 1));
    };

    const handleDelete = (file: DriveFile) => {
        Alert.alert(
            'ลบไฟล์',
            `คุณต้องการลบ "${file.name}" หรือไม่?`,
            [
                { text: 'ยกเลิก', style: 'cancel' },
                {
                    text: 'ลบ',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await deleteFile(file.id);
                        if (result.success) {
                            loadFiles();
                        }
                    },
                },
            ]
        );
    };

    const getFileIcon = (mimeType: string): keyof typeof Ionicons.glyphMap => {
        if (mimeType === 'application/vnd.google-apps.folder') return 'folder';
        if (mimeType.startsWith('image/')) return 'image';
        if (mimeType.startsWith('video/')) return 'videocam';
        if (mimeType.startsWith('audio/')) return 'musical-notes';
        if (mimeType.includes('pdf')) return 'document-text';
        if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'stats-chart';
        if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
        return 'document-outline';
    };

    const getIconColor = (mimeType: string): string => {
        if (mimeType === 'application/vnd.google-apps.folder') return '#f59e0b';
        if (mimeType.startsWith('image/')) return '#10b981';
        if (mimeType.startsWith('video/')) return '#ef4444';
        if (mimeType.startsWith('audio/')) return '#8b5cf6';
        return '#6366f1';
    };

    const formatSize = (size?: string): string => {
        if (!size) return '';
        const bytes = parseInt(size);
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const styles = createStyles(isDark);

    const renderItem = ({ item }: { item: DriveFile }) => (
        <TouchableOpacity
            style={styles.fileItem}
            onPress={() => handleFilePress(item)}
            onLongPress={() => handleDelete(item)}
        >
            <View style={[styles.fileIcon, { backgroundColor: `${getIconColor(item.mimeType)}15` }]}>
                <Ionicons
                    name={getFileIcon(item.mimeType)}
                    size={24}
                    color={getIconColor(item.mimeType)}
                />
            </View>
            <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.fileMeta}>
                    {formatSize(item.size)}
                </Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
                <Ionicons name="ellipsis-vertical" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Breadcrumbs */}
            <View style={styles.breadcrumbs}>
                {breadcrumbs.map((crumb, index) => (
                    <View key={crumb.id} style={styles.breadcrumbItem}>
                        {index > 0 && (
                            <Ionicons name="chevron-forward" size={16} color={isDark ? '#64748b' : '#94a3b8'} />
                        )}
                        <TouchableOpacity onPress={() => handleBreadcrumbPress(index)}>
                            <Text
                                style={[
                                    styles.breadcrumbText,
                                    index === breadcrumbs.length - 1 && styles.breadcrumbActive,
                                ]}
                            >
                                {crumb.name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {/* File List */}
            <FlatList
                data={files}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#6366f1"
                    />
                }
                contentContainerStyle={files.length === 0 ? styles.emptyContainer : undefined}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="folder-open-outline" size={64} color={isDark ? '#334155' : '#cbd5e1'} />
                        <Text style={styles.emptyText}>ไม่มีไฟล์ในโฟลเดอร์นี้</Text>
                    </View>
                }
            />
        </View>
    );
}

const createStyles = (isDark: boolean) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: isDark ? '#0f172a' : '#f8fafc',
        },
        center: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        breadcrumbs: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            paddingHorizontal: 16,
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#334155' : '#e2e8f0',
        },
        breadcrumbItem: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        breadcrumbText: {
            fontSize: 14,
            color: isDark ? '#94a3b8' : '#64748b',
            paddingHorizontal: 4,
        },
        breadcrumbActive: {
            color: isDark ? '#f8fafc' : '#0f172a',
            fontWeight: '500',
        },
        fileItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            paddingHorizontal: 16,
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#334155' : '#f1f5f9',
        },
        fileIcon: {
            width: 48,
            height: 48,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        fileInfo: {
            flex: 1,
            marginLeft: 12,
        },
        fileName: {
            fontSize: 16,
            fontWeight: '500',
            color: isDark ? '#f8fafc' : '#0f172a',
        },
        fileMeta: {
            fontSize: 13,
            color: isDark ? '#64748b' : '#94a3b8',
            marginTop: 2,
        },
        moreButton: {
            padding: 8,
        },
        emptyContainer: {
            flex: 1,
        },
        emptyState: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 100,
        },
        emptyText: {
            fontSize: 16,
            color: isDark ? '#64748b' : '#94a3b8',
            marginTop: 16,
        },
    });
