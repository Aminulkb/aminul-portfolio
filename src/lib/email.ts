import nodemailer from "nodemailer";
import { serviceTypeOptions, siteConfig } from "@/content/site";
import type { ContactFormValues } from "./validation";

function serviceLabel(value: string): string {
  return serviceTypeOptions.find((o) => o.value === value)?.label ?? value;
}

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error("SMTP is not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASSWORD in the environment.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/** Sends the inquiry (with PDF attachment) to the configured owner inbox. Throws on failure. */
export async function sendInquiryEmail(data: ContactFormValues, pdfBuffer: Buffer): Promise<void> {
  const inbox = process.env.CONTACT_INBOX;
  if (!inbox) {
    throw new Error("CONTACT_INBOX is not configured.");
  }

  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${siteConfig.name} Website" <${from}>`,
    to: inbox,
    replyTo: data.email,
    subject: `New Inquiry: ${serviceLabel(data.serviceType)} — ${data.name}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Organization: ${data.organization || "—"}`,
      `Service Type: ${serviceLabel(data.serviceType)}`,
      "",
      "Message:",
      data.message,
    ].join("\n"),
    attachments: [
      {
        filename: `inquiry-${Date.now()}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  });
}
