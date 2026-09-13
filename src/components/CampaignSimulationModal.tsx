import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/lib/language-context";
import { useKiranaData } from "@/lib/kirana-context";
import { campaignSimulationData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  Loader2,
  Percent,
  Send,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

interface CampaignSimulationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (summary: string) => void;
}

export function CampaignSimulationModal({
  open,
  onOpenChange,
  onSuccess,
}: CampaignSimulationModalProps) {
  const { isHindi } = useLanguage();
  const { launchCampaign } = useKiranaData();
  const [selectedTier, setSelectedTier] = useState<"10" | "15" | "custom">("10");
  const [customDiscount, setCustomDiscount] = useState<number>(12);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isApproved, setIsApproved] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [targetCount, setTargetCount] = useState<number>(campaignSimulationData.targetCount);
  const [campaignTiming, setCampaignTiming] = useState<string>("Today, 4 PM – 8 PM");

  const ten = campaignSimulationData.tiers.tenPercent;
  const fifteen = campaignSimulationData.tiers.fifteenPercent;
  const custom = campaignSimulationData.calculateCustom(customDiscount);

  const activeStats =
    selectedTier === "10"
      ? {
          discount: 10,
          returningCustomers: ten.returningCustomers,
          sales: ten.additionalSales,
          profit: ten.estimatedProfit,
          verdict: isHindi
            ? "मैं 10% छूट की सलाह दूंगा। 15% ऑफर अधिक ग्राहकों को आकर्षित कर सकता है, लेकिन अनुमानित लाभ कम हो जाता है।"
            : "I recommend 10%. The 15% offer may attract more customers, but the estimated profit is lower.",
        }
      : selectedTier === "15"
      ? {
          discount: 15,
          returningCustomers: fifteen.returningCustomers,
          sales: fifteen.additionalSales,
          profit: fifteen.estimatedProfit,
          verdict: isHindi
            ? "15% डिस्काउंट से ₹1,100 अधिक बिक्री होगी पर कुल लाभ ₹350 कम हो जाएगा।"
            : "The 15% discount yields ₹1,100 more revenue but reduces net take-home profit by ₹350.",
        }
      : {
          discount: customDiscount,
          returningCustomers: custom.returningCustomers,
          sales: custom.additionalSales,
          profit: custom.estimatedProfit,
          verdict: custom.verdict,
        };

  const handleApprove = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setIsApproved(true);
    }, 600);
  };

  const handleFinish = () => {
    launchCampaign("lapsed-10");
    onSuccess(
      isHindi
        ? `${activeStats.discount}% ऑफर ${targetCount} निष्क्रिय ग्राहकों के लिए स्वीकृत (${campaignTiming})।`
        : `${activeStats.discount}% offer approved for ${targetCount} inactive customers (${campaignTiming}).`,
    );
    setIsApproved(false);
    onOpenChange(false);
  };

  const handleReset = () => {
    setIsApproved(false);
    setIsSending(false);
    setIsEditing(false);
    setSelectedTier("10");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleReset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="border-line bg-paper sm:max-w-[620px]">
        {!isApproved ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-rust/10 text-rust">
                  <Sparkles className="size-4" />
                </span>
                <div>
                  <DialogTitle className="font-display text-xl font-semibold text-ink">
                    {isHindi ? "एआई कैंपेन पूर्वावलोकन" : "AI Campaign Preview"}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-inksoft">
                    {isHindi
                      ? "लक्षित शाम के प्रोत्साहन के साथ निष्क्रिय किराना ग्राहकों को वापस लाएं"
                      : "Re-engage inactive Kirana customers with targeted evening incentives"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Target & Duration Strip */}
            <div className="mt-1.5 grid grid-cols-2 gap-2.5 text-xs">
              <div className="rounded-xl bg-cream/70 p-3 ring-1 ring-line/70">
                <p className="text-[11px] font-semibold text-inksoft uppercase tracking-wider">
                  {isHindi ? "लक्षित ग्राहक वर्ग" : "Target Audience"}
                </p>
                {isEditing ? (
                  <div className="mt-1 flex items-center gap-1.5">
                    <input
                      type="number"
                      value={targetCount}
                      onChange={(e) => setTargetCount(Number(e.target.value))}
                      className="w-20 rounded-md bg-paper px-2 py-1 text-xs ring-1 ring-line"
                    />
                    <span className="text-inksoft">{isHindi ? "ग्राहक" : "customers"}</span>
                  </div>
                ) : (
                  <p className="mt-1 font-semibold text-ink">
                    {targetCount} {isHindi ? "निष्क्रिय ग्राहक" : "inactive customers"}
                  </p>
                )}
                <p className="text-[11px] text-inksoft">
                  {isHindi ? "पिछले 15+ दिनों से नहीं आए" : "Last visited 15+ days ago"}
                </p>
              </div>

              <div className="rounded-xl bg-cream/70 p-3 ring-1 ring-line/70">
                <p className="text-[11px] font-semibold text-inksoft uppercase tracking-wider">
                  {isHindi ? "समय और अवधि" : "Timing & Duration"}
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={campaignTiming}
                    onChange={(e) => setCampaignTiming(e.target.value)}
                    className="mt-1 w-full rounded-md bg-paper px-2 py-1 text-xs ring-1 ring-line"
                  />
                ) : (
                  <p className="mt-1 font-semibold text-ink flex items-center gap-1">
                    <Clock className="size-3 text-rust" />
                    {isHindi ? "आज, शाम 4 बजे से 8 बजे तक" : campaignTiming}
                  </p>
                )}
                <p className="text-[11px] text-inksoft">
                  {isHindi ? "शाम की चाय-रश के लिए अनुकूलित" : "Timed for evening chai-rush"}
                </p>
              </div>
            </div>

            {/* FEATURE 5: IMPROVED WHAT-IF AI SIMULATION */}
            <div className="mt-3.5 rounded-2xl bg-sand/30 p-4 ring-1 ring-line">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-4 text-rust" />
                  <p className="font-sans text-sm font-semibold text-ink">
                    {isHindi ? "भारत से पूछें: यदि मैं 15% छूट दूं तो?" : "Ask Bharat: What if?"}
                  </p>
                </div>
                <span className="text-[11px] font-medium text-inksoft">
                  {isHindi ? "छूट बनाम लाभ की तुलना" : "Compare discount profitability"}
                </span>
              </div>

              {/* Side-by-Side 10% vs 15% Cards */}
              <div className="mt-3 grid grid-cols-2 gap-3">
                {/* 10% Option Card */}
                <div
                  className={cn(
                    "relative flex flex-col justify-between rounded-2xl p-3.5 ring-2 transition-all",
                    selectedTier === "10"
                      ? "bg-paper ring-rust shadow-md"
                      : "bg-paper/70 ring-line hover:ring-rust/40",
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base font-bold text-ink">
                        10% {isHindi ? "छूट" : "Discount"}
                      </span>
                      <span className="rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-bold text-emerald">
                        ⭐ {isHindi ? "अधिक लाभदायक" : "Best Profit"}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-inksoft">{isHindi ? "अपेक्षित ग्राहक:" : "Expected customers:"}</span>
                        <span className="font-semibold text-ink">38</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-inksoft">{isHindi ? "अनुमानित बिक्री:" : "Estimated revenue:"}</span>
                        <span className="font-semibold text-ink">₹6,100</span>
                      </div>
                      <div className="flex justify-between border-t border-line/60 pt-1 font-semibold">
                        <span className="text-rust">{isHindi ? "अनुमानित लाभ:" : "Estimated profit:"}</span>
                        <span className="text-rust font-bold">₹2,100</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTier("10")}
                    className={cn(
                      "mt-3.5 w-full rounded-xl py-2 text-xs font-semibold transition-all active:scale-[0.98]",
                      selectedTier === "10"
                        ? "bg-rust text-cream shadow-sm"
                        : "bg-sand text-ink ring-1 ring-line hover:bg-paper",
                    )}
                  >
                    {isHindi ? "10% चुनें" : "Choose 10%"}
                  </button>
                </div>

                {/* 15% Option Card */}
                <div
                  className={cn(
                    "relative flex flex-col justify-between rounded-2xl p-3.5 ring-2 transition-all",
                    selectedTier === "15"
                      ? "bg-paper ring-rust shadow-md"
                      : "bg-paper/70 ring-line hover:ring-rust/40",
                  )}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base font-bold text-ink">
                        15% {isHindi ? "छूट" : "Discount"}
                      </span>
                      <span className="rounded-full bg-sand px-2 py-0.5 text-[10px] font-medium text-inksoft">
                        {isHindi ? "अधिक ग्राहक" : "Higher Volume"}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-inksoft">{isHindi ? "अपेक्षित ग्राहक:" : "Expected customers:"}</span>
                        <span className="font-semibold text-ink">51</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-inksoft">{isHindi ? "अनुमानित बिक्री:" : "Estimated revenue:"}</span>
                        <span className="font-semibold text-ink">₹7,200</span>
                      </div>
                      <div className="flex justify-between border-t border-line/60 pt-1 font-semibold">
                        <span className="text-inksoft">{isHindi ? "अनुमानित लाभ:" : "Estimated profit:"}</span>
                        <span className="text-inksoft">₹1,750 (-₹350)</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedTier("15")}
                    className={cn(
                      "mt-3.5 w-full rounded-xl py-2 text-xs font-semibold transition-all active:scale-[0.98]",
                      selectedTier === "15"
                        ? "bg-rust text-cream shadow-sm"
                        : "bg-sand text-ink ring-1 ring-line hover:bg-paper",
                    )}
                  >
                    {isHindi ? "15% चुनें" : "Choose 15%"}
                  </button>
                </div>
              </div>

              {/* Custom Option Switcher */}
              <div className="mt-2.5 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedTier(selectedTier === "custom" ? "10" : "custom")}
                  className="text-[11px] font-semibold text-rust hover:underline"
                >
                  {selectedTier === "custom"
                    ? isHindi ? "पूर्व निर्धारित विकल्पों पर लौटें" : "Back to 10% vs 15%"
                    : isHindi ? "अन्य कस्टम % आज़माएं" : "Test Custom %"}
                </button>
              </div>

              {selectedTier === "custom" && (
                <div className="mt-2 flex items-center gap-3 rounded-xl bg-paper px-3.5 py-2 ring-1 ring-line">
                  <span className="text-xs font-medium text-ink">
                    {isHindi ? "कस्टम डिस्काउंट:" : "Custom Discount:"} {customDiscount}%
                  </span>
                  <input
                    type="range"
                    min="5"
                    max="25"
                    value={customDiscount}
                    onChange={(e) => setCustomDiscount(Number(e.target.value))}
                    className="h-1.5 flex-1 accent-rust"
                  />
                  <span className="text-[11px] text-inksoft">
                    ₹{custom.estimatedProfit} profit
                  </span>
                </div>
              )}

              {/* Bharat Recommendation Verdict Callout */}
              <div className="mt-3 rounded-xl bg-cream p-3 ring-1 ring-line">
                <div className="flex items-start gap-2.5">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-bold text-cream">
                    भ
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-ink">
                      {isHindi ? "भारत की सलाह:" : "Bharat Recommendation:"}
                    </p>
                    <p className="mt-0.5 text-xs text-inksoft leading-relaxed">
                      "{activeStats.verdict}"
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-3 flex-row items-center justify-between gap-2 border-t border-line pt-3 sm:justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing((v) => !v)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-inksoft hover:bg-sand/60"
                >
                  {isEditing ? (isHindi ? "संपादन पूर्ण" : "Done Editing") : (isHindi ? "संशोधित करें" : "Edit")}
                </button>
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold text-inksoft hover:bg-sand/60"
                >
                  {isHindi ? "रद्द करें" : "Cancel"}
                </button>
              </div>

              <button
                type="button"
                disabled={isSending}
                onClick={handleApprove}
                className="inline-flex items-center gap-1.5 rounded-full bg-rust px-5 py-2.5 text-xs font-semibold text-cream shadow-sm ring-1 ring-rust/40 hover:opacity-95 active:scale-[0.98] disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    {isHindi ? "भेजा जा रहा है..." : "Sending dispatch..."}
                  </>
                ) : (
                  <>
                    <Send className="size-3.5" />
                    {isHindi ? "स्वीकृत करें व भेजें" : "Approve & send"}
                  </>
                )}
              </button>
            </DialogFooter>
          </>
        ) : (
          /* Success State */
          <div className="py-6 text-center animate-settle">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald/15 text-emerald ring-8 ring-emerald/5">
              <CheckCircle2 className="size-9" />
            </div>

            <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
              {isHindi ? "कैंपेन स्वीकृत व तैयार" : "Campaign approved"}
            </h3>
            <p className="mt-1 text-sm font-medium text-emerald">
              {targetCount} {isHindi ? `ग्राहकों को ${activeStats.discount}% का ऑफर मिलेगा।` : `customers will receive the ${activeStats.discount}% offer.`}
            </p>
            <p className="mx-auto mt-2 max-w-[42ch] text-xs text-inksoft leading-relaxed">
              {isHindi
                ? `पेटीएम मर्चेंट गेटवे द्वारा निर्धारित। अनुमानित प्रभाव: ₹${activeStats.sales.toLocaleString("en-IN")} की बिक्री और ₹${activeStats.profit.toLocaleString("en-IN")} का शुद्ध लाभ।`
                : `Dispatched via Paytm Merchant SMS & WhatsApp gateway. Projected return: ₹${activeStats.sales.toLocaleString("en-IN")} sales and ₹${activeStats.profit.toLocaleString("en-IN")} net profit.`}
            </p>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleFinish}
                className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold text-cream hover:bg-ink/90 active:scale-[0.98]"
              >
                {isHindi ? "डैशबोर्ड पर लौटें" : "Back to dashboard"}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
