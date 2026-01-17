import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sendOTP, verifyOTP, signUp } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

type Mode = 'login' | 'register' | 'otp';

export default function LoginScreen() {
    const { login } = useAuth();
    const [mode, setMode] = useState<Mode>('login');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOTP = async () => {
        if (!email.trim()) {
            setError('กรุณากรอกอีเมล');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await sendOTP(email);
            if (result.success) {
                setMode('otp');
            } else {
                setError(result.error || 'เกิดข้อผิดพลาด');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (!name.trim() || !email.trim()) {
            setError('กรุณากรอกข้อมูลให้ครบ');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await signUp(name, email);
            if (result.success) {
                // Send OTP after signup
                await sendOTP(email);
                setMode('otp');
            } else {
                setError(result.error || 'เกิดข้อผิดพลาด');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการลงทะเบียน');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            setError('กรุณากรอก OTP 6 หลัก');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await verifyOTP(email, otp);
            if (result.success && result.data?.user) {
                await login(result.data.user);
                router.replace('/(tabs)');
            } else {
                setError(result.error || 'รหัส OTP ไม่ถูกต้อง');
            }
        } catch (err) {
            setError('เกิดข้อผิดพลาดในการยืนยัน');
        } finally {
            setLoading(false);
        }
    };

    const renderLoginForm = () => (
        <>
            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="อีเมล"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSendOTP}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>เข้าสู่ระบบ</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMode('register')}>
                <Text style={styles.linkText}>
                    ยังไม่มีบัญชี? <Text style={styles.linkHighlight}>สมัครสมาชิก</Text>
                </Text>
            </TouchableOpacity>
        </>
    );

    const renderRegisterForm = () => (
        <>
            <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="ชื่อ"
                    placeholderTextColor="#94a3b8"
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="อีเมล"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>สมัครสมาชิก</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMode('login')}>
                <Text style={styles.linkText}>
                    มีบัญชีแล้ว? <Text style={styles.linkHighlight}>เข้าสู่ระบบ</Text>
                </Text>
            </TouchableOpacity>
        </>
    );

    const renderOTPForm = () => (
        <>
            <Text style={styles.otpInfo}>
                กรุณากรอกรหัส OTP 6 หลักที่ส่งไปยัง
            </Text>
            <Text style={styles.otpEmail}>{email}</Text>

            <View style={styles.inputContainer}>
                <Ionicons name="keypad-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="รหัส OTP"
                    placeholderTextColor="#94a3b8"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                />
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleVerifyOTP}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>ยืนยัน OTP</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => { setMode('login'); setOtp(''); }}>
                <Text style={styles.linkText}>
                    <Text style={styles.linkHighlight}>← กลับ</Text>
                </Text>
            </TouchableOpacity>
        </>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="cloud" size={48} color="#6366f1" />
                    </View>
                    <Text style={styles.title}>Cloud Online</Text>
                    <Text style={styles.subtitle}>จัดการไฟล์ของคุณทุกที่ทุกเวลา</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    {error ? (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={16} color="#ef4444" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {mode === 'login' && renderLoginForm()}
                    {mode === 'register' && renderRegisterForm()}
                    {mode === 'otp' && renderOTPForm()}
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 48,
    },
    logoCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(100, 116, 139, 0.3)',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 56,
        color: '#f8fafc',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#6366f1',
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    linkText: {
        color: '#94a3b8',
        textAlign: 'center',
        fontSize: 14,
    },
    linkHighlight: {
        color: '#6366f1',
        fontWeight: '600',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#ef4444',
        marginLeft: 8,
        flex: 1,
    },
    otpInfo: {
        color: '#94a3b8',
        textAlign: 'center',
        marginBottom: 4,
    },
    otpEmail: {
        color: '#6366f1',
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 24,
    },
});
