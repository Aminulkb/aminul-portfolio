export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  const alignCls = align === "center" ? "text-center items-center" : "text-left items-start";
  return (
    <div className={`mb-12 flex flex-col gap-3 ${alignCls}`}>
      {eyebrow && <span className="text-sm font-semibold uppercase tracking-wider text-secondary">{eyebrow}</span>}
      <h2 className="font-serif text-3xl font-semibold text-text sm:text-4xl">{title}</h2>
      {description && (
        <p className={`max-w-2xl text-base text-text-secondary sm:text-lg ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </div>
  );
}
