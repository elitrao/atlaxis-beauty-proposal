import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 32, background: "#151816", color: "#b9e3c4", border: "2px solid #b9e3c4", fontSize: 28, fontWeight: 800 }}>A</div>,
    size,
  );
}
