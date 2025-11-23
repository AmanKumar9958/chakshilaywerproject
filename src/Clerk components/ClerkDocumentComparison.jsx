import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Download, Settings2, FileSearch2, Languages, ShieldCheck, GitCompare,
  Loader2, ChevronUp, ChevronDown, Search, CheckCircle2, XCircle, ArrowLeft, FileWarning
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

/**
 * Intelligent Document Workspace (JS, single file)
 * - Compare: URL or Upload (left-top) + Upload (left-bottom) → n8n compare webhook
 * - Risk Analysis (API): upload 1 PDF → n8n risk webhook (multipart/form-data file1)
 * - Authenticity/Compliance: JSON POST → n8n compliance webhook
 * - All result viewers: pretty formatting (removes **, ---) + Download JSON/PDF
 */

const THEME = {
  bg: "#F6F6F0",
  surface: "#FFFFFF",
  border: "#E0DDD2",
  ink: "#0E172A",
  inkMuted: "#4C515D",
  sand300: "#D9CDB8",
  sand400: "#C1AB88",
  sand500: "#AD9C80",
  mint200: "#DAE5E0",
  mint300: "#CFE6DA",
  teal700: "#307658",
  neutral300: "#D8D8D8",
  neutral500: "#9D988F",
};

// n8n endpoints
const N8N_COMPARE_ENDPOINT =
  "https://n8n.srv983857.hstgr.cloud/webhook/a027ab82-e53c-4246-9982-c41c79ac9bca";

const N8N_COMPLIANCE_ENDPOINT =
  "https://n8n.srv983857.hstgr.cloud/webhook/compliance";

const N8N_RISK_ENDPOINT =
  "https://n8n.srv983857.hstgr.cloud/webhook/32c4f30e-6722-4125-bd7d-691f0e9460e4";

// ---------- utils ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clsx = (...s) => s.filter(Boolean).join(" ");

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data ?? {}, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function downloadPDFFromNode(filename, node) {
  const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
  const img = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
  const w = canvas.width * ratio;
  const h = canvas.height * ratio;
  const x = (pageWidth - w) / 2;
  const y = 24;
  pdf.addImage(img, "PNG", x, y, w, h);
  pdf.save(filename);
}

// remove ** stars, leading bullets like "* " and '---' dividers; compress blank lines
function cleanStars(text) {
  if (!text) return "";
  let t = String(text);
  t = t.replace(/\*\*/g, "");
  t = t.replace(/^\s*\*+\s?/gm, "");
  t = t.replace(/^\s*-{3,}\s*$/gm, "");
  t = t.replace(/\n{3,}/g, "\n\n");
  return t.trim();
}
const escapeHtml = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

// blocks → simple headings + ULs
function toPrettyHtml(text) {
  const clean = cleanStars(text);
  const lines = clean.split("\n");
  const blocks = [];
  let cur = [];
  for (const ln of lines) {
    if (ln.trim() === "") {
      if (cur.length) blocks.push(cur), (cur = []);
    } else cur.push(ln);
  }
  if (cur.length) blocks.push(cur);

  let html = "";
  blocks.forEach((blk) => {
    const allBullets = blk.every((l) => /^\s*[-•]\s+/.test(l));
    const maybeHeading =
      blk.length === 1 &&
      !/^\s*[-•]\s+/.test(blk[0]) &&
      (/[.:]$/.test(blk[0].trim()) || /^[A-Z0-9 \-/]+$/.test(blk[0].trim()));

    if (maybeHeading) {
      html += `<h4 class="font-semibold text-[13px] uppercase tracking-wide mb-1">${escapeHtml(
        blk[0].replace(/[.:]$/, "")
      )}</h4>`;
    } else if (allBullets) {
      html += `<ul class="list-disc pl-5 space-y-1 text-[13px]">`;
      blk.forEach((l) =>
        (html += `<li>${escapeHtml(l.replace(/^\s*[-•]\s+/, ""))}</li>`)
      );
      html += `</ul>`;
    } else {
      html += `<p class="text-[13px] whitespace-pre-wrap">${escapeHtml(
        blk.join("\n")
      )}</p>`;
    }
    html += `<div class="h-2"></div>`;
  });
  return html || `<div class="text-[13px] opacity-60">— No content —</div>`;
}

