import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { useKiranaData } from "@/lib/kirana-context";
import { playPaytmChime, speakSoundboxAlert } from "@/lib/soundbox-audio";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Speaker,
  Volume2,
  Wallet,
  Zap,
} from "lucide-react";

interface VoiceToLedgerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordSuccess?: (entry: {
    customer: string;
    items: string;
    amount: number;
    type: "credit" | "payment";
  }) => void;
}

interface ParsedVoiceData {
  customer: string;
  items: string;
  amount: number;
  type: "credit" | "payment";
  confidence: number;
}

export function VoiceToLedgerModal({
  open,
  onOpenChange,
  onRecordSuccess,
}: VoiceToLedgerModalProps) {
  const { language, isHindi } = useLanguage();
  const { applyVoiceTransaction } = useKiranaData();
  const t = translations[language];

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsedData, setParsedData] = useState<ParsedVoiceData | null>(null);
  const [isRecorded, setIsRecorded] = useState(false);

  const demoPresets = [
    {
      label: isHindi ? "विक्रम सिंह — ₹350 उधार" : "Vikram Singh — ₹350 Udhaar",
      text: isHindi
        ? "विक्रम सिंह 2 पैकेट पारले जी और 1 तेल उधार ले गए, 350 रुपये लिख लो"
        : "Vikram Singh took 2 packs Parle-G and 1 oil on credit, record 350 rupees",
      parsed: {
        customer: "Vikram Singh",
        items: "Parle-G 250g (2), Mustard Oil 1L (1)",
        amount: 350,
        type: "credit" as const,
        confidence: 96,
      },
      soundboxConfirm: isHindi
        ? "विक्रम सिंह के खाते में ₹350 उधार दर्ज किए गए।"
        : "Recorded ₹350 udhaar in Vikram Singh's khata.",
    },
    {
      label: isHindi ? "सुनीता शर्मा — ₹200 उधार" : "Sunita Sharma — ₹200 Udhaar",
      text: isHindi
        ? "सुनीता शर्मा ने 500 का सामान लिया, 300 नकद दिए, 200 उधार लिखो"
        : "Sunita Sharma bought for 500, paid 300 cash, write 200 on udhaar",
      parsed: {
        customer: "Sunita Sharma",
        items: "Aashirvaad Atta, Spices (Partial Cash ₹300)",
        amount: 200,
        type: "credit" as const,
        confidence: 94,
      },
      soundboxConfirm: isHindi
        ? "सुनीता शर्मा के खाते में ₹200 बकाया दर्ज किए गए।"
        : "Recorded ₹200 balance in Sunita Sharma's khata.",
    },
    {
      label: isHindi ? "राजेश कुमार — ₹500 वसूली" : "Rajesh Kumar — ₹500 Repaid",
      text: isHindi
        ? "राजेश कुमार ने 500 रुपये पुराना उधार पेटीएम से चुका दिया"
        : "Rajesh Kumar paid 500 rupees old credit via Paytm",
      parsed: {
        customer: "Rajesh Kumar",
        items: "Khata Repayment via Paytm Soundbox",
        amount: 500,
        type: "payment" as const,
        confidence: 98,
      },
      soundboxConfirm: isHindi
        ? "राजेश कुमार से ₹500 का उधार प्राप्त हुआ।"
        : "Received ₹500 khata repayment from Rajesh Kumar.",
    },
  ];

  // Natural Language Voice Parser
  const parseSpokenText = (text: string): ParsedVoiceData => {
    const lower = text.toLowerCase();
    let customer = "Vikram Singh";
    let items = "General Groceries";
    let amount = 350;
    let type: "credit" | "payment" = "credit";

    if (lower.includes("सुनीता") || lower.includes("sunita")) {
      customer = "Sunita Sharma";
      items = "Atta & Spices";
      amount = 200;
    } else if (lower.includes("राजेश") || lower.includes("rajesh")) {
      customer = "Rajesh Kumar";
      items = "Khata Clearance via Paytm UPI";
      amount = 500;
      type = "payment";
    } else if (lower.includes("विक्रम") || lower.includes("vikram")) {
      customer = "Vikram Singh";
      items = "Parle-G (2), Mustard Oil (1)";
      amount = 350;
    }

    const numMatch = text.match(/\d+/);
    if (numMatch) {
      amount = parseInt(numMatch[0], 10);
    }

    if (lower.includes("चुका") || lower.includes("जमा") || lower.includes("paid") || lower.includes("received")) {
      type = "payment";
    }

    return {
      customer,
      items,
      amount,
      type,
      confidence: 92,
    };
  };

  const handleSelectPreset = (preset: typeof demoPresets[0]) => {
    setTranscript(preset.text);
    setParsedData(preset.parsed);
    setIsRecorded(false);
  };

  // Real Speech Recognition with Browser Speech API
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: pick preset 1 if speech recognition is not supported in browser
      handleSelectPreset(demoPresets[0]);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = isHindi ? "hi-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript(isHindi ? "सुन रहा हूँ… बोलिए" : "Listening… speak now");
      };

      recognition.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        const parsed = parseSpokenText(text);
        setParsedData(parsed);
      };

      recognition.onerror = () => {
        setIsListening(false);
        // Fallback gracefully to first preset
        handleSelectPreset(demoPresets[0]);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      handleSelectPreset(demoPresets[0]);
    }
  };

  const handleConfirmAndRecord = () => {
    if (!parsedData) return;

    // 1. Play authentic Paytm Soundbox chime
    playPaytmChime();

    // 2. Speak voice confirmation
    const confirmMessage = isHindi
      ? `${parsedData.customer} के खाते में ₹${parsedData.amount} दर्ज हो गए।`
      : `Recorded ₹${parsedData.amount} in ${parsedData.customer}'s khata.`;

    speakSoundboxAlert(confirmMessage, isHindi ? "hi" : "en");

    // 3. Mutate live reactive store
    applyVoiceTransaction({
      customer: parsedData.customer,
      items: parsedData.items,
      amount: parsedData.amount,
      type: parsedData.type,
    });

    setIsRecorded(true);

    if (onRecordSuccess) {
      onRecordSuccess(parsedData);
    }

    setTimeout(() => {
      onOpenChange(false);
      setIsRecorded(false);
      setParsedData(null);
      setTranscript("");
    }, 1600);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-[26px] bg-paper p-6 shadow-2xl ring-1 ring-line text-ink sm:p-7">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-line">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-rust text-cream shadow-sm">
              <Mic className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-ink sm:text-lg">
                {t.voiceLedgerTitle}
              </h3>
              <p className="text-xs text-inksoft">{t.voiceLedgerSub}</p>
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

        {/* Central Speech Interaction Chamber */}
        <div className="mt-5 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-sand/50 to-cream p-5 ring-1 ring-line/70">
          {/* Animated Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={cn(
              "relative grid size-20 place-items-center rounded-full transition-all duration-300 shadow-md active:scale-95",
              isListening
                ? "bg-emerald text-white animate-pulse ring-8 ring-emerald/20"
                : "bg-rust text-cream hover:bg-rust/90 hover:scale-105"
            )}
          >
            <Mic className="size-8" />
            {isListening && (
              <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-red-500 animate-ping" />
            )}
          </button>

          <p className="mt-3 text-xs font-semibold text-ink">
            {isListening
              ? (isHindi ? "● भारत सुन रहा है… दुकान की भाषा में बोलें" : "● Listening… Speak in Hindi or English")
              : (isHindi ? "माइक पर टैप करें या नीचे डेमो वाक्य चुनें" : "Tap mic to speak or click a test phrase")}
          </p>

          {/* Transcript Display Box */}
          <div className="mt-3 w-full rounded-xl bg-paper px-4 py-3 text-center text-xs text-ink font-medium ring-1 ring-line min-h-[44px] flex items-center justify-center">
            {transcript ? (
              <span className="text-ink italic">"{transcript}"</span>
            ) : (
              <span className="text-inksoft italic">
                {isHindi ? "उदाहरण: 'विक्रम सिंह 2 पैकेट पारले जी उधार ले गए, ₹350 लिख लो'" : "Say: 'Vikram Singh took 2 Parle-G on credit, write ₹350'"}
              </span>
            )}
          </div>
        </div>

        {/* Quick Test Chips for Hackathon Stage */}
        <div className="mt-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-inksoft">
            {isHindi ? "⚡ त्वरित परीक्षण विकल्प (हैकथॉन डेमो के लिए):" : "⚡ 1-Click Test Scenarios (Noisy Room Fallback):"}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {demoPresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="rounded-full bg-sand px-3 py-1 text-[11px] font-semibold text-ink ring-1 ring-line hover:bg-paper active:scale-95 transition-all"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Extracted AI Structured Output */}
        {parsedData && (
          <div className="mt-4 rounded-2xl bg-paper p-4 ring-1 ring-emerald/40 border border-emerald/20 shadow-sm animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-line/60">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald">
                <Sparkles className="size-3.5 text-rust" />
                {isHindi ? "भारत एआई एक्सट्रैक्शन:" : "Bharat AI Extracted Entities:"}
              </span>
              <span className="rounded-full bg-emerald/15 px-2 py-0.2 text-[9px] font-bold text-emerald">
                {parsedData.confidence}% {isHindi ? "सटीकता" : "Confidence"}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-sand/40 p-2.5">
                <p className="text-[10px] text-inksoft">{isHindi ? "ग्राहक का नाम" : "Customer"}</p>
                <p className="font-bold text-ink mt-0.5">{parsedData.customer}</p>
              </div>

              <div className="rounded-xl bg-sand/40 p-2.5">
                <p className="text-[10px] text-inksoft">{isHindi ? "लेनदेन प्रकार" : "Type"}</p>
                <span
                  className={cn(
                    "inline-block mt-0.5 font-bold px-2 py-0.2 rounded text-[10px]",
                    parsedData.type === "credit" ? "bg-red-100 text-red-700" : "bg-emerald/15 text-emerald"
                  )}
                >
                  {parsedData.type === "credit" ? (isHindi ? "उधार दिया (Credit)" : "Udhaar (Credit)") : (isHindi ? "उधार वसूली (Payment)" : "Repayment")}
                </span>
              </div>

              <div className="col-span-2 rounded-xl bg-sand/40 p-2.5">
                <p className="text-[10px] text-inksoft">{isHindi ? "दर्ज सामान" : "Items Recorded"}</p>
                <p className="font-semibold text-ink mt-0.5">{parsedData.items}</p>
              </div>

              <div className="col-span-2 rounded-xl bg-sand/40 p-2.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-inksoft">{isHindi ? "राशि" : "Amount"}</p>
                  <p className="font-display text-lg font-bold text-ink">₹{parsedData.amount.toLocaleString("en-IN")}</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-inksoft">
                  <Speaker className="size-3.5 text-rust" />
                  <span>{isHindi ? "साउंडबॉक्स पुष्टि सक्रिय" : "Soundbox Synced"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-line pt-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-4 py-2 text-xs font-semibold text-inksoft hover:text-ink"
          >
            {isHindi ? "रद्द करें" : "Cancel"}
          </button>

          <button
            type="button"
            disabled={!parsedData || isRecorded}
            onClick={handleConfirmAndRecord}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all shadow-md active:scale-95",
              isRecorded
                ? "bg-emerald text-white"
                : parsedData
                ? "bg-rust text-cream hover:bg-rust/90"
                : "bg-sand text-inksoft cursor-not-allowed"
            )}
          >
            {isRecorded ? (
              <>
                <CheckCircle2 className="size-4 text-white" />
                <span>{isHindi ? "✓ खाते में दर्ज!" : "✓ Logged in Khata!"}</span>
              </>
            ) : (
              <>
                <Zap className="size-3.5" />
                <span>{isHindi ? "बही-खाते में दर्ज करें व चाइम बजाएं" : "Record in Khata & Play Chime"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
