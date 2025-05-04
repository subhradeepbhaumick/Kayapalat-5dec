import { NextResponse } from 'next/server';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/helpers/mailer';

// Email templates
const verificationEmail = (token: string) => `
  <h1>Welcome to Kayapalat!</h1>
  <p>Please verify your email by clicking the link below:</p>
  <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}">Verify Email</a>
`;

const resetPasswordEmail = (token: string) => `
  <h1>Password Reset Request</h1>
  <p>Click the link below to reset your password:</p>
  <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}">Reset Password</a>
`;

export async function POST(req: Request) {
  try {
    const { email, token, type } = await req.json();

    if (!email || !token || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    let success = false;
    if (type === 'VERIFY') {
      success = await sendVerificationEmail(email, token);
    } else if (type === 'RESET') {
      success = await sendPasswordResetEmail(email, token);
    }

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
} 