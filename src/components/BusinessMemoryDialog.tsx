import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/lib/language-context";
import { businessMemoryData } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { Brain, CheckCircle2, Sparkles, Store, ShieldCheck } from "lucide-react";

interface BusinessMemoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HINDI_PREFERENCES = [
  {
    label: "सुरक्षा स्टॉक प्राथमिकता",
    value: "3 दिन",
    detail: "बिस्कुट व तेजी से बिकने वाले किराना सामान के लिए 3 दिन का बफर स्टॉक।",
  },
  {
    label: "पसंदीदा डिस्ट्रीब्यूटर",
    value: "शर्मा डिस्ट्रीब्यूटर्स",
    detail: "गोरईपुर, पटना में सबसे तेज डिलीवरी व थोक छूट पार्टनर।",
  },
  {
    label: "पसंदीदा डिस्काउंट सीमा",
    value: "अधिकतम 10%",
    detail: "मार्जिन की सुरक्षा करते हुए ग्राहकों का फुटफॉल बनाए रखता है।",
  },
];

export function BusinessMemoryDialog({
  open,
  onOpenChange,
}: BusinessMemoryDialogProps) {
  const { language, isHindi } = useLanguage();
  const t = translations[language];

  const prefs = isHindi ? HINDI_PREFERENCES : businessMemoryData.preferences;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-line bg-paper sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-rust/10 text-rust">
              <Brain className="size-5" />
            </span>
            <div>
              <DialogTitle className="font-display text-xl font-semibold text-ink">
                {t.memoryTitle}
              </DialogTitle>
              <DialogDescription className="text-xs text-inksoft">
                {t.memorySub}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2 space-y-3">
          {prefs.map((pref, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-3 rounded-2xl bg-cream/70 p-3.5 ring-1 ring-line/70"
            >
              <div>
                <p className="text-xs font-semibold text-ink">{pref.label}</p>
                <p className="mt-0.5 text-xs text-inksoft leading-relaxed">
                  {pref.detail}
                </p>
              </div>
              <span className="shrink-0 rounded-lg bg-paper px-2.5 py-1 text-xs font-bold text-rust ring-1 ring-line">
                {pref.value}
              </span>
            </div>
          ))}

          {/* Active AI Application Callout */}
          <div className="rounded-xl bg-sand/50 p-3.5 text-xs ring-1 ring-line">
            <div className="flex items-center gap-1.5 font-semibold text-ink">
              <Sparkles className="size-3.5 text-rust" />
              <span>
                {isHindi
                  ? "सिफारिशों में इस मेमोरी का उपयोग:"
                  : "How Bharat applies your memory in recommendations:"}
              </span>
            </div>
            <p className="mt-1.5 italic text-inksoft leading-relaxed">
              "{isHindi
                ? "आप 3 दिन का सुरक्षा स्टॉक बनाए रखना पसंद करते हैं, इसलिए मैंने शर्मा डिस्ट्रीब्यूटर्स से अनुशंसित पुनःऑर्डर मात्रा बढ़ाकर 24 पैकेट कर दी है।"
                : businessMemoryData.sampleReasoning}"
            </p>
          </div>

          <p className="text-[11px] text-inksoft flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald" />
            <span>
              {isHindi
                ? "ये प्राथमिकताएं आपके स्टोर के लिए व्यक्तिगत रूप से सुरक्षित हैं।"
                : "Preferences are securely stored and adapt to your store's habits."}
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
