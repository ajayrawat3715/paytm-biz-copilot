import { useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { shopInfo } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  Banknote,
  CheckCircle2,
  Clock,
  Copy,
  HeartHandshake,
  MessageSquare,
  Moon,
  QrCode,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

interface EveningReconciliationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EveningReconciliationModal({
  open,
  onOpenChange,
}: EveningReconciliationModalProps) {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const dateStr = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const whatsappReceipt = `🏪 ${shopInfo.name} — ${isHindi ? "दुकान बंदी हिसाब" : "Evening Day-End Close"} (${dateStr})
━━━━━━━━━━━━━━━━━━━━━━━
💰 ${isHindi ? "कुल काउंटर बिक्री:" : "Total Sales:"} ₹18,420
📱 ${isHindi ? "पेटीएम साउंडबॉक्स UPI:" : "Paytm Soundbox UPI:"} ₹12,840 (126 ${isHindi ? "बिल" : "txns"})
💵 ${isHindi ? "गल्ला नकद:" : "Cash in Drawer:"} ₹5,580
📒 ${isHindi ? "उधार वसूली:" : "Credit Recovered:"} ₹800 | ${isHindi ? "नया उधार:" : "New Credit:"} ₹1,200
━━━━━━━━━━━━━━━━━━━━━━━
✨ ${isHindi ? "शुद्ध दैनिक मुनाफा (Net Profit):" : "Net Day Profit:"} ₹3,420
✅ ${isHindi ? "कैश मिलान:" : "Audit:"} 100% Match (₹0 Variance)
━━━━━━━━━━━━━━━━━━━━━━━
🌙 ${isHindi ? "कल सुबह 8:30 बजे शर्मा डिस्ट्रीब्यूटर्स से पारले-जी स्टॉक आएगा।" : "Tomorrow: Parle-G restock arriving at 8:30 AM from Sharma."}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(whatsappReceipt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl rounded-[26px] bg-paper p-6 shadow-2xl ring-1 ring-line text-ink sm:p-7 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-slate-900 text-amber-300 shadow-sm">
              <Moon className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-ink sm:text-lg">
                {t.dukanBandiTitle}
              </h3>
              <p className="text-xs text-inksoft">{t.dukanBandiSub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="size-7 rounded-full bg-sand hover:bg-sand/80 grid place-items-center text-xs font-bold text-ink transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 100% Reconciled Verification Stamp */}
        <div className="mt-4 rounded-2xl bg-emerald/10 p-3.5 ring-1 ring-emerald/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-emerald" />
            <div>
              <p className="font-display text-sm font-bold text-emerald">
                {isHindi ? "✓ शून्य कैश अंतर — 100% सटीक हिसाब" : "✓ ₹0 Variance — 100% Perfect Cash Match"}
              </p>
              <p className="text-[11px] text-inksoft">
                {isHindi
                  ? "काउंटर गल्ला और पेटीएम साउंडबॉक्स बैंक सेटलमेंट पूरी तरह से मेल खाते हैं"
                  : "Physical cash in drawer perfectly matches register slips and bank settlement"}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald text-white px-3 py-1 text-[10px] font-bold">
            {isHindi ? "सत्यापित" : "VERIFIED"}
          </span>
        </div>

        {/* The 4-Pillar Daily Close Math */}
        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          {/* Cash In Drawer */}
          <div className="rounded-xl bg-sand/30 p-3.5 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-inksoft">{isHindi ? "1. गल्ला भौतिक नकद" : "1. Physical Cash"}</span>
              <Banknote className="size-3.5 text-amber-600" />
            </div>
            <p className="font-display text-xl font-bold text-ink mt-1">₹5,580</p>
            <p className="text-[10px] text-inksoft mt-0.5">42 {isHindi ? "नकद लेनदेन" : "cash transactions"}</p>
          </div>

          {/* Paytm Soundbox UPI */}
          <div className="rounded-xl bg-[#002e6e]/5 p-3.5 ring-1 ring-[#002e6e]/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[#002e6e] font-semibold">{isHindi ? "2. पेटीएम साउंडबॉक्स UPI" : "2. Paytm Soundbox UPI"}</span>
              <QrCode className="size-3.5 text-[#002e6e]" />
            </div>
            <p className="font-display text-xl font-bold text-[#002e6e] mt-1">₹12,840</p>
            <p className="text-[10px] text-inksoft mt-0.5">126 {isHindi ? "साउंडबॉक्स पुष्टि बिल" : "settled payments"}</p>
          </div>

          {/* Udhaar Ledger Activity */}
          <div className="rounded-xl bg-sand/30 p-3.5 ring-1 ring-line">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-inksoft">{isHindi ? "3. उधार गतिविधि" : "3. Credit Movement"}</span>
              <Wallet className="size-3.5 text-inksoft" />
            </div>
            <p className="font-display text-lg font-bold text-ink mt-1">
              +₹800 <span className="text-xs text-inksoft font-normal">/ -₹1,200</span>
            </p>
            <p className="text-[10px] text-inksoft mt-0.5">
              {isHindi ? "वसूली ₹800 · नया उधार ₹1,200" : "Recovered ₹800 · New credit ₹1.2k"}
            </p>
          </div>

          {/* Net Profit */}
          <div className="rounded-xl bg-emerald/10 p-3.5 ring-1 ring-emerald/30 border border-emerald/20">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-emerald font-bold">{isHindi ? "4. आज का शुद्ध मुनाफा" : "4. Net Day Profit"}</span>
              <TrendingUp className="size-3.5 text-emerald" />
            </div>
            <p className="font-display text-xl font-bold text-emerald mt-1">₹3,420</p>
            <p className="text-[10px] text-emerald/80 font-semibold mt-0.5">
              18.6% {isHindi ? "शुद्ध मार्जिन" : "net counter margin"}
            </p>
          </div>
        </div>

        {/* WhatsApp Closing Sheet Preview */}
        <div className="mt-5 rounded-2xl bg-sand/40 p-4 ring-1 ring-line">
          <div className="flex items-center justify-between pb-2 border-b border-line/60">
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-[#25D366]" />
              <span className="text-xs font-bold text-ink">
                {isHindi ? "व्हाट्सएप दुकान बंदी रसीद:" : "Shareable WhatsApp Closing Slip:"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded-full bg-paper px-2.5 py-1 text-[10px] font-semibold text-ink ring-1 ring-line hover:bg-sand"
              >
                <Copy className="size-3" />
                <span>{copied ? (isHindi ? "कॉपी हुआ!" : "Copied!") : (isHindi ? "कॉपी" : "Copy")}</span>
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1 rounded-full bg-[#25D366] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm hover:bg-[#20bd5a]"
              >
                <Share2 className="size-3" />
                <span>{shared ? (isHindi ? "साझा किया!" : "Shared!") : (isHindi ? "साझा करें" : "Share")}</span>
              </button>
            </div>
          </div>

          <pre className="mt-2.5 whitespace-pre-wrap font-mono text-[11px] text-ink leading-relaxed bg-paper/80 p-3 rounded-xl ring-1 ring-line/50">
            {whatsappReceipt}
          </pre>
        </div>

        {/* AI Night Briefing & Tomorrow Preparation */}
        <div className="mt-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 p-4 text-white shadow-md">
          <div className="flex items-start gap-2.5">
            <Sparkles className="size-4 text-amber-300 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-300">
                {isHindi ? "भारत एआई रात्रि संदेश (कल की तैयारी):" : "Bharat AI Night Brief (Tomorrow's Outlook):"}
              </p>
              <p className="mt-1 text-xs text-white/90 leading-relaxed">
                {isHindi
                  ? "आज शाम आपने 10% ऑफर और उधार वसूली से ₹10,700 के अवसरों में से ₹3,420 का शुद्ध लाभ सुरक्षित किया। कल सुबह 8:30 बजे शर्मा डिस्ट्रीब्यूटर्स से पारले-जी का रीऑर्डर (24 पैकेट) पहुंचेगा। कल बुधवार को शाम की बिक्री 14% अधिक रहने का अनुमान है।"
                  : "Excellent day, Ramesh. You captured ₹3,420 net profit today. Your 24-unit Parle-G order will be delivered by Sharma Distributors at 8:30 AM tomorrow. Wednesday evening counter traffic is forecasted to be 14% heavier."}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-5 flex items-center justify-end gap-2 border-t border-line pt-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-rust px-6 py-2 text-xs font-bold text-cream hover:bg-rust/90 shadow-md active:scale-95 transition-all"
          >
            {isHindi ? "दुकान बंदी पूर्ण करें" : "Close Shop & Settle Day"}
          </button>
        </div>
      </div>
    </div>
  );
}
