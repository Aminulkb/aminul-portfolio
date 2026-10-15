import { NextResponse } from "next/server";
import { contactFormSchema, formatZodErrors } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateInquiryPdf } from "@/lib/pdf";
import { sendInquiryEmail } from "@/lib/email";

// Note: no `runtime` export needed — Cache Components (next.config.ts) requires
// the Node.js runtime for every route, which this already uses by default.

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const ip = getClientIp(request);
  const { allowed, retryAfterMs } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } },
    );
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Please check the form for errors.", fieldErrors: formatZodErrors(parsed.error) },
      { status: 400 },
    );
  }

  const { companyWebsite, renderedAt } = parsed.data;

  // Honeypot — a real visitor never fills this hidden field. Pretend success and drop it silently.
  if (companyWebsite) {
    return NextResponse.json({ success: true });
  }

  // Bot-speed guard — reject submissions completed implausibly fast after the form rendered.
  if (typeof renderedAt === "number" && Date.now() - renderedAt < 2000) {
    return NextResponse.json({ success: false, error: "Please try submitting again." }, { status: 400 });
  }

  try {
    const pdfBuffer = await generateInquiryPdf(parsed.data);
    await sendInquiryEmail(parsed.data, pdfBuffer);
  } catch (error) {
    console.error("[contact] failed to process inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "We couldn't send your message right now. Please try again shortly or email us directly.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ success: true });
}
