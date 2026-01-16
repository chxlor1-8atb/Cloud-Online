import { NextResponse } from 'next/server';
import { createUser, findUserByEmail, generateOTP, storeOTP } from '@/lib/users';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const { name, email } = await request.json();

        // Validation
        if (!name || !email) {
            return NextResponse.json(
                { error: 'กรุณากรอกชื่อและอีเมล' },
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

        // Check if user already exists
        const existingUser = findUserByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { error: 'อีเมลนี้ถูกลงทะเบียนแล้ว กรุณาเข้าสู่ระบบ' },
                { status: 409 }
            );
        }

        // Create user
        const user = createUser(name, email);

        // Generate and store OTP
        const otp = generateOTP();
        storeOTP(email, otp);

        // Send OTP via email
        const emailResult = await sendOTPEmail({ to: email, otp, userName: name });
        if (!emailResult.success) {
            console.error('Failed to send email:', emailResult.error);
            // Continue anyway - OTP is logged to console in demo mode
        }

        return NextResponse.json({
            success: true,
            message: 'สมัครสมาชิกสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อรับรหัส OTP',
            userId: user.id,
            debug_otp: process.env.NODE_ENV !== 'production' ? otp : undefined,
        });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'ไม่สามารถสร้างบัญชีได้' },
            { status: 500 }
        );
    }
}
