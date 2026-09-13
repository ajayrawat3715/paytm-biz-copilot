import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, isNight } = useTheme();
  const { isHindi } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs font-semibold ring-1 transition-all backdrop-blur active:scale-95 shadow-sm",
        isNight
          ? "bg-slate-800 text-amber-300 ring-slate-700 hover:bg-slate-700 hover:text-amber-200"
          : "bg-sand/80 text-ink ring-line hover:bg-paper hover:text-rust",
        className
      )}
      title={
        isNight
          ? isHindi
            ? "दिन का उजाला मोड चालू करें (Switch to Day Mode)"
            : "Switch to Day Mode"
          : isHindi
          ? "रात का बही-खाता मोड चालू करें (Switch to Night Mode)"
          : "Switch to Night Mode"
      }
      aria-label="Toggle Day / Night Mode"
    >
      {isNight ? (
        <>
          <Moon className="size-3.5 text-amber-300 transition-transform hover:rotate-12" />
          <span className="hidden sm:inline">{isHindi ? "रात" : "Night"}</span>
        </>
      ) : (
        <>
          <Sun className="size-3.5 text-amber-600 transition-transform hover:rotate-45" />
          <span className="hidden sm:inline">{isHindi ? "दिन" : "Day"}</span>
        </>
      )}
    </button>
  );
}
