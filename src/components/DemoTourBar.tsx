import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";

interface DemoTourBarProps {
  onStepClick: (stepId: string) => void;
}

const STEPS = [
  { id: "step-forecast", label: "1. Quiet Day (16% low)", hiLabel: "1. शांत दिन (16% कम)" },
  { id: "step-radar", label: "2. Opportunity Radar (₹10.7k)", hiLabel: "2. अवसर रडार (₹10.7k)" },
  { id: "step-whatif", label: "3. What-If: 10% vs 15%", hiLabel: "3. व्हाट-इफ (10% vs 15%)" },
  { id: "step-autopilot", label: "4. Bharat Autopilot", hiLabel: "4. भारत ऑटोपायलट" },
  { id: "step-memory", label: "5. Business Memory", hiLabel: "5. बिजनेस मेमोरी" },
  { id: "step-paytm", label: "6. Paytm UPI Insights", hiLabel: "6. पेटीएम यूपीआई इनसाइट्स" },
];

export function DemoTourBar({ onStepClick }: DemoTourBarProps) {
  const { isHindi } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [isAutoPitching, setIsAutoPitching] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (!isAutoPitching) return;

    onStepClick(STEPS[activeStepIndex].id);

    const timer = setTimeout(() => {
      if (activeStepIndex < STEPS.length - 1) {
        setActiveStepIndex((prev) => prev + 1);
      } else {
        setIsAutoPitching(false);
        setActiveStepIndex(0);
      }
    }, 7000); // 7 seconds per stage

    return () => clearTimeout(timer);
  }, [isAutoPitching, activeStepIndex, onStepClick]);

  const toggleAutoPitch = () => {
    if (isAutoPitching) {
      setIsAutoPitching(false);
    } else {
      setActiveStepIndex(0);
      setIsAutoPitching(true);
    }
  };

  return (
    <div className="border-b border-line bg-cream/95 px-4 py-2 backdrop-blur">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded-full bg-rust text-cream">
            <Trophy className="size-3" />
          </span>
          <span className="font-display font-semibold text-ink">
            {isHindi ? "पेटीएम एआई हैकथॉन" : "Paytm AI Hackathon"}
          </span>
          <span className="hidden text-inksoft sm:inline">
            · {isHindi ? "60–90 सेकंड डेमो" : "60–90s Demo"}
          </span>
        </div>

        {/* Center: 1-Click Auto-Pitch Mode Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleAutoPitch}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all active:scale-95 shadow-sm",
              isAutoPitching
                ? "bg-rust text-cream animate-pulse ring-2 ring-rust/30"
                : "bg-ink text-cream hover:bg-ink/90",
            )}
          >
            {isAutoPitching ? (
              <>
                <Pause className="size-3" />
                <span>
                  {isHindi ? `स्टेज ${activeStepIndex + 1}/6 (रोकें)` : `Step ${activeStepIndex + 1}/6 (Pause)`}
                </span>
              </>
            ) : (
              <>
                <Zap className="size-3 text-amber-300" />
                <span>{isHindi ? "⚡ ऑटो-पिच (60s)" : "⚡ Auto-Pitch (60s)"}</span>
              </>
            )}
          </button>
        </div>

        {/* Step chips */}
        {!collapsed && (
          <div className="hidden flex-wrap items-center gap-1 md:flex">
            {STEPS.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setIsAutoPitching(false);
                  setActiveStepIndex(idx);
                  onStepClick(s.id);
                }}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ring-1",
                  isAutoPitching && activeStepIndex === idx
                    ? "bg-rust text-cream ring-rust font-bold scale-105"
                    : "bg-paper text-ink ring-line hover:bg-sand",
                )}
              >
                {isHindi ? s.hiLabel : s.label}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-inksoft hover:text-ink"
        >
          {collapsed ? (
            <>
              {isHindi ? "चरण दिखाएं" : "Steps"} <ChevronDown className="size-3" />
            </>
          ) : (
            <>
              {isHindi ? "छिपाएं" : "Hide"} <ChevronUp className="size-3" />
            </>
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="mt-2 flex flex-wrap gap-1 md:hidden">
          {STEPS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setIsAutoPitching(false);
                setActiveStepIndex(idx);
                onStepClick(s.id);
              }}
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-medium ring-1",
                isAutoPitching && activeStepIndex === idx
                  ? "bg-rust text-cream ring-rust font-bold"
                  : "bg-paper text-ink ring-line",
              )}
            >
              {isHindi ? s.hiLabel : s.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
