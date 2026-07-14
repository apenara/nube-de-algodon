import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Imagen que se muestra al compartir el enlace (WhatsApp, X, Facebook, etc.).
export const alt = "Nube de Algodón — Todo para tu bebé, con calma";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const iconData = readFileSync(join(process.cwd(), "app", "icon.png"));
  const iconSrc = `data:image/png;base64,${iconData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 96px",
          background: "#f5efe6",
          color: "#3a342e",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} width={300} height={300} alt="" />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#b87d76",
            }}
          >
            Tienda online · asesoría cercana
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.05,
              marginTop: 12,
              color: "#3a342e",
            }}
          >
            Nube de Algodón
          </div>
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.3,
              marginTop: 20,
              color: "#5c5a57",
              maxWidth: 620,
            }}
          >
            Todo para tu bebé, con calma. Pregúntale a Nube, tu asesora, y
            resuelve tus dudas en segundos.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
