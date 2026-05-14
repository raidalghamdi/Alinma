// Real, working export helpers used by all "Export to PDF/PPT/Excel" buttons.
// PDF via jsPDF, PowerPoint via pptxgenjs, Excel as CSV (Excel-compatible).
import jsPDF from "jspdf";
import PptxGenJS from "pptxgenjs";

const BRAND = {
  navy: "0C2341",
  purple: "8B84D7",
  coral: "FFA38B",
  brown: "623B2A",
  cream: "FCF4EF",
  lightPurple: "E7E5F7",
};

export type ReportSection = {
  heading: string;
  bullets: string[];
};

export type ReportPayload = {
  title: string;
  subtitle?: string;
  owner?: string;
  date?: string;
  kpis?: Array<{ label: string; value: string; hint?: string }>;
  sections: ReportSection[];
  footer?: string;
};

const ts = () => new Date().toISOString().slice(0, 10);
const safe = (s: string) => s.replace(/[^a-z0-9\-_]+/gi, "_").toLowerCase();

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ───────────────────────────────────────────────────────── PDF
export function downloadPDF(payload: ReportPayload, filenameBase?: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  // Brand banner
  doc.setFillColor(`#${BRAND.navy}`);
  doc.rect(0, 0, pageW, 110, "F");
  doc.setFillColor(`#${BRAND.purple}`);
  doc.circle(pageW - 70, 55, 18, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("D&I PORTFOLIO · PERFORMANCE PORTAL", margin, 40);
  doc.setFontSize(20);
  doc.text(payload.title, margin, 70, { maxWidth: pageW - margin * 2 - 60 });
  if (payload.subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor("#CFCCEF");
    doc.text(payload.subtitle, margin, 92, { maxWidth: pageW - margin * 2 - 60 });
  }
  y = 130;

  // Metadata row
  doc.setTextColor("#555");
  doc.setFontSize(9);
  const meta = [
    payload.owner ? `Owner: ${payload.owner}` : null,
    `Generated: ${payload.date ?? ts()}`,
    "Vision 2030 aligned",
  ].filter(Boolean).join("  ·  ");
  doc.text(meta, margin, y);
  y += 18;

  // KPI cards
  if (payload.kpis?.length) {
    const cardW = (pageW - margin * 2 - 12 * (payload.kpis.length - 1)) / payload.kpis.length;
    payload.kpis.forEach((k, i) => {
      const x = margin + i * (cardW + 12);
      doc.setFillColor(`#${BRAND.cream}`);
      doc.roundedRect(x, y, cardW, 64, 6, 6, "F");
      doc.setTextColor("#999");
      doc.setFontSize(8);
      doc.text(k.label.toUpperCase(), x + 10, y + 16);
      doc.setTextColor(`#${BRAND.navy}`);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text(k.value, x + 10, y + 38);
      if (k.hint) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor("#888");
        doc.text(k.hint, x + 10, y + 54);
      }
    });
    y += 80;
  }

  // Sections
  doc.setFont("helvetica", "normal");
  for (const section of payload.sections) {
    if (y > pageH - 100) { doc.addPage(); y = margin; }
    doc.setFillColor(`#${BRAND.lightPurple}`);
    doc.rect(margin, y, 4, 14, "F");
    doc.setTextColor(`#${BRAND.navy}`);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(section.heading, margin + 12, y + 11);
    y += 22;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor("#222");
    for (const b of section.bullets) {
      if (y > pageH - 60) { doc.addPage(); y = margin; }
      const lines = doc.splitTextToSize("•  " + b, pageW - margin * 2 - 8);
      doc.text(lines, margin + 8, y);
      y += lines.length * 13 + 4;
    }
    y += 8;
  }

  // Footer
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor("#888");
    doc.text(
      payload.footer ?? "D&I Portfolio Performance Portal · Confidential",
      margin,
      pageH - 20
    );
    doc.text(`${i} / ${pages}`, pageW - margin, pageH - 20, { align: "right" });
  }

  doc.save(`${safe(filenameBase ?? payload.title)}-${ts()}.pdf`);
}

