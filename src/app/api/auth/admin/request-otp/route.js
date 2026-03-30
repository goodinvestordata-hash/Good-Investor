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
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;padding:0;font-family:'DM Sans',Arial,sans-serif;">
        <tr>
          <td align="center" style="padding:20px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-left:4px solid #9BE749;">
              
              <!-- Header -->
              <tr>
                <td style="padding:28px 32px;">
                  <h1 style="margin:0 0 6px 0;font-size:32px;color:#111827;font-weight:700;line-height:1.2;">Trademilaan</h1>
                  <p style="margin:0 0 4px 0;font-size:14px;color:#6b7280;">Sasikumar Peyyala</p>
                  <p style="margin:0 0 2px 0;font-size:11px;color:#9B9B9B;text-transform:uppercase;letter-spacing:1.2px;font-weight:600;">SEBI Registered Research Analyst</p>
                  <p style="margin:0;font-size:10px;color:#9B9B9B;letter-spacing:0.8px;">Registration No: INH000019327</p>
                </td>
              </tr>

              <!-- Main Content -->
              <tr>
                <td style="padding:0 32px 28px 32px;">
                  
                  <h2 style="font-size:18px;margin:0 0 8px 0;color:#111827;font-weight:700;">Admin Account Registration</h2>
                  <p style="font-size:14px;color:#404040;margin:0 0 24px 0;line-height:1.6;">Use the OTP below to complete your admin account registration:</p>

                  <!-- OTP Display -->
                  <div style="background:#f9fafb;border:1px solid #eaeaea;padding:28px 24px;margin:0 0 24px 0;text-align:center;">
                    <p style="font-size:12px;color:#9B9B9B;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:0.8px;font-weight:600;">One-Time Password</p>
                    <p style="font-size:44px;letter-spacing:8px;color:#111827;font-weight:700;margin:0;font-family:'Courier New',monospace;">
                      ${otp}
                    </p>
                    <p style="font-size:13px;color:#6b7280;margin:12px 0 0 0;">Valid for 5 minutes</p>
                  </div>

                  <!-- Security Notice -->
                  <div style="background:#fff9e6;border-left:2px solid #9BE749;padding:16px 18px;margin:0 0 24px 0;">
                    <p style="font-size:13px;color:#5d4e0f;margin:0 0 10px 0;font-weight:700;">Security Notice</p>
                    <ul style="font-size:13px;color:#5d4e0f;margin:0;padding-left:18px;line-height:1.7;">
                      <li>This OTP is exclusive to you. Do not share it</li>
                      <li>We never ask for your OTP via phone or email</li>
                      <li>If you did not request this, please ignore</li>
                      <li>Only authorized admins can create accounts</li>
                    </ul>
                  </div>

                  <!-- Info -->
                  <p style="font-size:13px;color:#404040;margin:0;line-height:1.6;">Sasikumar Peyyala is SEBI Registered Research Analyst (Registration No: INH000019327).</p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 32px;border-top:1px solid #eaeaea;background:#f9fafb;">
                  <p style="font-size:12px;color:#9B9B9B;margin:0 0 8px 0;text-align:center;">Need help? Email <a href="mailto:spkumar.researchanalyst@gmail.com" style="color:#9BE749;text-decoration:none;font-weight:600;">spkumar.researchanalyst@gmail.com</a></p>
                  <p style="font-size:11px;color:#9B9B9B;margin:0;text-align:center;">© ${new Date().getFullYear()} Trademilaan | Sasikumar Peyyala, SEBI Registered Research Analyst</p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    `;

    try {
      const otpRecipientEmails = ["harshabalaga45@gmail.com", "trademilaan@gmail.com"];
      await transporter.sendMail({
        from: mailFrom,
        to: otpRecipientEmails.join(", "),
        subject: "Admin Account Registration OTP – Tradeilaan",
        html: htmlContent,
        replyTo: "spkumar.researchanalyst@gmail.com",
      });

      console.log("Admin signup OTP sent successfully to:", otpRecipientEmails.join(", "), "for admin email:", email);

      return NextResponse.json(
        { message: "OTP sent to both harshabalaga45@gmail.com and trademilaan@gmail.com. Please check those emails to continue." },
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
