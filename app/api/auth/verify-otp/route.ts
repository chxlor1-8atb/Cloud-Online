import { NextResponse } from 'next/server';
import { findUserByEmail, verifyOTP, createUser } from '@/lib/users';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { email, code, name } = await request.json();

        // Validation
        if (!email || !code) {
            return NextResponse.json(
                { error: 'กรุณากรอกอีเมลและรหัส OTP' },
                { status: 400 }
            );
        }

        // Verify OTP
        const result = verifyOTP(email, code);
        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 400 }
            );
        }

        // Get or create user
        let user = findUserByEmail(email);
        if (!user && name) {
            // Create user if this is from signup flow
            user = createUser(name, email);
        }

        if (!user) {
            return NextResponse.json(
                { error: 'ไม่พบผู้ใช้งาน' },
                { status: 404 }
            );
        }

        // Set auth cookie (simple session - in production use JWT)
        const cookieStore = await cookies();
        const sessionData = JSON.stringify({
            userId: user.id,
            email: user.email,
            name: user.name,
            loginAt: new Date().toISOString(),
        });

        cookieStore.set('auth-session', Buffer.from(sessionData).toString('base64'), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });

        return NextResponse.json({
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'ไม่สามารถตรวจสอบ OTP ได้' },
            { status: 500 }
        );
    }
}
