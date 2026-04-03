import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (transporter) {
    return transporter;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || !user || !pass) {
    throw new Error("Missing SMTP configuration.");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
    auth: {
      user,
      pass,
    },
  });

  return transporter;
}

export async function sendSignupOtpEmail({ toEmail, name, otp }) {
  const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER;

  if (!fromEmail) {
    throw new Error("Missing SMTP_FROM/SMTP_USER for sender address.");
  }

  const client = getTransporter();
  const safeName = String(name || "there").trim() || "there";
  const code = String(otp || "").trim();

  const subject = "Your SavoryCircle verification code";
  const text = `Hi ${safeName},\n\nYour SavoryCircle verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, you can ignore this email.`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#1a1b1f">
      <p>Hi ${safeName},</p>
      <p>Your SavoryCircle verification code is:</p>
      <p style="font-size:24px;font-weight:700;letter-spacing:4px;margin:12px 0;">${code}</p>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request this, you can ignore this email.</p>
    </div>
  `;

  await client.sendMail({
    from: `SavoryCircle <${fromEmail}>`,
    to: toEmail,
    subject,
    text,
    html,
  });
}
