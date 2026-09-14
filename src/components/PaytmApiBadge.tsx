import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import {
  Code2,
  Cpu,
  Info,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export type PaytmIntegrationType = "forecast" | "upi_insights" | "soundbox" | "pulse";

interface PaytmApiMeta {
  titleEn: string;
  titleHi: string;
  taglineEn: string;
  taglineHi: string;
  apiTag: string;
  endpoints: Array<{ method: "GET" | "POST" | "MQTT" | "STREAM"; path: string }>;
  pipelineEn: string[];
  pipelineHi: string[];
  businessImpactEn: string;
  businessImpactHi: string;
}

const PAYTM_INTEGRATIONS: Record<PaytmIntegrationType, PaytmApiMeta> = {
  forecast: {
    titleEn: "Paytm Velocity Forecast Engine",
    titleHi: "पेटीएम वेलोसिटी पूर्वानुमान इंजन",
    taglineEn: "30-day settlement run-rate + local footfall regression",
    taglineHi: "30-दिन का सेटलमेंट रन-रेट व फुटफॉल रिग्रेशन",
    apiTag: "Paytm Merchant Analytics API v2",
    endpoints: [
      { method: "GET", path: "/v2/merchant/settlement/history/runrate" },
      { method: "POST", path: "/v1/merchant/analytics/velocity" },
    ],
    pipelineEn: [
      "Aggregates 30-day rolling hourly settlement data from Paytm QR & POS terminals.",
      "Calculates day-of-week sales velocity against local neighborhood footfall trends.",
      "Detects morning shortfall by 9:00 AM and generates high-margin margin clearance actions.",
    ],
    pipelineHi: [
      "पेटीएम क्यूआर और पीओएस से 30 दिनों के प्रति घंटा सेटलमेंट डेटा का विश्लेषण करता है।",
      "इलाके के फुटफॉल ट्रेंड के साथ दिन-वार बिक्री गति (वेलोसिटी) की गणना करता है।",
      "सुबह 9:00 बजे तक अनुमानित कमी का पता लगाकर डिस्काउंट व क्लीयरेंस एक्शन सुझाता है।",
    ],
    businessImpactEn:
      "Gives store owners institutional-grade demand forecasting, boosting daily Paytm for Business engagement.",
    businessImpactHi:
      "किराना मालिकों को बड़े सुपरमार्केट जैसी सटीक मांग का पूर्वानुमान प्रदान करता है।",
  },

  upi_insights: {
    titleEn: "Paytm UPI Intelligence & Customer Retention",
    titleHi: "पेटीएम यूपीआई एनालिटिक्स व ग्राहक सुरक्षा",
    taglineEn: "Basket size premium + dormant VIP identification",
    taglineHi: "बड़ा बिल साइज + गैर-हाजिर वीआईपी ग्राहक अलर्ट",
    apiTag: "Paytm Merchant Insights & EDI Telemetry",
    endpoints: [
      { method: "GET", path: "/merchant/reports/insights/v3" },
      { method: "POST", path: "/v1/credit/risk/telemetry" },
    ],
    pipelineEn: [
      "Tracks real-time UPI vs cash ticket sizes (showing +18% higher basket value on Paytm QR).",
      "Privacy-preserving UPI VPA telemetry flags 7 VIP regulars absent for 10+ days.",
      "Converts consistent counter UPI cashflows into 0-collateral daily EMI merchant credit pre-approval.",
    ],
    pipelineHi: [
      "नकद बनाम पेटीएम क्यूआर बिल साइज की निगरानी करता है (यूपीआई पर +18% बड़ा बिल)।",
      "बिना फोन नंबर मांगे वीआईपी ग्राहकों के अनुपस्थित होने का तुरंत अलर्ट देता है।",
      "दैनिक यूपीआई बिक्री के आधार पर बिना किसी गारंटी के आसान बिजनेस लोन ऑफर करता है।",
    ],
    businessImpactEn:
      "Increases Paytm QR acceptance stickiness while opening a direct pipeline for Paytm Merchant Lending.",
    businessImpactHi:
      "पेटीएम क्यूआर का उपयोग बढ़ाता है और किराना को आसानी से ऋण प्राप्त करने में मदद करता है।",
  },

  soundbox: {
    titleEn: "Soundbox 4.0 IoT Protocol & Voice Khata",
    titleHi: "साउंडबॉक्स 4.0 आईओटी प्रोटोकॉल व वॉयस खाता",
    taglineEn: "4G audio streaming + hands-free microphone voice ledger",
    taglineHi: "4G वॉयस ब्रॉडकास्ट + बोल के खाता रिकॉर्डिंग",
    apiTag: "Paytm IoT MQTT & Audio Synthesis Webhook",
    endpoints: [
      { method: "MQTT", path: "paytm/device/{terminal_id}/audio_stream" },
      { method: "POST", path: "/v1/soundbox/broadcast" },
      { method: "POST", path: "/v1/audio/transcribe/indic" },
    ],
    pipelineEn: [
      "Transforms countertop 4G Soundbox from a passive payment buzzer into an interactive shop copilot.",
      "Broadcasts AI morning briefings and prioritized action items via clear Hindi audio before store opening.",
      "Streams dual-mic audio for voice-to-khata entry, auto-logging udhaar debts with zero typing.",
    ],
    pipelineHi: [
      "काउंटरटॉप साउंडबॉक्स को केवल घंटी से बदलकर एक पूर्ण स्मार्ट बिजनेस असिस्टेंट बनाता है।",
      "दुकान खुलने से पहले सुबह का संक्षिप्त विवरण और प्राथमिकताएं स्पष्ट हिंदी में सुनाता है।",
      "माइक के जरिए 'बोल के खाता' रिकॉर्ड करता है, जिससे बिना टाइप किए उधार दर्ज हो जाता है।",
    ],
    businessImpactEn:
      "Elevates Soundbox hardware value, slashes merchant churn, and accelerates zero-friction ledger adoption.",
    businessImpactHi:
      "साउंडबॉक्स की उपयोगिता को दोगुना करता है और किराना स्टोर का समय बचाता है।",
  },

  pulse: {
    titleEn: "Paytm Pulse & Real-time Settlement Stream",
    titleHi: "पेटीएम पल्स व लाइव सेटलमेंट स्ट्रीम",
    taglineEn: "Instant UPI settlement webhooks & peak footfall mapping",
    taglineHi: "तुरंत सेटलमेंट वेबहुक व पीक समय विश्लेषण",
    apiTag: "Paytm Realtime Stream & Settlement v3",
    endpoints: [
      { method: "STREAM", path: "wss://api.paytm.com/merchant/stream/v1" },
      { method: "POST", path: "/v3/order/webhook" },
    ],
    pipelineEn: [
      "Sub-500ms transaction streaming with instant acoustic confirmation chimes.",
      "Automated End-Of-Day auto-sweep to merchant bank accounts with 0% MDR on UPI payments.",
      "Real-time hourly footfall tracking to optimize staff scheduling and fast-moving stock.",
    ],
    pipelineHi: [
      "500 मिलीसेकंड से कम में भुगतान पुष्टि और साउंडबॉक्स ध्वनि सूचना।",
      "बिना किसी चार्ज (0% MDR) के दिन के अंत में बैंक खाते में स्वचालित पैसा ट्रांसफर।",
      "भीड़ के घंटों की मैपिंग जिससे स्टॉक और कर्मचारियों का सही प्रबंधन हो सके।",
    ],
    businessImpactEn:
      "Guarantees instant working capital availability and 100% transparent counter accounting.",
    businessImpactHi:
      "व्यापारी के पैसे की तत्काल सुरक्षा और संपूर्ण पारदर्शी हिसाब सुनिश्चित करता है।",
  },
};

interface PaytmApiBadgeProps {
  type: PaytmIntegrationType;
  label?: string;
  variant?: "pill" | "dark" | "compact";
  className?: string;
}

export function PaytmApiBadge({
  type,
  label,
  variant = "pill",
  className,
}: PaytmApiBadgeProps) {
  const { isHindi } = useLanguage();
  const [open, setOpen] = useState(false);
  const meta = PAYTM_INTEGRATIONS[type];

  const defaultLabel = label || (isHindi ? "पेटीएम एपीआई" : "How this uses Paytm");

  const triggerClasses =
    variant === "dark"
      ? "inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-white ring-1 ring-white/25 hover:bg-white/25 active:scale-95 transition-all shadow-xs"
      : variant === "compact"
      ? "inline-flex items-center gap-1 rounded-full bg-[#002e6e]/10 px-2 py-0.5 text-[10px] font-semibold text-[#002e6e] ring-1 ring-[#002e6e]/20 hover:bg-[#002e6e]/15 active:scale-95 transition-all"
      : "inline-flex items-center gap-1.5 rounded-full bg-[#002e6e]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#002e6e] ring-1 ring-[#002e6e]/20 hover:bg-[#002e6e]/15 active:scale-95 transition-all shadow-xs";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Paytm API Architecture Info"
          className={cn(triggerClasses, className)}
        >
          <span
            className={cn(
              "size-1.5 rounded-full animate-pulse",
              variant === "dark" ? "bg-emerald-400" : "bg-[#00b9f5]",
            )}
          />
          <span className="font-semibold">{defaultLabel}</span>
          <Info
            className={cn(
              "size-3 shrink-0",
              variant === "dark" ? "text-white/80" : "text-[#002e6e]/80",
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={8}
        className="z-50 w-[330px] sm:w-[410px] p-0 rounded-2xl bg-paper border border-line shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95"
      >
        {/* Header Strip with Paytm Brand Blue */}
        <div className="bg-gradient-to-r from-[#002e6e] to-[#004299] p-4 text-white">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white ring-1 ring-white/20">
              <ShieldCheck className="size-3 text-[#00b9f5]" />
              Paytm Production Integration
            </div>
            <span className="text-[10px] font-mono text-[#00b9f5]">
              LIVE ARCHITECTURE
            </span>
          </div>

          <h4 className="mt-2 font-display text-base font-bold text-white leading-tight">
            {isHindi ? meta.titleHi : meta.titleEn}
          </h4>
          <p className="mt-0.5 text-xs text-white/80 leading-snug">
            {isHindi ? meta.taglineHi : meta.taglineEn}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3.5 bg-paper text-ink">
          {/* Endpoints & Protocol Box */}
          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-inksoft">
              <Code2 className="size-3 text-rust" />
              <span>{isHindi ? "पेटीएम एपीआई एंडपॉइंट्स" : "Paytm Production APIs"}</span>
            </div>
            <div className="mt-1.5 space-y-1.5">
              {meta.endpoints.map((ep) => (
                <div
                  key={ep.path}
                  className="flex items-center gap-2 rounded-lg bg-cream/70 px-2.5 py-1.5 text-xs font-mono ring-1 ring-line/80"
                >
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                      ep.method === "GET"
                        ? "bg-emerald/15 text-emerald"
                        : ep.method === "POST"
                        ? "bg-rust/15 text-rust"
                        : ep.method === "MQTT"
                        ? "bg-[#002e6e]/15 text-[#002e6e]"
                        : "bg-amber-500/15 text-amber-700",
                    )}
                  >
                    {ep.method}
                  </span>
                  <span className="truncate text-ink font-medium">{ep.path}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline 3-step breakdown */}
          <div>
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-inksoft">
              <Cpu className="size-3 text-[#002e6e]" />
              <span>{isHindi ? "डेटा पाइपलाइन और कार्यप्रणाली" : "How It Works (Data Pipeline)"}</span>
            </div>
            <ul className="mt-1.5 space-y-1.5">
              {(isHindi ? meta.pipelineHi : meta.pipelineEn).map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-ink/90 leading-relaxed"
                >
                  <span className="grid size-4 shrink-0 place-items-center rounded-full bg-emerald/15 text-[10px] font-bold text-emerald mt-0.5">
                    ✓
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem Value Card */}
          <div className="rounded-xl bg-[#002e6e]/5 p-2.5 ring-1 ring-[#002e6e]/15">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#002e6e]">
              <Sparkles className="size-3 text-[#00b9f5]" />
              <span>{isHindi ? "पेटीएम व मर्चेंट प्रभाव" : "Paytm Ecosystem Impact"}</span>
            </div>
            <p className="mt-1 text-[11px] text-inksoft leading-relaxed">
              {isHindi ? meta.businessImpactHi : meta.businessImpactEn}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-line bg-cream/40 px-4 py-2 flex items-center justify-between text-[11px] text-inksoft">
          <span className="font-mono text-[10px]">{meta.apiTag}</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald">
            <span className="size-1.5 rounded-full bg-emerald" />
            Production Spec
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
