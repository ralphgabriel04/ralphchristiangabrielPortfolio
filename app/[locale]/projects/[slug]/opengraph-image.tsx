import { ImageResponse } from "next/og";
import { projects } from "@/lib/projects";

export const runtime = "edge";
export const alt = "Ralph Christian Gabriel — Projet / Project";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const isFr = locale === "fr";
  const project = projects.find((p) => p.id === slug);

  const name = project?.name ?? "Ralph Christian Gabriel";
  const tag = project ? project.tag[isFr ? "fr" : "en"] : "";
  const stack = project?.stack.slice(0, 4) ?? [];

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#141309",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "48px",
              height: "48px",
              borderRadius: "10px",
              border: "2px solid #333",
              color: "#fafafa",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            RG
          </div>
          <span style={{ color: "#737373", fontSize: "18px" }}>
            ralphgabriel<span style={{ color: "#fafafa" }}>.dev</span>
          </span>
        </div>

        <span
          style={{
            color: "#ff6a45",
            fontSize: "20px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "18px",
          }}
        >
          {isFr ? "Projet" : "Project"}
        </span>

        <h1
          style={{
            fontSize: "68px",
            fontWeight: 500,
            color: "#fafafa",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {name}
        </h1>

        {tag ? (
          <p style={{ fontSize: "30px", color: "#a3a3a3", lineHeight: 1.2, margin: "18px 0 0 0" }}>
            {tag}
          </p>
        ) : null}

        {stack.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "44px" }}>
            {stack.map((tech) => (
              <span
                key={tech}
                style={{
                  display: "flex",
                  color: "#d4d4d4",
                  fontSize: "18px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #333",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    ),
    { ...size },
  );
}
