import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download, FileSearch2, Languages, ShieldCheck, GitCompare,
  Loader2, ChevronUp, ChevronDown, FileWarning
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// import Navbar from '../components/Navbar';

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

const N8N_COMPARE_ENDPOINT = "https://n8n.srv983857.hstgr.cloud/webhook/a027ab82-e53c-4246-9982-c41c79ac9bca";
const N8N_COMPLIANCE_ENDPOINT = "https://n8n.srv983857.hstgr.cloud/webhook/compliance";
const N8N_RISK_ENDPOINT = "https://n8n.srv983857.hstgr.cloud/webhook/32c4f30e-6722-4125-bd7d-691f0e9460e4";

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

function cleanStars(text) {
  if (!text) return "";
  let t = String(text);
  t = t.replace(/\*\*/g, "");
  t = t.replace(/^\s*\*+\s?/gm, "");
  t = t.replace(/^\s*-{3,}\s*$/gm, "");
  t = t.replace(/\n{3,}/g, "\n\n");
  return t.trim();
}

const escapeHtml = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

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
    const maybeHeading = blk.length === 1 && !/^\s*[-•]\s+/.test(blk[0]) && 
      (/[.:]$/.test(blk[0].trim()) || /^[A-Z0-9 \-/]+$/.test(blk[0].trim()));

    if (maybeHeading) {
      html += `<h4 class="font-semibold text-[13px] uppercase tracking-wide mb-1">${escapeHtml(blk[0].replace(/[.:]$/, ""))}</h4>`;
    } else if (allBullets) {
      html += `<ul class="list-disc pl-5 space-y-1 text-[13px]">`;
      blk.forEach((l) => (html += `<li>${escapeHtml(l.replace(/^\s*[-•]\s+/, ""))}</li>`));
      html += `</ul>`;
    } else {
      html += `<p class="text-[13px] whitespace-pre-wrap">${escapeHtml(blk.join("\n"))}</p>`;
    }
    html += `<div class="h-2"></div>`;
  });
  return html || `<div class="text-[13px] opacity-60">— No content —</div>`;
}

