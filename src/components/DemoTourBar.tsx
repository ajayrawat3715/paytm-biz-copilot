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
  {
    id: "step-roi",
    label: "1. Money Made (+₹18.4k)",
    hiLabel: "1. कुल लाभ (+₹18.4k)",
    duration: 12000,
  },
  {
    id: "step-radar",
    label: "2. Today's Radar (+₹10.7k)",
    hiLabel: "2. आज के अवसर (+₹10.7k)",
    duration: 12000,
  },
  {
    id: "step-udhaar",
    label: "3. Paytm UPI Udhaar Flow",
    hiLabel: "3. यूपीआई उधार वसूली",
    duration: 15000,
  },
  {
    id: "step-whatif",
    label: "4. What-If: 10% vs 15%",
    hiLabel: "4. व्हाट-इफ सिमुलेटर",
    duration: 14000,
  },
  {
    id: "step-autopilot",
    label: "5. Bharat Autopilot",
    hiLabel: "5. भारत ऑटोपायलट",
    duration: 14000,
  },
  {
    id: "step-soundbox",
    label: "6. Soundbox Voice Brief",
    hiLabel: "6. साउंडबॉक्स वॉयस ब्रीफिंग",
    duration: 13000,
  },
];

export function DemoTourBar({ onStepClick }: DemoTourBarProps) {
  const { isHindi } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [isAutoPitching, setIsAutoPitching] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  useEffect(() => {
    if (!isAutoPitching) return;

    const currentStep = STEPS[activeStepIndex];
    onStepClick(currentStep.id);

    const timer = setTimeout(() => {
      if (activeStepIndex < STEPS.length - 1) {
        setActiveStepIndex((prev) => prev + 1);
      } else {
        setIsAutoPitching(false);
        setActiveStepIndex(0);
      }
    }, currentStep.duration);

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

  const handleManualClick = (index: number) => {
    setActiveStepIndex(index);
    onStepClick(STEPS[index].id);
  };

  return (
    <div className="border-b border-line bg-cream/95 px-4 py-2 backdrop-blur sticky top-0 z-40 shadow-xs">
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span className="grid size-5 place-items-center rounded-full bg-rust text-cream">
            <Trophy className="size-3" />
          </span>
          <span className="font-display font-semibold text-ink">
            {isHindi ? "पेटीएम एआई हैकथॉन" : "Paytm AI Hackathon"}
          </span>
          <span className="hidden text-inksoft sm:inline font-mono text-[11px]">
            · 80s Auto-Pitch
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
                  {isHindi
                    ? `स्टेज ${activeStepIndex + 1}/6 (रोकें)`
                    : `Step ${activeStepIndex + 1}/6 (Pause)`}
                </span>
              </>
            ) : (
              <>
                <Zap className="size-3 text-amber-300" />
                <span>{isHindi ? "⚡ ऑटो-पिच (80s)" : "⚡ Auto-Pitch (80s)"}</span>
              </>
            )}
          </button>
        </div>

        {/* Manual Step Navigation Pills */}
        <div className="hidden flex-wrap items-center gap-1 md:flex">
          {STEPS.map((step, idx) => {
            const isActive = isAutoPitching && activeStepIndex === idx;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleManualClick(idx)}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ring-1",
                  isActive
                    ? "bg-rust text-cream ring-rust font-bold scale-105 shadow-sm"
                    : "bg-paper text-ink ring-line hover:bg-sand",
                )}
              >
                {isHindi ? step.hiLabel : step.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-inksoft hover:text-ink"
        >
          {collapsed ? (
            <>
              <span>{isHindi ? "दिखाएं" : "Steps"}</span>
              <ChevronDown className="size-3" />
            </>
          ) : (
            <>
              <span>{isHindi ? "छिपाएं" : "Hide"}</span>
              <ChevronUp className="size-3" />
            </>
          )}
        </button>
      </div>

      {/* Mobile Step Pills Strip */}
      {!collapsed && (
        <div className="mt-2 flex flex-wrap gap-1 md:hidden">
          {STEPS.map((step, idx) => {
            const isActive = isAutoPitching && activeStepIndex === idx;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => handleManualClick(idx)}
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-medium ring-1",
                  isActive
                    ? "bg-rust text-cream ring-rust font-bold"
                    : "bg-paper text-ink ring-line",
                )}
              >
                {isHindi ? step.hiLabel : step.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
