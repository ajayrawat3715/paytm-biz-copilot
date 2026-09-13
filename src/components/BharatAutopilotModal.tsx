import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/lib/language-context";
import { bharatAutopilotData } from "@/lib/mock-data";
import { translations } from "@/lib/translations";
import { useKiranaData } from "@/lib/kirana-context";
import { cn } from "@/lib/utils";
import {
  Bot,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Loader2,
  Package,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";

interface BharatAutopilotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprovedSuccess: (summary: string) => void;
}

const HINDI_ACTIONS = [
  {
    number: "कार्य 1",
    title: "पारले बिस्कुट रीस्टॉक करें",
    detail: "शर्मा डिस्ट्रीब्यूटर्स के लिए 24 पैकेट का पीओ ड्राफ्ट",
    impact: "+₹1,800 संभावित नुकसान से बचाव",
  },
  {
    number: "कार्य 2",
    title: "निष्क्रिय ग्राहकों को ऑफर भेजें",
    detail: "240 ग्राहक · 10% शाम का ऑफर · 4 PM – 8 PM",
    impact: "+₹6,100 अतिरिक्त बिक्री (₹2,100 लाभ)",
  },
  {
    number: "कार्य 3",
    title: "उधार वसूली संदेश",
    detail: "5 ग्राहक · ₹2,800 बकाया · विनम्र व्हाट्सएप व यूपीआई लिंक",
    impact: "₹2,800 नकद वसूली",
  },
];

const HINDI_STEPS = [
  "ग्राहक वर्ग तैयार किया गया",
  "10% ऑफर जनरेट किया गया",
  "इन्वेंटरी रीस्टॉक पीओ तैयार किया गया",
  "उधार रिमाइंडर संदेश तैयार किए गए",
  "अपेक्षित व्यावसायिक प्रभाव का आंकलन संपन्न",
];

