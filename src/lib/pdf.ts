import PDFDocument from "pdfkit";
import { serviceTypeOptions } from "@/content/site";
import type { ContactFormValues } from "./validation";

const BRAND_PURPLE = "#4A154B";
const TEXT_SECONDARY = "#6B6574";
const TEXT_MAIN = "#24212B";
const BORDER = "#E8E2ED";

function serviceLabel(value: string): string {
  return serviceTypeOptions.find((o) => o.value === value)?.label ?? value;
}

/** Renders a one-page PDF summary of a contact form submission and resolves to a Buffer. */
export function generateInquiryPdf(data: ContactFormValues): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 56 });
      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      const submittedAt = new Date().toLocaleString("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      });

      doc.fillColor(BRAND_PURPLE).fontSize(20).text("New Consulting Inquiry").moveDown(0.2);

      doc
        .fillColor(TEXT_SECONDARY)
        .fontSize(10)
        .text("Aminul Islam | HR Consultant Portfolio")
        .text(`Submitted: ${submittedAt}`)
        .moveDown(1);

      doc.moveTo(doc.x, doc.y).lineTo(539, doc.y).strokeColor(BORDER).stroke().moveDown(1);

      const row = (label: string, value: string) => {
        doc.fillColor(TEXT_SECONDARY).fontSize(10).text(label.toUpperCase());
        doc.fillColor(TEXT_MAIN).fontSize(12).text(value || "—").moveDown(0.8);
      };

      row("Full Name", data.name);
      row("Email", data.email);
      row("Organization", data.organization || "—");
      row("Service Type", serviceLabel(data.serviceType));

      doc.fillColor(TEXT_SECONDARY).fontSize(10).text("MESSAGE");
      doc.fillColor(TEXT_MAIN).fontSize(12).text(data.message, { align: "left" });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
