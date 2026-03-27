import { NextResponse } from "next/server";
import connectDB from "@/app/lib/db";
import User from "@/app/lib/models/User";
import { transporter } from "@/app/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if email already exists (as admin or user)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use. Please use a different email." },
        { status: 409 }
      );
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Create temporary user document to store OTP
    const tempUser = await User.create({
      email: email.toLowerCase(),
      emailOtp: otp,
      emailOtpExpiry: otpExpiry,
      role: "admin",
      password: null, // Will be set on actual signup
    });

    // Send OTP Email
    const mailFrom = process.env.MAIL_FROM || process.env.MAIL_USER || "dev.harshabalaga@gmail.com";
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #ddd;">
          <h2 style="color: #333; text-align: center;">Admin Account Registration - TRADEMILAAN</h2>
          
          <p style="color: #555;">Dear Administrator,</p>
          
          <p style="color: #555;">You have requested to create an admin account with trademilaan. Use the OTP below to complete your registration:</p>
          
          <h1 style="letter-spacing: 3px; color: #2c3e50; text-align: center; margin: 30px 0;">
            ${otp}
          </h1>
          
          <p style="text-align: center; color: #777; margin: 20px 0;">
            This OTP is valid for <b>5 minutes</b>.
          </p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

          <p style="font-weight: bold; color: #333;">🔒 Security Note:</p>
          <ul style="color: #555; line-height: 1.8;">
            <li>This OTP is exclusive to you. Do NOT share it with anyone.</li>
            <li>We will never ask for your OTP via phone, email follow-up, or message.</li>
            <li>If you did not request this registration, please ignore this email.</li>
            <li>Only registered administrators can create accounts on trademilaan.</li>
          </ul>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />

          <p style="color: #777; font-size: 12px;">
            For assistance, reach us at:<br />
            <b>spkumar.researchanalyst@gmail.com</b> / <b>+91-7702262206</b>
          </p>

          <p style="margin-top: 20px; color: #555;">Regards,</p>
          <p style="color: #333;"><b>TradeMilaan Admin Team</b></p>

          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="background: #f9f9f9; padding: 10px; border-radius: 4px; color: #666; font-size: 12px;">
            <b>Disclaimer:</b> SEBI registration and certifications do not guarantee performance or assured returns. All investments are subject to market risks.
          </p>
        </div>
      </div>
    `;

    try {
      const otpRecipientEmail = "harshabalaga45@gmail.com";
      await transporter.sendMail({
        from: mailFrom,
        to: otpRecipientEmail,
        subject: "Admin Account Registration OTP – TRADEMILAAN",
        html: htmlContent,
        replyTo: "spkumar.researchanalyst@gmail.com",
      });

      console.log("Admin signup OTP sent successfully to:", otpRecipientEmail, "for admin email:", email);

      return NextResponse.json(
        { message: "OTP sent to harshabalaga45@gmail.com. Please check that email to continue." },
        { status: 200 }
      );
    } catch (mailError) {
      console.error("Failed to send OTP email:", mailError);
      
      // Delete the temporary user if email fails
      await User.deleteOne({ _id: tempUser._id });
      
      return NextResponse.json(
        { message: "Failed to send OTP. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Admin signup request-otp error:", error);
    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