// optional token diff, if compare API returns raw texts
function simpleDiff(oldText, newText) {
  const oldWords = (oldText || "").split(/\s+/);
  const newWords = (newText || "").split(/\s+/);
  const oldCount = {};
  const newCount = {};
  oldWords.forEach((w) => (oldCount[w] = (oldCount[w] || 0) + 1));
  newWords.forEach((w) => (newCount[w] = (newCount[w] || 0) + 1));
  const additions = [];
  const removals = [];
  Object.keys(newCount).forEach((w) => {
    const d = (newCount[w] || 0) - (oldCount[w] || 0);
    if (d > 0) additions.push(...Array(d).fill(w));
  });
  Object.keys(oldCount).forEach((w) => {
    const d = (oldCount[w] || 0) - (newCount[w] || 0);
    if (d > 0) removals.push(...Array(d).fill(w));
  });
  return { additions, removals };
}

// ---------- demo text for Translate/Search tools ----------
const DEMO_ORIGINAL = `This Master Service Agreement (MSA) governs the relationship between Client and Vendor.

7.2 Termination: Either party may terminate this agreement with thirty (30) days' prior written notice.

8.1 Confidentiality: The parties shall protect confidential information.

10.3 Liability: Vendor's total liability shall not exceed the fees paid in the twelve (12) months preceding the claim.`;
const DEMO_SECOND = `This Master Service Agreement governs the relationship between Customer and Supplier.

7.2 Termination: Either party may terminate this agreement with fifteen (15) days' prior written notice.

8.1 Confidentiality: The parties shall protect confidential and proprietary information.

10.3 Liability: Vendor's total liability shall not exceed the fees paid.`;
const DEMO_TRANSLATIONS = {
  Hindi: "यह मास्टर सेवा अनुबंध (MSA) क्लाइंट और विक्रेता के बीच संबंधों को नियंत्रित करता है...",
  Spanish: "Este Acuerdo Marco de Servicios regula la relación entre Cliente y Proveedor...",
  French: "Le présent Contrat-cadre de services régit la relation entre le Client et le Fournisseur...",
};

