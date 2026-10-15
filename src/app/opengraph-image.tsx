import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#FAF8FC",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#5C2D91",
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          HR Consultant
        </div>
        <div style={{ fontSize: 72, color: "#24212B", fontWeight: 700, marginTop: 20 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 32, color: "#4A154B", marginTop: 16 }}>{siteConfig.tagline}</div>
        <div style={{ fontSize: 22, color: "#6B6574", marginTop: 32 }}>
          {`${siteConfig.location} · ${siteConfig.availability}`}
        </div>
      </div>
    ),
    { ...size },
  );
}
