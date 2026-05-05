import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ralph Christian Gabriel · Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isFr = locale === "fr";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
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
            ralphgabriel
            <span style={{ color: "#fafafa" }}>.dev</span>
          </span>
        </div>

        <h1
          style={{
            fontSize: "64px",
            fontWeight: 500,
            color: "#fafafa",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          Ralph Christian Gabriel
        </h1>
        <p
          style={{
            fontSize: "32px",
            color: "#737373",
            lineHeight: 1.1,
            margin: "16px 0 0 0",
          }}
        >
          {isFr ? "Développeur Full-Stack" : "Full-Stack Developer"} ·{" "}
          {isFr ? "Génie Logiciel ÉTS" : "Software Engineering ÉTS"} · Montréal
        </p>

        <div
          style={{
            display: "flex",
            gap: "48px",
            marginTop: "48px",
          }}
        >
          {[
            { num: "~15k", label: "LOC" },
            { num: "30+", label: "API endpoints" },
            { num: "2,000+", label: isFr ? "tickets résolus" : "tickets resolved" },
          ].map((m) => (
            <div key={m.label} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "36px", fontWeight: 600, color: "#5b9bd5" }}>
                {m.num}
              </span>
              <span style={{ fontSize: "16px", color: "#737373" }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