export function BharatAutopilotModal({
  open,
  onOpenChange,
  onApprovedSuccess,
}: BharatAutopilotModalProps) {
  const { language, isHindi } = useLanguage();
  const t = translations[language];
  const { approveAutopilotActions } = useKiranaData();

  const [selectedActions, setSelectedActions] = useState<Record<string, boolean>>({
    "auto-1": true,
    "auto-2": true,
    "auto-3": true,
  });

  const [stage, setStage] = useState<"review" | "simulating" | "completed">("review");
  const [completedStepIndex, setCompletedStepIndex] = useState<number>(-1);

  const handleApprove = () => {
    setStage("simulating");
    setCompletedStepIndex(-1);

    // Animate progress checklist step-by-step
    const stepsCount = bharatAutopilotData.simulationSteps.length;
    let current = 0;
    const interval = setInterval(() => {
      setCompletedStepIndex(current);
      current++;
      if (current >= stepsCount) {
        clearInterval(interval);
        setTimeout(() => {
          setStage("completed");
        }, 500);
      }
    }, 450);
  };

  const handleFinish = () => {
    approveAutopilotActions();
    onApprovedSuccess(
      isHindi
        ? "भारत ऑटोपायलट: 3 व्यावसायिक कार्रवाइयां सफलतापूर्वक तैयार व स्वीकृत की गईं (₹10,700 अवसर)।"
        : "Bharat Autopilot: 3 business actions successfully prepared and scheduled (₹10,700 opportunity).",
    );
    setStage("review");
    setCompletedStepIndex(-1);
    onOpenChange(false);
  };

  const handleClose = () => {
    setStage("review");
    setCompletedStepIndex(-1);
    onOpenChange(false);
  };

  const stepsList = isHindi ? HINDI_STEPS : bharatAutopilotData.simulationSteps;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="border-line bg-paper sm:max-w-[580px]">
        {stage === "review" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="grid size-9 place-items-center rounded-xl bg-ink text-cream font-display text-base">
                  भ
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <DialogTitle className="font-display text-xl font-semibold text-ink">
                      {t.autopilotTitle}
                    </DialogTitle>
                    <span className="rounded-full bg-rust/10 px-2 py-0.5 text-[10px] font-bold text-rust">
                      AI Powered
                    </span>
                  </div>
                  <DialogDescription className="text-xs text-inksoft">
                    {t.autopilotSub}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-2">
              <p className="font-display text-sm font-semibold text-ink">
                "{isHindi
                  ? "मुझे 3 ऐसी कार्रवाइयां मिली हैं जो आज आपके व्यापार को बढ़ावा दे सकती हैं।"
                  : bharatAutopilotData.headline}"
              </p>

              {/* 3 Prepared Actions List */}
              <div className="mt-3 space-y-2.5">
                {bharatAutopilotData.actions.map((act, idx) => {
                  const hi = HINDI_ACTIONS[idx];
                  const number = isHindi ? hi.number : act.number;
                  const title = isHindi ? hi.title : act.title;
                  const detail = isHindi ? hi.detail : act.detail;
                  const impact = isHindi ? hi.impact : act.impact;

                  return (
                    <div
                      key={act.id}
                      className="flex items-start justify-between gap-3 rounded-2xl bg-cream/70 p-3.5 ring-1 ring-line transition-all hover:bg-cream"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold tracking-wider text-rust uppercase">
                            {number}
                          </span>
                          <span className="rounded-md bg-emerald/10 px-2 py-0.5 text-[10px] font-semibold text-emerald">
                            {act.status}
                          </span>
                        </div>
                        <p className="font-display text-sm font-semibold text-ink">
                          {title}
                        </p>
                        <p className="text-xs text-inksoft">{detail}</p>
                        <p className="text-[11px] font-medium text-emerald">
                          {impact}
                        </p>
                      </div>

                      <div className="pt-1">
                        <input
                          type="checkbox"
                          checked={selectedActions[act.id] ?? true}
                          onChange={(e) =>
                            setSelectedActions((prev) => ({
                              ...prev,
                              [act.id]: e.target.checked,
                            }))
                          }
                          className="size-4 accent-rust rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Combined Opportunity Box */}
              <div className="mt-4 flex items-center justify-between rounded-xl bg-paper p-3.5 ring-1 ring-line">
                <div>
                  <p className="text-[11px] font-semibold text-inksoft uppercase tracking-wider">
                    {isHindi ? "कुल संयुक्त अवसर" : "Estimated combined opportunity"}
                  </p>
                  <p className="font-display text-2xl font-bold text-ink">
                    ₹{bharatAutopilotData.totalOpportunity.toLocaleString("en-IN")}
                  </p>
                </div>
                <span className="rounded-full bg-emerald/10 px-3 py-1 text-xs font-semibold text-emerald">
                  {isHindi ? "3 कार्रवाइयां तैयार" : "3 Ready for Execution"}
                </span>
              </div>

              {/* Disclaimer */}
              <p className="mt-3 text-[11px] text-inksoft leading-relaxed">
                <ShieldCheck className="mr-1 inline size-3.5 text-rust align-text-bottom" />
                {t.autopilotNotice}
              </p>
            </div>

            <DialogFooter className="mt-4 flex-row items-center justify-between gap-2 border-t border-line pt-3 sm:justify-between">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full px-3.5 py-1.5 text-xs font-semibold text-inksoft hover:bg-sand/60"
              >
                {t.cancel}
              </button>

              <button
                type="button"
                onClick={handleApprove}
                className="inline-flex items-center gap-1.5 rounded-full bg-rust px-5 py-2.5 text-xs font-semibold text-cream shadow-sm ring-1 ring-rust/40 hover:opacity-95 active:scale-[0.98]"
              >
                <Sparkles className="size-3.5" />
                <span>{t.approveSelected}</span>
              </button>
            </DialogFooter>
          </>
        )}

        {/* Stage: Simulating Progress Execution Screen */}
        {stage === "simulating" && (
          <div className="py-6 px-2 animate-settle">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-rust/10 text-rust">
                <Loader2 className="size-5 animate-spin" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">
                  {isHindi ? "भारत आपकी कार्रवाइयां तैयार कर रहा है..." : "Bharat is preparing your actions..."}
                </h3>
                <p className="text-xs text-inksoft">
                  {isHindi ? "डेटा विश्लेषण और ड्राफ्टिंग जारी है" : "Running multi-point validation & dispatch preparation"}
                </p>
              </div>
            </div>

            {/* Checklist Progress */}
            <div className="mt-6 space-y-3 rounded-2xl bg-cream/70 p-4 ring-1 ring-line">
              {stepsList.map((step, idx) => {
                const isDone = idx <= completedStepIndex;
                const isCurrent = idx === completedStepIndex + 1;

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-xs font-medium transition-all"
                  >
                    {isDone ? (
                      <span className="grid size-5 place-items-center rounded-full bg-emerald text-cream shadow-sm">
                        <CheckCircle2 className="size-3.5" />
                      </span>
                    ) : isCurrent ? (
                      <span className="grid size-5 place-items-center rounded-full bg-rust/20 text-rust">
                        <Loader2 className="size-3 animate-spin" />
                      </span>
                    ) : (
                      <span className="size-5 rounded-full border border-line bg-paper" />
                    )}

                    <span
                      className={cn(
                        isDone ? "text-ink font-semibold" : "text-inksoft",
                      )}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stage: Completed Screen */}
        {stage === "completed" && (
          <div className="py-6 text-center animate-settle">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-emerald/15 text-emerald ring-8 ring-emerald/5">
              <CheckCircle2 className="size-9" />
            </div>

            <h3 className="mt-4 font-display text-2xl font-semibold text-ink">
              {t.actionsReadyHeader}
            </h3>
            <p className="mt-1 text-sm font-medium text-emerald">
              {t.actionsPreparedCount(3)} · ₹
              {bharatAutopilotData.totalOpportunity.toLocaleString("en-IN")}{" "}
              {isHindi ? "अनुमानित अवसर" : "estimated opportunity"}
            </p>

            <div className="mx-auto mt-4 max-w-[44ch] rounded-xl bg-cream/70 p-3.5 text-xs text-inksoft leading-relaxed ring-1 ring-line">
              <p className="font-semibold text-ink">
                {isHindi ? "तैयार की गई कार्रवाइयां:" : "Summary of Prepared Actions:"}
              </p>
              <ul className="mt-1 space-y-1 text-left list-disc pl-4 text-[11px]">
                <li>{isHindi ? "शर्मा डिस्ट्रीब्यूटर्स: 24 पैकेट पारले बिस्कुट पीओ तैयार" : "Sharma Distributors: 24 units Parle biscuits PO staged"}</li>
                <li>{isHindi ? "240 निष्क्रिय ग्राहक: 10% शाम का ऑफर ड्राफ्ट तैयार" : "240 inactive customers: 10% evening offer queued"}</li>
                <li>{isHindi ? "5 अतिदेय ग्राहक: ₹2,800 के विनम्र व्हाट्सएप संदेश तैयार" : "5 overdue customers: ₹2,800 friendly WhatsApp links drafted"}</li>
              </ul>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={handleFinish}
                className="rounded-full bg-ink px-7 py-2.5 text-xs font-semibold text-cream shadow-sm hover:bg-ink/90 active:scale-[0.98]"
              >
                {t.backToDashboard}
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
