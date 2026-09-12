import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full bg-sand/80 p-1 ring-1 ring-line backdrop-blur",
        className,
      )}
    >
      <Globe className="ml-1.5 mr-1 size-3.5 text-rust" />
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold transition-all",
          language === "en"
            ? "bg-paper text-ink shadow-sm ring-1 ring-line/70"
            : "text-inksoft hover:text-ink",
        )}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold transition-all",
          language === "hi"
            ? "bg-paper text-ink shadow-sm ring-1 ring-line/70"
            : "text-inksoft hover:text-ink",
        )}
      >
        हिंदी
      </button>
    </div>
  );
}
