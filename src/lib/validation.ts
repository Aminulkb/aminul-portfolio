import { z } from "zod";

export const serviceTypeValues = ["hourly", "weekly", "monthly", "project"] as const;
export type ServiceType = (typeof serviceTypeValues)[number];

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address.")
    .max(200, "Email address is too long."),
  organization: z.string().trim().max(150, "Organization name is too long.").optional().or(z.literal("")),
  serviceType: z.enum(serviceTypeValues),
  message: z
    .string()
    .trim()
    .min(20, "Please provide a few more details (at least 20 characters).")
    .max(2000, "Message is too long (max 2000 characters)."),
  consent: z.boolean().refine((v) => v === true, {
    message: "Please agree to the privacy policy to continue.",
  }),
  // Honeypot — hidden from real visitors via CSS. Accept any value here (no
  // validation error) so the route handler can silently drop bot submissions
  // instead of revealing the field's existence through a validation message.
  companyWebsite: z.string().optional().or(z.literal("")),
  // Anti-bot timing guard: ms timestamp captured when the form rendered on the client.
  renderedAt: z.number().optional(),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/** Flattens a ZodError into a simple { field: message } map, stable across zod versions. */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) {
      fieldErrors[key] = issue.message;
    }
  }
  return fieldErrors;
}