// ---------- main ----------
export default function DocumentAnalysisWorkspace() {
  const [docName] = useState("Master Service Agreement.pdf");
  const [route, setRoute] = useState("workspace"); // "workspace" | "auth-report"
  const [activeTool, setActiveTool] = useState("compare"); // compare | riskApi | translate | search | compliance

  const [bottomOpen, setBottomOpen] = useState(true);
  const [bottomTab, setBottomTab] = useState("assistant");

  // ===== Compare =====
  const [firstStaticUrl, setFirstStaticUrl] = useState("/contract1.pdf");
  const [firstPdfFile, setFirstPdfFile] = useState(null);
  const [firstPdfPreviewUrl, setFirstPdfPreviewUrl] = useState(null);

  const [secondPdfFile, setSecondPdfFile] = useState(null);
  const [secondPdfPreviewUrl, setSecondPdfPreviewUrl] = useState(null);

  const [isComparing, setIsComparing] = useState(false);
  const [compareReport, setCompareReport] = useState(null);
  const [compareError, setCompareError] = useState("");
  const [tokenAdditions, setTokenAdditions] = useState([]);
  const [tokenRemovals, setTokenRemovals] = useState([]);
  const comparePanelRef = useRef(null);

  useEffect(() => {
    if (!firstPdfFile) return setFirstPdfPreviewUrl(null);
    const url = URL.createObjectURL(firstPdfFile);
    setFirstPdfPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [firstPdfFile]);

  useEffect(() => {
    if (!secondPdfFile) return setSecondPdfPreviewUrl(null);
    const url = URL.createObjectURL(secondPdfFile);
    setSecondPdfPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [secondPdfFile]);

  async function urlToFile(url, filename = "contract1.pdf") {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url} (${res.status})`);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "application/pdf" });
  }

  async function performCompare() {
    try {
      setCompareError("");
      setCompareReport(null);
      setTokenAdditions([]); setTokenRemovals([]);
      setIsComparing(true);

      let file1 = firstPdfFile;
      if (!file1) {
        if (!firstStaticUrl) throw new Error("Provide the First PDF (URL or upload).");
        file1 = await urlToFile(firstStaticUrl, "contract1.pdf");
      }
      if (!secondPdfFile) throw new Error("Upload the Second PDF.");

      const form = new FormData();
      form.append("file1", file1);
      form.append("file2", secondPdfFile);

      const res = await fetch(N8N_COMPARE_ENDPOINT, { method: "POST", body: form });
      const ctype = res.headers.get("content-type") || "";
      const data = ctype.includes("application/json") ? await res.json() : await res.text();
      if (!res.ok) throw new Error(typeof data === "string" ? data.slice(0, 300) : JSON.stringify(data).slice(0, 300));

      // optional local diff
      const t1 = (data && (data.text1 || data.extracted1 || data.file1Text || data.doc1)) || "";
      const t2 = (data && (data.text2 || data.extracted2 || data.file2Text || data.doc2)) || "";
      if (t1 && t2) {
        const d = simpleDiff(t1, t2);
        setTokenAdditions(d.additions || []);
        setTokenRemovals(d.removals || []);
      } else if (data && Array.isArray(data.additions) && Array.isArray(data.removals)) {
        setTokenAdditions(data.additions);
        setTokenRemovals(data.removals);
      }
      setCompareReport(data);
    } catch (e) {
      setCompareError(e?.message || String(e));
    } finally {
      setIsComparing(false);
    }
  }

  // ===== Risk Analysis (API, file upload) =====
  const [riskFile, setRiskFile] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskError, setRiskError] = useState("");
  const [riskRaw, setRiskRaw] = useState(null);
  const riskPanelRef = useRef(null);

  async function runRiskApi() {
    try {
      setRiskError("");
      setRiskRaw(null);
      if (!riskFile) throw new Error("Please upload a PDF for risk analysis.");
      setRiskLoading(true);
      const form = new FormData();
      form.append("file1", riskFile); // per your curl
      const res = await fetch(N8N_RISK_ENDPOINT, { method: "POST", body: form });
      const ctype = res.headers.get("content-type") || "";
      const data = ctype.includes("application/json") ? await res.json() : await res.text();
      if (!res.ok) throw new Error(typeof data === "string" ? data.slice(0, 300) : JSON.stringify(data).slice(0, 300));
      setRiskRaw(data);
    } catch (e) {
      setRiskError(e?.message || String(e));
    } finally {
      setRiskLoading(false);
    }
  }

  // ===== Authenticity / Compliance (JSON POST) =====
  // const [compliance, setCompliance] = useState({ Regulation: "labor law", Country: "INDIA", CompanyType: "justice" });
 const [compliance, setCompliance] = useState({ 
  Regulation: "Wages & Remuneration",  // first option
  Country: "India",                    // default India
  CompanyType: "Private Limited Company" // first option
});
  const [compLoading, setCompLoading] = useState(false);
  const [compError, setCompError] = useState("");
  const [compResult, setCompResult] = useState(null);
  const compPanelRef = useRef(null);

  async function runCompliance() {
    try {
      setCompError("");
      setCompResult(null);
      setCompLoading(true);
      const res = await fetch(N8N_COMPLIANCE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(compliance),
      });
      const ctype = res.headers.get("content-type") || "";
      const data = ctype.includes("application/json") ? await res.json() : await res.text();
      if (!res.ok) throw new Error(typeof data === "string" ? data.slice(0, 300) : JSON.stringify(data).slice(0, 300));
      setCompResult(data);
    } catch (e) {
      setCompError(e?.message || String(e));
    } finally {
      setCompLoading(false);
    }
  }

  // ===== Translate / Search (demo area) =====
  const originalRef = useRef(null);
  const [original, setOriginal] = useState(DEMO_ORIGINAL);
  const [lang, setLang] = useState("Hindi");
  const [translated, setTranslated] = useState("");
  const [translating, setTranslating] = useState(false);
  const [query, setQuery] = useState("Termination clause");
  const [results, setResults] = useState([]);

  const translateAll = async () => {
    setTranslating(true);
    await sleep(600);
    setTranslated(DEMO_TRANSLATIONS[lang]);
    setTranslating(false);
  };
// File aur search query state se mil jayegi
async function runSearch() {
  try {
    setResults([]);
    setSearchError(null);
    setSearching(true);

    // Assume file pdf aur query state se aa rahe hain (firstPdfFile ya koi bhi relevant state)
    const form = new FormData();
    form.append("file1", firstPdfFile); // file object PDF upload se
    form.append("query", query); // user search query

    const res = await fetch(
      "https://n8n.srv983857.hstgr.cloud/webhook/smart-search",
      {
        method: "POST",
        body: form,
      }
    );

    const ctype = res.headers.get("content-type");
    const data = ctype && ctype.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      throw new Error(typeof data === "string" ? data.slice(0, 300) : JSON.stringify(data).slice(0, 300));
    }

    // data ko result me dikhane ke liye formatting
    setResults(Array.isArray(data) ? data : (typeof data === "string" ? [{ snippet: data }] : []));
  } catch (e) {
    setSearchError(e?.message || String(e));
  } finally {
    setSearching(false);
  }
}


  // ---------- UI ----------
  const Header = () => (
    <div
      className="flex items-center justify-between px-4 py-3 border-b"
      style={{ background: THEME.sand400, color: "#1c1b17", borderColor: THEME.border }}
    >
      <div className="flex items-center gap-3">
        <div className="h-7 w-7 rounded grid place-items-center" style={{ background: "#ffffffaa" }}>
          <Settings2 className="h-4 w-4" />
        </div>
        <div className="font-semibold tracking-wide">{docName}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            downloadJSON("analysis-context.json", { tool: activeTool, at: new Date().toISOString() })
          }
          className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium shadow"
          style={{ background: "#fff", color: THEME.teal700 }}
        >
          <Download className="h-4 w-4" /> Download
        </button>
        <button
          onClick={() => alert("Close pressed")}
          className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium"
          style={{ background: "#ffffff22" }}
        >
          <X className="h-4 w-4" /> Close
        </button>
      </div>
    </div>
  );

  const Sidebar = () => {
    const Item = ({ id, label, icon: Icon }) => (
      <button
        onClick={() => setActiveTool(id)}
        className={clsx(
          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium border",
          activeTool === id ? "bg-white" : "bg-[rgba(255,255,255,0.6)] hover:bg-white"
        )}
        style={{ color: THEME.ink, borderColor: THEME.border }}
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    );
    return (
      <div className="flex h-full flex-col gap-2 p-3" style={{ background: THEME.bg, borderRight: `1px solid ${THEME.border}` }}>
        <Item id="compare" label="Document Comparison" icon={GitCompare} />
        <Item id="riskApi" label="Risk Analysis (API)" icon={FileWarning} />
        <Item id="translate" label="Multilingual AI Summary" icon={Languages} />
        <Item id="search" label="Smart Search Across Doc" icon={FileSearch2} />
        <Item id="compliance" label="Document Authenticity Checker" icon={ShieldCheck} />
      </div>
    );
  };

  // ---------- Tools ----------
  const ToolCompare = () => {
    const firstHasUpload = !!firstPdfPreviewUrl;
    const reportText =
      typeof compareReport === "string"
        ? compareReport
        : (compareReport?.report || compareReport?.summary || compareReport?.text || compareReport?.plain || compareReport?.markdown || "");

    return (
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* LEFT */}
        <div className="flex flex-col gap-4">
          {/* First (URL or Upload) */}
          <div className="rounded-lg border h-[45%] flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface }}>
            <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: THEME.border }}>
              <div className="flex items-center gap-2">
                <span className="text-xs" style={{ color: THEME.inkMuted }}>Left Top Version (URL or Upload)</span>
                <span className="text-[11px] italic" style={{ color: THEME.inkMuted }}>
                  {firstHasUpload ? "Using uploaded file" : "Using URL"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="text-xs border rounded px-2 py-1 w-56"
                  placeholder="/contract1.pdf"
                  value={firstStaticUrl}
                  onChange={(e) => setFirstStaticUrl(e.target.value)}
                  style={{ borderColor: THEME.border }}
                />
                <label className="text-xs rounded px-2 py-1 cursor-pointer" style={{ background: THEME.sand400 }}>
                  Upload
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setFirstPdfFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                {firstPdfFile && (
                  <button className="text-[11px] px-2 py-1 rounded border" style={{ borderColor: THEME.border }} onClick={() => setFirstPdfFile(null)}>
                    Use URL
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1">
              {firstPdfPreviewUrl ? (
                <iframe title="first-uploaded" src={firstPdfPreviewUrl} className="w-full h-full" />
              ) : firstStaticUrl ? (
                <iframe title="first-static" src={firstStaticUrl} className="w-full h-full" />
              ) : (
                <div className="grid place-items-center h-full text-sm" style={{ color: THEME.inkMuted }}>
                  Provide a URL or upload a PDF
                </div>
              )}
            </div>
          </div>

          {/* Second (Upload) */}
          <div className="rounded-lg border h-[45%] flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface }}>
            <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: THEME.border }}>
              <div className="text-xs" style={{ color: THEME.inkMuted }}>Left Bottom Version (Upload PDF)</div>
              <label className="text-xs rounded px-2 py-1 cursor-pointer" style={{ background: THEME.sand400 }}>
                Upload
                <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setSecondPdfFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <div className="flex-1">
              {secondPdfPreviewUrl ? (
                <iframe title="second-uploaded" src={secondPdfPreviewUrl} className="w-full h-full" />
              ) : (
                <div className="grid place-items-center h-full text-sm" style={{ color: THEME.inkMuted }}>
                  No PDF uploaded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT result */}
        <div className="rounded-lg border h-full flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface }}>
          <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: THEME.border }}>
            <button
              onClick={performCompare}
              disabled={(!firstPdfFile && !firstStaticUrl) || !secondPdfFile || isComparing}
              className="inline-flex items-center gap-1 text-xs rounded px-2 py-1 disabled:opacity-60"
              style={{ background: THEME.sand400 }}
            >
              {isComparing ? <span className="inline-flex items-center gap-1"><Loader2 className="h-3.5 w-3.5 animate-spin" /> Comparing…</span> : "Compare"}
            </button>

            <div className="flex items-center gap-2">
             
              <button
                onClick={() => comparePanelRef.current && downloadPDFFromNode("compare-report.pdf", comparePanelRef.current)}
                className="inline-flex items-center gap-1 text-xs rounded px-2 py-1"
                style={{ background: "#fff", color: THEME.teal700, border: `1px solid ${THEME.border}` }}
              >
                <Download className="h-3.5 w-3.5" /> Download PDF
              </button>
            </div>
          </div>

          <div className="p-3 overflow-auto text-sm space-y-3" ref={comparePanelRef}>
            {compareError && (
              <div className="rounded border p-2" style={{ borderColor: THEME.border, color: "#b91c1c", background: "#fee2e2" }}>
                <b>Error:</b> {compareError}
                <div className="text-xs mt-1" style={{ color: THEME.inkMuted }}>
                  If you see a CORS error, allow <code className="font-mono">Access-Control-Allow-Origin: *</code> on your n8n webhook.
                </div>
              </div>
            )}

            {isComparing && (
              <div className="flex items-center gap-2 text-[13px]" style={{ color: THEME.inkMuted }}>
                <Loader2 className="h-4 w-4 animate-spin" /> Generating comparison…
              </div>
            )}

            {!isComparing && (
              <>
                <div className="text-xs uppercase tracking-wide" style={{ color: THEME.inkMuted }}>
                  Comparison Result (from n8n)
                </div>

                {(tokenRemovals.length > 0 || tokenAdditions.length > 0) && (
                  <div className="space-y-2">
                    {tokenRemovals.length > 0 && (
                      <div>
                        <div className="text-xs mb-1" style={{ color: THEME.inkMuted }}>Removed (red):</div>
                        <div className="flex flex-wrap gap-1">
                          {tokenRemovals.slice(0, 120).map((w, i) => (
                            <span key={`rem-${i}`} className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 text-xs">{w}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {tokenAdditions.length > 0 && (
                      <div>
                        <div className="text-xs mb-1" style={{ color: THEME.inkMuted }}>Added (green):</div>
                        <div className="flex flex-wrap gap-1">
                          {tokenAdditions.slice(0, 120).map((w, i) => (
                            <span key={`add-${i}`} className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 border border-green-200 text-xs">{w}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="rounded border p-2" style={{ borderColor: THEME.border, background: "#fff" }}>
                  {compareReport == null ? (
                    <div className="text-sm" style={{ color: THEME.inkMuted }}>No report yet. Click <b>Compare</b>.</div>
                  ) : (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: toPrettyHtml(
                        typeof reportText === "string" ? reportText : JSON.stringify(compareReport, null, 2)
                      )}}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ToolRiskApi = () => {
    const pretty =
      typeof riskRaw === "string"
        ? riskRaw
        : (riskRaw?.report || riskRaw?.summary || riskRaw?.text || riskRaw?.plain || riskRaw?.markdown || "");
    return (
      <div className="grid grid-cols-2 gap-4 h-full">
        <div className="rounded-lg border flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface }}>
          <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: THEME.border }}>
            <div className="text-xs" style={{ color: THEME.inkMuted }}>Upload PDF</div>
            <label className="text-xs rounded px-2 py-1 cursor-pointer" style={{ background: THEME.sand400 }}>
              Upload
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => setRiskFile(e.target.files?.[0] ?? null)} />
            </label>
          </div>
          <div className="flex-1 grid place-items-center text-sm" style={{ color: THEME.inkMuted }}>
            {riskFile ? <div className="px-3 text-center">Selected: <b>{riskFile.name}</b></div> : "No file selected"}
          </div>
        </div>

        <div className="rounded-lg border flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface }}>
          <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: THEME.border }}>
            <div className="text-xs" style={{ color: THEME.inkMuted }}>Risk Analysis (API)</div>
            <div className="flex items-center gap-2">
              <button
                onClick={runRiskApi}
                disabled={!riskFile || riskLoading}
                className="text-xs rounded px-2 py-1 inline-flex items-center gap-1 disabled:opacity-60"
                style={{ background: THEME.sand400 }}
              >
                {riskLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Analyse"}
              </button>
              
              <button
                onClick={() => riskPanelRef.current && downloadPDFFromNode("risk-report.pdf", riskPanelRef.current)}
                className="text-xs rounded px-2 py-1"
                style={{ background: "#fff", color: THEME.teal700, border: `1px solid ${THEME.border}` }}
              >
                <Download className="h-3.5 w-3.5" /> Download PDF
              </button>
            </div>
          </div>

          <div className="p-3 overflow-auto text-sm space-y-3" ref={riskPanelRef}>
            {riskError && (
              <div className="rounded border p-2" style={{ borderColor: THEME.border, color: "#b91c1c", background: "#fee2e2" }}>
                <b>Error:</b> {riskError}
              </div>
            )}
            {riskLoading && (
              <div className="flex items-center gap-2 text-[13px]" style={{ color: THEME.inkMuted }}>
                <Loader2 className="h-4 w-4 animate-spin" /> Running risk analysis…
              </div>
            )}
            {!riskLoading && (
              <div className="rounded border p-2" style={{ borderColor: THEME.border, background: "#fff" }}>
                {riskRaw == null ? (
                  <div className="text-sm" style={{ color: THEME.inkMuted }}>No result yet. Click <b>Analyse</b>.</div>
                ) : (
                  <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: toPrettyHtml(
                    typeof pretty === "string" ? pretty : JSON.stringify(riskRaw, null, 2)
                  )}} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

const ToolCompliance = () => {
  const pretty =
    typeof compResult === "string"
      ? compResult
      : (compResult?.report || compResult?.summary || compResult?.text || compResult?.plain || compResult?.markdown || "");

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Left: Form Section */}
      <div className="rounded-lg border flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface }}>
        <div className="px-3 py-2 border-b text-xs" style={{ borderColor: THEME.border, color: THEME.inkMuted }}>
          Document Authenticity / Compliance
        </div>
        <div className="p-3 space-y-3">
          {/* Form Inputs - NOW WITH SELECT DROPDOWNS */}
          <div className="grid grid-cols-3 gap-3">
            {/* Regulation Dropdown */}
            <div>
              <div className="text-[11px] mb-1" style={{ color: THEME.inkMuted }}>Regulation</div>
              <select
                className="w-full text-sm border rounded px-2 py-1"
                style={{ borderColor: THEME.border }}
                value={compliance.Regulation}
                onChange={(e) => setCompliance((p) => ({ ...p, Regulation: e.target.value }))}
              >
                <option value="Wages & Remuneration">Wages & Remuneration</option>
                <option value="Social Security">Social Security</option>
                <option value="Industrial Relations">Industrial Relations</option>
                <option value="Working Conditions">Working Conditions</option>
                <option value="Health & Safety">Health & Safety</option>
                <option value="Women & Child Labour">Women & Child Labour</option>
                <option value="Employment & Training">Employment & Training</option>
                <option value="State-Specific Laws">State-Specific Laws</option>
              </select>
            </div>

            {/* Country Dropdown - Default India */}
            <div>
              <div className="text-[11px] mb-1" style={{ color: THEME.inkMuted }}>Country</div>
              <select
                className="w-full text-sm border rounded px-2 py-1"
                style={{ borderColor: THEME.border }}
                value={compliance.Country}
                onChange={(e) => setCompliance((p) => ({ ...p, Country: e.target.value }))}
              >
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="UAE">UAE</option>
                <option value="Singapore">Singapore</option>
                <option value="Australia">Australia</option>
                <option value="Canada">Canada</option>
              </select>
            </div>

            {/* Company Type Dropdown */}
            <div>
              <div className="text-[11px] mb-1" style={{ color: THEME.inkMuted }}>Company Type</div>
              <select
                className="w-full text-sm border rounded px-2 py-1"
                style={{ borderColor: THEME.border }}
                value={compliance.CompanyType}
                onChange={(e) => setCompliance((p) => ({ ...p, CompanyType: e.target.value }))}
              >
                <option value="Private Limited Company">Private Limited Company</option>
                <option value="Public Limited Company">Public Limited Company</option>
                <option value="Limited Liability Partnership (LLP)">LLP</option>
                <option value="One Person Company (OPC)">One Person Company</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership Firm">Partnership Firm</option>
                <option value="Section 8 Company (Non-Profit)">Section 8 Company</option>
                <option value="Foreign Company">Foreign Company</option>
                <option value="Small Company">Small Company</option>
                <option value="Startup (DPIIT)">Startup</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={runCompliance}
              disabled={compLoading}
              className="text-xs rounded px-2 py-1 inline-flex items-center gap-1 disabled:opacity-60"
              style={{ background: THEME.sand400 }}
            >
              {compLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              Analyse
            </button>
            
            <button
              onClick={() => compPanelRef.current && downloadPDFFromNode("auth-compliance.pdf", compPanelRef.current)}
              className="text-xs rounded px-2 py-1"
              style={{ background: "#fff", color: THEME.teal700, border: `1px solid ${THEME.border}` }}
            >
              <Download className="h-3.5 w-3.5" /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Right: Result Section */}
      <div className="rounded-lg border flex flex-col overflow-hidden" style={{ borderColor: THEME.border, background: THEME.surface }}>
        <div className="px-3 py-2 border-b text-xs" style={{ borderColor: THEME.border, color: THEME.inkMuted }}>
          Result
        </div>
        <div className="p-3 space-y-2 text-sm overflow-auto" ref={compPanelRef}>
          {compError && (
            <div className="rounded border p-2" style={{ borderColor: THEME.border, color: "#b91c1c", background: "#fee2e2" }}>
              <b>Error:</b> {compError}
            </div>
          )}
          {compLoading ? (
            <div className="flex items-center gap-2 text-[13px]" style={{ color: THEME.inkMuted }}>
              <Loader2 className="h-4 w-4 animate-spin" /> Checking authenticity/compliance…
            </div>
          ) : compResult == null ? (
            <div style={{ color: THEME.inkMuted }}>No report yet. Click <b>Analyse</b>.</div>
          ) : (
            <div className="rounded border p-2 bg-white" style={{ borderColor: THEME.border }}>
              <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: toPrettyHtml(
                typeof pretty === "string" ? pretty : JSON.stringify(compResult, null, 2)
              )}} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


  const ToolTranslate = () => (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="rounded-lg border flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface }}>
        <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: THEME.border }}>
          <div className="text-xs" style={{ color: THEME.inkMuted }}>Original</div>
          <div className="flex items-center gap-2">
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="text-xs border rounded px-2 py-1" style={{ borderColor: THEME.border }}>
              {Object.keys(DEMO_TRANSLATIONS).map((l) => <option key={l}>{l}</option>)}
            </select>
            <button onClick={translateAll} className="text-xs rounded px-2 py-1 inline-flex items-center gap-1" style={{ background: THEME.sand400 }}>
              {translating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Languages className="h-3.5 w-3.5" />} Translate
            </button>
          </div>
        </div>
        <textarea className="flex-1 p-3 outline-none text-sm" value={original} onChange={(e) => setOriginal(e.target.value)} style={{ color: THEME.ink, background: THEME.surface }} />
      </div>

      <div className="rounded-lg border flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface }}>
        <div className="px-3 py-2 border-b text-xs" style={{ borderColor: THEME.border, color: THEME.inkMuted }}>{lang} Translation</div>
        <div className="p-3 text-sm whitespace-pre-wrap">{translated || "— Translations will appear here —"}</div>
      </div>
    </div>
  );

  const ToolSearch = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [original, setOriginal] = useState("");
  const [searching, setSearching] = useState(false);

  async function runSearch() {
    setResults([]);
    setSearching(true);
    try {
      const form = new FormData();
      form.append("file1", pdfFile);
      form.append("query", query);
      const res = await fetch(
        "https://n8n.srv983857.hstgr.cloud/webhook/smart-search",
        { method: "POST", body: form }
      );
      const ctype = res.headers.get("content-type");
      const data = ctype?.includes("application/json")
        ? await res.json()
        : await res.text();
      setResults(Array.isArray(data) ? data : [{ snippet: data }]);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      <div className="rounded-lg border flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface }}>
        {/* File upload box */}
        <div className="flex flex-col gap-2 px-3 py-2 border-b" style={{ borderColor: THEME.border }}>
          <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} />
          {pdfFile && <div className="text-xs mt-1">Selected: {pdfFile.name}</div>}
          <input
            className="w-full pl-8 pr-20 py-2 rounded border text-sm mt-2"
            placeholder='Search: "Termination clause"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ borderColor: THEME.border }}
          />
          <button onClick={runSearch}
            disabled={!pdfFile || !query || searching}
            className="p-1 mt-1 rounded border"
            style={{ borderColor: THEME.border }}>
            {searching ? "Searching..." : "Run Search"}
          </button>
        </div>
        <textarea className="flex-1 p-3 outline-none text-sm" value={original} onChange={e => setOriginal(e.target.value)} style={{ background: THEME.surface, color: THEME.ink }} />
      </div>
      {/* Results */}
      <div className="rounded-lg border flex flex-col overflow-hidden" style={{ borderColor: THEME.border, background: THEME.surface }}>
        <div className="px-3 py-2 border-b text-xs" style={{ borderColor: THEME.border, color: THEME.inkMuted }}>Results</div>
        <div className="p-3 space-y-2 text-sm overflow-auto">
          {results.length === 0 ? (
            <div style={{ color: THEME.inkMuted }}>No results found</div>
          ) : (
            results.map((r, i) => (
              <div key={i} className="rounded border p-2 flex items-center justify-between" style={{ borderColor: THEME.border }}>
                <div>
                  <div className="text-xs" style={{ color: THEME.inkMuted }}>
                    {r.page ? `Found in: Clause ${r.page} | Page ${r.page}` : ""}
                  </div>
                  <div className="mt-1">{r.snippet}</div>
                </div>
                <button className="text-xs rounded px-2 py-1" style={{ background: THEME.mint200, color: THEME.teal700, border: `1px solid ${THEME.border}` }}>
                  View
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};


  const BottomStrip = () => (
    <div className="border-t" style={{ borderColor: THEME.border, background: THEME.surface }}>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setBottomTab("assistant")}
            className={clsx("text-xs px-2 py-1 rounded border", bottomTab === "assistant" ? "bg-white" : "")}
            style={{ borderColor: THEME.border }}
          >
            AI Persona
          </button>
          <button
            onClick={() => setBottomTab("insights")}
            className={clsx("text-xs px-2 py-1 rounded border", bottomTab === "insights" ? "bg-white" : "")}
            style={{ borderColor: THEME.border }}
          >
            Quick Insights
          </button>
        </div>
        <button onClick={() => setBottomOpen((v) => !v)} className="text-xs rounded px-2 py-1" style={{ background: THEME.sand400 }}>
          {bottomOpen ? "Hide" : "Show"}
        </button>
      </div>
      <AnimatePresence>
        {bottomOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 180, opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="h-[180px] p-3 text-sm" style={{ color: THEME.ink }}>
              {bottomTab === "assistant" ? (
                <div className="space-y-2">
                  <div className="text-xs" style={{ color: THEME.inkMuted }}>Assistant</div>
                  <div className="rounded border p-2" style={{ borderColor: THEME.border }}>
                    Try: “Summarize Section 7 in 3 bullets.”
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs" style={{ color: THEME.inkMuted }}>Quick Insights</div>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Shorter termination period found (15 vs 30 days).</li>
                    <li>Watch liability cap language in Section 10.3.</li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // ---------- layout ----------
  return (
    <div className="h-screen w-full flex flex-col" style={{ background: THEME.bg, color: THEME.ink }}>
      <Header />
      <div className="flex-1 grid" style={{ gridTemplateColumns: "280px 1fr" }}>
        <Sidebar />
        <div className="h-full p-4">
          <div className="h-[calc(100%-180px)]">
            {activeTool === "compare" && <ToolCompare />}
            {activeTool === "riskApi" && <ToolRiskApi />}
            {activeTool === "translate" && <ToolTranslate />}
            {activeTool === "search" && <ToolSearch />}
            {activeTool === "compliance" && <ToolCompliance />}
          </div>
          <BottomStrip />
        </div>
      </div>
    </div>
  );
}
