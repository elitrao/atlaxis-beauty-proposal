import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export const alt = "ATLAXIS BEAUTY, коммерческое предложение";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "62px 70px", background: "#151816", color: "#f2f5f1", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, letterSpacing: "3px" }}><span>ATLAXIS BEAUTY</span><span style={{ color: "#9cc8a8" }}>КОММЕРЧЕСКОЕ ПРЕДЛОЖЕНИЕ</span></div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 940, fontSize: 92, fontWeight: 500, lineHeight: 0.95, letterSpacing: "-5px" }}>
        <span>Маркетинговая</span><span style={{ color: "#b9e3c4" }}>упаковка проекта</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24 }}><span>120 часов</span><span>180 000 ₽</span><span>2 месяца</span></div>
    </div>,
    size,
  );
}
