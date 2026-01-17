import nodemailer from 'nodemailer';

// Create Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

interface SendOTPEmailParams {
  to: string;
  otp: string;
  userName?: string;
}

export async function sendOTPEmail({ to, otp, userName }: SendOTPEmailParams): Promise<{ success: boolean; error?: string }> {
  // Check if Gmail credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log('═══════════════════════════════════════');
    console.log('📧 [DEMO MODE] OTP for', to);
    console.log('🔐 Code:', otp);
    console.log('⏱️  Expires in 5 minutes');
    console.log('═══════════════════════════════════════');
    return { success: true };
  }

  try {
    const mailOptions = {
      from: `CloudSync <${process.env.GMAIL_USER}>`,
      to: to,
      subject: '🔐 รหัสยืนยันตัวตน CloudSync ของคุณ',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Sarabun', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
          <div style="max-width: 500px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1B4D7A 0%, #20B2C4 100%); padding: 40px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 800;">☁️ CloudSync</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px;">
              <h2 style="color: #1B4D7A; margin: 0 0 16px 0; font-size: 24px;">
                ${userName ? `สวัสดีคุณ ${userName}! ` : ''}รหัสยืนยันตัวตนของคุณ
              </h2>
              <p style="color: #64748b; margin: 0 0 32px 0; line-height: 1.6;">
                ใช้รหัสนี้เพื่อยืนยันการเข้าสู่ระบบ รหัสจะหมดอายุภายใน 5 นาที
              </p>
              
              <!-- OTP Code -->
              <div style="background: #f1f5f9; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #1B4D7A;">
                  ${otp}
                </div>
              </div>
              
              <p style="color: #94a3b8; margin: 0; font-size: 14px; text-align: center;">
                หากคุณไม่ได้ทำการขอรหัสนี้ กรุณาเพิกเฉยต่ออีเมลฉบับนี้
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; margin: 0; font-size: 12px;">
                © ${new Date().getFullYear()} CloudSync. สงวนลิขสิทธิ์
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully! ID:', info.messageId);
    return { success: true };
  } catch (err: any) {
    console.error('Email send error:', err);
    return { success: false, error: err.message || 'Failed to send email' };
  }
}
