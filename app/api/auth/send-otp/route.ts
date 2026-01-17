import { NextResponse } from 'next/server';
import { findUserByEmail, generateOTP, storeOTP } from '@/lib/users';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { email, isSignIn } = await request.json();

        // Validation
        if (!email) {
            return NextResponse.json(
                { error: 'กรุณากรอกอีเมล' },
                { status: 400 }
            );
        }

        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'รูปแบบอีเมลไม่ถูกต้อง' },
                { status: 400 }
            );
        }

        // For sign in, check if user exists
        let userName: string | undefined;
        if (isSignIn) {
            const user = findUserByEmail(email);
            if (!user) {
                return NextResponse.json(
                    { error: 'ไม่พบอีเมลในระบบ กรุณาลงทะเบียนก่อน' },
                    { status: 404 }
                );
            }
            userName = user.name;
        }

        // Generate and store OTP
        const otp = generateOTP();
        storeOTP(email, otp);

        // Send OTP via email
        const emailResult = await sendOTPEmail({ to: email, otp, userName });
        if (!emailResult.success) {
            console.error('Failed to send email:', emailResult.error);
            return NextResponse.json(
                { error: 'ไม่สามารถส่งอีเมลได้ กรุณาลองใหม่อีกครั้ง' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'ส่ง OTP แล้ว! กรุณาตรวจสอบอีเมล',
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { error: 'ไม่สามารถส่ง OTP ได้' },
            { status: 500 }
        );
    }
}