export default function DocumentAnalysisWorkspace() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTool, setActiveTool] = useState("compare");
  const [bottomOpen, setBottomOpen] = useState(true);
  const [bottomTab, setBottomTab] = useState("assistant");

  // Compare state
  const [firstStaticUrl, setFirstStaticUrl] = useState("/contract1.pdf");
  const [firstPdfFile, setFirstPdfFile] = useState(null);
  const [firstPdfPreviewUrl, setFirstPdfPreviewUrl] = useState(null);
  const [secondPdfFile, setSecondPdfFile] = useState(null);
  const [secondPdfPreviewUrl, setSecondPdfPreviewUrl] = useState(null);
  const [isComparing, setIsComparing] = useState(false);
  const [compareReport, setCompareReport] = useState(null);
  const [compareError, setCompareError] = useState("");
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

      setCompareReport(data);
    } catch (e) {
      setCompareError(e?.message || String(e));
    } finally {
      setIsComparing(false);
    }
  }

  // Tab Navigation Component
  const TabNavigation = () => {
    const tabs = [
      { id: "compare", label: "Document Comparison", icon: GitCompare },
      { id: "riskApi", label: "Risk Analysis", icon: FileWarning },
      { id: "translate", label: "Translation", icon: Languages },
      { id: "search", label: "Smart Search", icon: FileSearch2 },
      { id: "compliance", label: "Authenticity", icon: ShieldCheck },
    ];

    return (
      <div 
        className="border-b px-4 py-3 overflow-x-auto"
        style={{ borderColor: THEME.border, background: THEME.surface }}
      >
        <div className="flex gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTool === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTool(tab.id)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  isActive 
                    ? "shadow-md" 
                    : "hover:shadow-sm"
                )}
                style={{
                  color: isActive ? "#fff" : THEME.ink,
                  background: isActive 
                    ? `linear-gradient(135deg, ${THEME.sand400}, ${THEME.sand500})` 
                    : THEME.bg,
                  border: `1px solid ${isActive ? THEME.sand400 : THEME.border}`,
                }}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Compare Tool Component
  const ToolCompare = () => {
    const firstHasUpload = !!firstPdfPreviewUrl;
    const reportText = typeof compareReport === "string" 
      ? compareReport 
      : (compareReport?.report || compareReport?.summary || compareReport?.text || "");

    return (
      <div className="h-full grid grid-cols-2 gap-4 p-4">
        {/* LEFT SIDE - Documents */}
        <div className="flex flex-col gap-4">
          {/* First Document */}
          <div className="rounded-lg border flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface, height: 'calc(50% - 8px)' }}>
            <div className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0" style={{ borderColor: THEME.border }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium" style={{ color: THEME.inkMuted }}>First Document</span>
                <span className="text-[11px] italic" style={{ color: THEME.inkMuted }}>
                  {firstHasUpload ? "Uploaded" : "URL"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  className="text-xs border rounded px-2 py-1 w-48"
                  placeholder="/contract1.pdf"
                  value={firstStaticUrl}
                  onChange={(e) => setFirstStaticUrl(e.target.value)}
                  style={{ borderColor: THEME.border }}
                />
                <label className="text-xs rounded px-2 py-1 cursor-pointer hover:opacity-80 transition-opacity" style={{ background: THEME.sand400, color: "#fff" }}>
                  Upload
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => setFirstPdfFile(e.target.files?.[0] ?? null)}
                  />
                </label>
                {firstPdfFile && (
                  <button 
                    className="text-[11px] px-2 py-1 rounded border hover:bg-gray-50" 
                    style={{ borderColor: THEME.border }} 
                    onClick={() => setFirstPdfFile(null)}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 min-h-0">
              {firstPdfPreviewUrl ? (
                <iframe title="first-uploaded" src={firstPdfPreviewUrl} className="w-full h-full" />
              ) : firstStaticUrl ? (
                <iframe title="first-static" src={firstStaticUrl} className="w-full h-full" />
              ) : (
                <div className="grid place-items-center h-full text-sm" style={{ color: THEME.inkMuted }}>
                  Provide URL or upload PDF
                </div>
              )}
            </div>
          </div>

          {/* Second Document */}
          <div className="rounded-lg border flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface, height: 'calc(50% - 8px)' }}>
            <div className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0" style={{ borderColor: THEME.border }}>
              <span className="text-xs font-medium" style={{ color: THEME.inkMuted }}>Second Document</span>
              <label className="text-xs rounded px-2 py-1 cursor-pointer hover:opacity-80 transition-opacity" style={{ background: THEME.sand400, color: "#fff" }}>
                Upload
                <input 
                  type="file" 
                  accept="application/pdf" 
                  className="hidden" 
                  onChange={(e) => setSecondPdfFile(e.target.files?.[0] ?? null)} 
                />
              </label>
            </div>
            <div className="flex-1 min-h-0">
              {secondPdfPreviewUrl ? (
                <iframe title="second-uploaded" src={secondPdfPreviewUrl} className="w-full h-full" />
              ) : (
                <div className="grid place-items-center h-full text-sm" style={{ color: THEME.inkMuted }}>
                  Upload PDF to compare
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Results */}
        <div className="rounded-lg border flex flex-col" style={{ borderColor: THEME.border, background: THEME.surface }}>
          <div className="flex items-center justify-between px-3 py-2 border-b flex-shrink-0" style={{ borderColor: THEME.border }}>
            <button
              onClick={performCompare}
              disabled={(!firstPdfFile && !firstStaticUrl) || !secondPdfFile || isComparing}
              className="inline-flex items-center gap-1 text-xs rounded px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity text-white"
              style={{ background: THEME.sand400 }}
            >
              {isComparing ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Comparing...
                </>
              ) : (
                "Compare Documents"
              )}
            </button>

            {compareReport && (
              <button
                onClick={() => comparePanelRef.current && downloadPDFFromNode("compare-report.pdf", comparePanelRef.current)}
                className="inline-flex items-center gap-1 text-xs rounded px-3 py-1.5 hover:opacity-90 transition-opacity"
                style={{ background: "#fff", color: THEME.teal700, border: `1px solid ${THEME.border}` }}
              >
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
            )}
          </div>

          <div className="flex-1 p-4 overflow-auto text-sm" ref={comparePanelRef}>
            {compareError && (
              <div className="rounded border p-3 mb-3" style={{ borderColor: "#fecaca", color: "#b91c1c", background: "#fee2e2" }}>
                <strong>Error:</strong> {compareError}
              </div>
            )}

            {isComparing && (
              <div className="flex items-center gap-2 justify-center py-8" style={{ color: THEME.inkMuted }}>
                <Loader2 className="h-5 w-5 animate-spin" /> 
                <span>Analyzing documents...</span>
              </div>
            )}

            {!isComparing && compareReport && (
              <div className="rounded border p-4" style={{ borderColor: THEME.border, background: "#fff" }}>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: toPrettyHtml(reportText || JSON.stringify(compareReport, null, 2))
                  }}
                />
              </div>
            )}

            {!isComparing && !compareReport && !compareError && (
              <div className="flex items-center justify-center h-full" style={{ color: THEME.inkMuted }}>
                <div className="text-center">
                  <GitCompare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Upload documents and click Compare</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Placeholder components for other tools
  const ToolRiskApi = () => (
    <div className="h-full flex items-center justify-center p-4" style={{ color: THEME.inkMuted }}>
      <div className="text-center">
        <FileWarning className="h-16 w-16 mx-auto mb-4 opacity-30" />
        <h3 className="text-lg font-semibold mb-2" style={{ color: THEME.ink }}>Risk Analysis Tool</h3>
        <p className="text-sm">Upload a PDF for risk analysis</p>
      </div>
    </div>
  );

  const ToolTranslate = () => (
    <div className="h-full flex items-center justify-center p-4" style={{ color: THEME.inkMuted }}>
      <div className="text-center">
        <Languages className="h-16 w-16 mx-auto mb-4 opacity-30" />
        <h3 className="text-lg font-semibold mb-2" style={{ color: THEME.ink }}>Translation Tool</h3>
        <p className="text-sm">Translate documents to multiple languages</p>
      </div>
    </div>
  );

  const ToolSearch = () => (
    <div className="h-full flex items-center justify-center p-4" style={{ color: THEME.inkMuted }}>
      <div className="text-center">
        <FileSearch2 className="h-16 w-16 mx-auto mb-4 opacity-30" />
        <h3 className="text-lg font-semibold mb-2" style={{ color: THEME.ink }}>Smart Search Tool</h3>
        <p className="text-sm">Search across documents intelligently</p>
      </div>
    </div>
  );

  const ToolCompliance = () => (
    <div className="h-full flex items-center justify-center p-4" style={{ color: THEME.inkMuted }}>
      <div className="text-center">
        <ShieldCheck className="h-16 w-16 mx-auto mb-4 opacity-30" />
        <h3 className="text-lg font-semibold mb-2" style={{ color: THEME.ink }}>Authenticity Checker</h3>
        <p className="text-sm">Verify document authenticity and compliance</p>
      </div>
    </div>
  );

  // Bottom Strip Component
  const BottomStrip = () => (
    <div className="border-t" style={{ borderColor: THEME.border, background: THEME.surface }}>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setBottomTab("assistant")}
            className={clsx(
              "text-xs px-3 py-1.5 rounded transition-all",
              bottomTab === "assistant" 
                ? "bg-white shadow-sm font-medium" 
                : "hover:bg-white/50"
            )}
            style={{ color: THEME.ink }}
          >
            AI Assistant
          </button>
          <button
            onClick={() => setBottomTab("insights")}
            className={clsx(
              "text-xs px-3 py-1.5 rounded transition-all",
              bottomTab === "insights" 
                ? "bg-white shadow-sm font-medium" 
                : "hover:bg-white/50"
            )}
            style={{ color: THEME.ink }}
          >
            Quick Insights
          </button>
        </div>
        <button 
          onClick={() => setBottomOpen((v) => !v)} 
          className="text-xs rounded px-3 py-1.5 hover:opacity-80 transition-opacity inline-flex items-center gap-1" 
          style={{ background: THEME.sand400, color: "#fff" }}
        >
          {bottomOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
          {bottomOpen ? "Hide" : "Show"}
        </button>
      </div>
      <AnimatePresence>
        {bottomOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: 140, opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="h-[140px] p-4 text-sm border-t" style={{ color: THEME.ink, borderColor: THEME.border }}>
              {bottomTab === "assistant" ? (
                <div className="space-y-2">
                  <div className="text-xs font-medium" style={{ color: THEME.inkMuted }}>AI Assistant</div>
                  <div className="rounded border p-3 text-xs" style={{ borderColor: THEME.border, background: THEME.bg }}>
                    <p style={{ color: THEME.inkMuted }}>Try: "Summarize Section 7 in 3 bullets"</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs font-medium" style={{ color: THEME.inkMuted }}>Quick Insights</div>
                  <ul className="list-disc pl-5 space-y-1 text-xs" style={{ color: THEME.ink }}>
                    <li>Shorter termination period found (15 vs 30 days)</li>
                    <li>Watch liability cap language in Section 10.3</li>
                    <li>Confidentiality scope has been expanded</li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // MAIN LAYOUT - ALIGNED WITH NAVBAR SIDEBAR
  return (
    <>
      {/* Navbar Sidebar */}
      {/* <Navbar collapsed={collapsed} setCollapsed={setCollapsed} /> */}
      
      {/* Main Content - Offset by Navbar */}
      <div 
        className="h-screen flex flex-col overflow-hidden transition-all duration-300"
        style={{ 
          marginLeft: collapsed ? '80px' : '288px', // w-20 = 80px, w-72 = 288px
          background: THEME.bg, 
          color: THEME.ink 
        }}
      >
        {/* Tab Navigation at Top */}
        <TabNavigation />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Tool Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {activeTool === "compare" && <ToolCompare />}
            {activeTool === "riskApi" && <ToolRiskApi />}
            {activeTool === "translate" && <ToolTranslate />}
            {activeTool === "search" && <ToolSearch />}
            {activeTool === "compliance" && <ToolCompliance />}
          </div>
          
          {/* Bottom Strip */}
          <BottomStrip />
        </div>
      </div>
    </>
  );
}