// ───────────────────────────────────────────────────────── PowerPoint
export function downloadPPTX(payload: ReportPayload, filenameBase?: string) {
  const pres = new PptxGenJS();
  pres.layout = "LAYOUT_WIDE";
  pres.title = payload.title;

  // Cover
  const cover = pres.addSlide();
  cover.background = { color: BRAND.navy };
  cover.addText("D&I PORTFOLIO · PERFORMANCE PORTAL", {
    x: 0.6, y: 0.6, w: 12, h: 0.4,
    fontSize: 11, fontFace: "Calibri", color: "CFCCEF", bold: true, charSpacing: 4,
  });
  cover.addText(payload.title, {
    x: 0.6, y: 1.4, w: 12, h: 1.6,
    fontSize: 40, fontFace: "Calibri", color: "FFFFFF", bold: true,
  });
  if (payload.subtitle) {
    cover.addText(payload.subtitle, {
      x: 0.6, y: 3.0, w: 12, h: 1.0,
      fontSize: 18, fontFace: "Calibri", color: "FFA38B",
    });
  }
  cover.addText(
    [
      payload.owner ? `Owner · ${payload.owner}` : null,
      `Generated · ${payload.date ?? ts()}`,
      "Vision 2030 aligned",
    ].filter(Boolean).join("   ·   "),
    { x: 0.6, y: 6.6, w: 12, h: 0.4, fontSize: 11, color: "8B84D7", fontFace: "Calibri" }
  );
  cover.addShape(pres.ShapeType.rect, { x: 0.6, y: 7.2, w: 1.6, h: 0.06, fill: { color: BRAND.purple }, line: { color: BRAND.purple } });

  // KPI slide
  if (payload.kpis?.length) {
    const k = pres.addSlide();
    k.background = { color: BRAND.cream };
    k.addText("Headline KPIs", {
      x: 0.6, y: 0.5, w: 12, h: 0.6, fontSize: 24, bold: true, color: BRAND.navy, fontFace: "Calibri",
    });
    const cols = Math.min(payload.kpis.length, 4);
    const cardW = (13.33 - 1.2 - 0.3 * (cols - 1)) / cols;
    payload.kpis.slice(0, 4).forEach((kpi, i) => {
      const x = 0.6 + i * (cardW + 0.3);
      k.addShape(pres.ShapeType.roundRect, {
        x, y: 1.6, w: cardW, h: 2.0, fill: { color: "FFFFFF" }, line: { color: BRAND.lightPurple, width: 1 }, rectRadius: 0.1,
      });
      k.addText(kpi.label.toUpperCase(), { x: x + 0.2, y: 1.75, w: cardW - 0.4, h: 0.3, fontSize: 10, color: "888888", bold: true, charSpacing: 3 });
      k.addText(kpi.value, { x: x + 0.2, y: 2.15, w: cardW - 0.4, h: 0.9, fontSize: 32, bold: true, color: BRAND.navy, fontFace: "Calibri" });
      if (kpi.hint) k.addText(kpi.hint, { x: x + 0.2, y: 3.1, w: cardW - 0.4, h: 0.3, fontSize: 10, color: BRAND.purple });
    });
  }

  // Sections — one slide per section
  for (const section of payload.sections) {
    const s = pres.addSlide();
    s.background = { color: "FFFFFF" };
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 0.18, h: 7.5, fill: { color: BRAND.purple }, line: { color: BRAND.purple } });
    s.addText(section.heading, {
      x: 0.6, y: 0.5, w: 12, h: 0.7, fontSize: 24, bold: true, color: BRAND.navy, fontFace: "Calibri",
    });
    s.addText(
      section.bullets.map(b => ({ text: b, options: { bullet: { code: "25CF" }, color: "222222" } })),
      { x: 0.7, y: 1.4, w: 12, h: 5.6, fontSize: 14, fontFace: "Calibri", paraSpaceAfter: 8 }
    );
    s.addText(payload.footer ?? "D&I Portfolio · Confidential", {
      x: 0.6, y: 7.05, w: 12, h: 0.3, fontSize: 9, color: "888888",
    });
  }

  pres.writeFile({ fileName: `${safe(filenameBase ?? payload.title)}-${ts()}.pptx` });
}

// ───────────────────────────────────────────────────────── Excel (CSV — opens natively in Excel)
export function downloadXLSX(rows: Array<Record<string, string | number>>, filenameBase: string) {
  if (!rows.length) {
    const blob = new Blob(["No data"], { type: "text/csv;charset=utf-8" });
    triggerDownload(blob, `${safe(filenameBase)}-${ts()}.csv`);
    return;
  }
  const headers = Object.keys(rows[0]);
  const escape = (v: string | number) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [
    headers.map(escape).join(","),
    ...rows.map(r => headers.map(h => escape(r[h])).join(",")),
  ].join("\n");
  // BOM + CSV → Excel will open with UTF-8 detection
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, `${safe(filenameBase)}-${ts()}.csv`);
}

// Email composer fallback — opens user's mail client with pre-filled body.
export function emailReport(subject: string, body: string) {
  const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}
