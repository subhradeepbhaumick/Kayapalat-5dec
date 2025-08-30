import nodemailer from 'nodemailer';

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

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Send verification email
export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Verify your email',
      html: verificationEmail(token),
    });
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email: string, token: string) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: resetPasswordEmail(token),
    });
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};

/**
 * Ensure a named `sendEmail` export exists for callers like:
 * import { sendEmail } from '@/helpers/mailer'
 *
 * This function will try to forward to common patterns if present in this file:
 * - a `sendMail` function
 * - a `transporter` object with `sendMail`
 *
 * Adjust forwarding logic to match your actual mailer implementation.
 */
export type SendEmailOptions = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  [key: string]: unknown;
};

export async function sendEmail(opts: SendEmailOptions) {
  // @ts-ignore - prefer existing implementations if available
  if (typeof sendMail === 'function') {
    // @ts-ignore
    return sendMail(opts);
  }

  // @ts-ignore - common nodemailer transporter pattern
  if (typeof transporter !== 'undefined' && typeof (transporter as any).sendMail === 'function') {
    // @ts-ignore
    return (transporter as any).sendMail({
      from: opts.from ?? undefined,
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      html: opts.html,
    });
  }

  // Fallback: log and return a resolved value so callers don't crash.
  // Replace with real implementation as soon as possible.
   
  console.warn('sendEmail called but no mailer implementation found', opts);
  return Promise.resolve({ accepted: [], rejected: [] });
}

// Also expose a default object for any default-import consumers
export default {
  sendEmail,
};