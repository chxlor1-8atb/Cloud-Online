import * as SecureStore from 'expo-secure-store';

const AUTH_KEY = 'cloud_online_auth';

interface StoredAuth {
    user: {
        id: string;
        name: string;
        email: string;
        role: 'admin' | 'user';
        storageQuotaGB: number;
        storageUsedBytes: number;
    } | null;
    isAuthenticated: boolean;
}

// Save auth state
export async function saveAuth(auth: StoredAuth): Promise<void> {
    try {
        await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(auth));
    } catch (error) {
        console.error('Error saving auth:', error);
    }
}

// Get auth state
export async function getAuth(): Promise<StoredAuth | null> {
    try {
        const value = await SecureStore.getItemAsync(AUTH_KEY);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error getting auth:', error);
        return null;
    }
}

// Clear auth state
export async function clearAuth(): Promise<void> {
    try {
        await SecureStore.deleteItemAsync(AUTH_KEY);
    } catch (error) {
        console.error('Error clearing auth:', error);
    }
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
    const auth = await getAuth();
    return auth?.isAuthenticated ?? false;
}
