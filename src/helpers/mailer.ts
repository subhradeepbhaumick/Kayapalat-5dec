import nodemailer from 'nodemailer';
import  User  from '../models/userModel';
import bcrypt from 'bcryptjs';

// Email content variables
const getVerifyEmailContent = (hashedToken: string) => `
  <p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify your email.OR
  <br>
  Copy and paste this token in the website to verify your email: "${hashedToken}"
  </p>`;

const getResetPasswordContent = (hashedToken: string) => `
  <p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a> to reset your password.OR
  <br>
   Copy and paste this token in the website to reset your password: ${process.env.DOMAIN}/resetpassword?token=${hashedToken}
  </p>`;

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);
    console.log(emailType);
    console.log(typeof emailType);

    if (emailType === 'VERIFY') {
      const updatedUser = await User.findByIdAndUpdate(userId, {
        $set:{
        verifyToken: hashedToken,
        verifyTokenExpiry: new Date(Date.now() + 3600000)
        }
      });

      console.log(updatedUser);

    } else if (emailType === 'RESET') {
      await User.findByIdAndUpdate(userId, {
        $set:{
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: new Date(Date.now() + 3600000)
        }
      });
    }




    // Looking to send emails in production? Check out our Email API/SMTP product!
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ce1ecc5e8f0eeb",
        pass: "b1f487919c146e"
      }
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: emailType === 'VERIFY' ? 'Email Verification' : 'Password Reset',
      html:
        emailType === 'VERIFY'
          ? getVerifyEmailContent(hashedToken)
          : getResetPasswordContent(hashedToken),
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};