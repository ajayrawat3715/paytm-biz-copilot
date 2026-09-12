import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/lib/language-context";
import { aiExplanationData } from "@/lib/mock-data";
import {
  Calendar,
  CheckCircle2,
  IndianRupee,
  Package,
  QrCode,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

interface AIExplanationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contextTitle?: string;
}

const ICONS = {
  Calendar,
  Users,
  Package,
  IndianRupee,
  QrCode,
  TrendingUp,
};

const HINDI_SIGNALS = [
  {
    icon: "Calendar",
    title: "पिछले 30 दिनों की बिक्री",
    detail: "शनिवार व दैनिक बिक्री पैटर्न का ऐतिहासिक विश्लेषण।",
  },
  {
    icon: "Users",
    title: "ग्राहकों के आने की आवृत्ति",
    detail: "240 ऐसे ग्राहकों की पहचान जो 15+ दिनों से नहीं आए हैं।",
  },
  {
    icon: "QrCode",
    title: "यूपीआई / भुगतान व्यवहार",
    detail: "68% यूपीआई हिस्सेदारी व नकद की तुलना में 18% अधिक खर्च।",
  },
  {
    icon: "IndianRupee",
    title: "औसत बास्केट साइज",
    detail: "शाम के समय औसत बिल राशि में 8% की कमी दर्ज।",
  },
  {
    icon: "Package",
    title: "इन्वेंटरी की आवाजाही",
    detail: "पारले बिस्कुट शून्य स्टॉक पर है, शाम की मांग 12 पैकेट।",
  },
  {
    icon: "TrendingUp",
    title: "सप्ताह के दिनों का रुझान",
    detail: "शनिवार शाम 5:30 से 9:00 बजे तक पूरे हफ्ते का 34% राजस्व बनता है।",
  },
];

export function AIExplanationDialog({
  open,
  onOpenChange,
  contextTitle,
}: AIExplanationDialogProps) {
  const { isHindi } = useLanguage();
  const signals = isHindi ? HINDI_SIGNALS : aiExplanationData.signals;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-line bg-paper sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-rust/10 text-rust">
              <ShieldCheck className="size-4" />
            </span>
            <div>
              <DialogTitle className="font-display text-lg font-semibold text-ink">
                {isHindi ? "भारत एआई व्याख्या व पारदर्शिता" : "AI Explanation & Transparency"}
              </DialogTitle>
              <DialogDescription className="text-xs text-inksoft">
                {contextTitle
                  ? isHindi
                    ? `"${contextTitle}" के लिए डेटा विश्लेषण आधार`
                    : `Signal basis for "${contextTitle}"`
                  : isHindi
                  ? "भारत आपकी दुकान के लिए विश्वसनीय सिफारिशें कैसे तैयार करता है"
                  : "How Bharat derives trusted recommendations for your shop"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2">
          {/* AI Confidence Badge */}
          <div className="flex items-center justify-between rounded-xl bg-sand/60 px-3.5 py-2 ring-1 ring-line">
            <span className="text-xs font-semibold text-ink">
              {isHindi ? "एआई विश्वास स्कोर" : "AI confidence"}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald/10 px-2.5 py-0.5 text-xs font-bold text-emerald">
              <Sparkles className="size-3" />
              {isHindi ? "87% (उच्च विश्वास)" : "87% (High confidence)"}
            </span>
          </div>

          <p className="mt-3 font-display text-sm font-semibold text-ink">
            {isHindi ? "भारत ने इन 6 प्रमुख संकेतों का विश्लेषण किया:" : "Bharat analyzed:"}
          </p>

          <div className="mt-2.5 space-y-2 max-h-[290px] overflow-y-auto pr-1">
            {signals.map((signal) => {
              const Icon = ICONS[signal.icon as keyof typeof ICONS] || TrendingUp;
              return (
                <div
                  key={signal.title}
                  className="flex items-start gap-2.5 rounded-xl bg-cream/70 p-2.5 ring-1 ring-line/70"
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-emerald/15 text-emerald">
                    <CheckCircle2 className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-ink">
                      {signal.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-inksoft leading-relaxed">
                      {signal.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3.5 rounded-xl bg-emerald/10 p-3 text-xs text-emerald">
            <p className="font-semibold">
              ✓ {isHindi ? "अन्नपूर्णा किराना के वास्तविक खाता व पेटीएम आंकड़ों पर आधारित" : "Grounded in Annapurna Kirana's live sales & Paytm UPI data"}
            </p>
            <p className="mt-0.5 text-emerald/80 text-[11px]">
              {isHindi
                ? "कोई कृत्रिम अनुमान नहीं। प्रत्येक सिफारिश सीधे आपके नकद प्रवाह और ग्राहकों से जुड़ी है।"
                : "No generic models. Every recommendation links directly to your cashflow and footfall."}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
