import { useState } from "react";
import { VoiceToLedgerModal } from "@/components/VoiceToLedgerModal";
import { useLanguage } from "@/lib/language-context";
import { playPaytmChime, speakSoundboxAlert } from "@/lib/soundbox-audio";
import { cn } from "@/lib/utils";
import {
  BellRing,
  CheckCircle2,
  Mic,
  Radio,
  Speaker,
  Volume2,
  VolumeX,
  Wifi,
} from "lucide-react";

export function SoundboxWidget() {
  const { isHindi } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeSpeech, setActiveSpeech] = useState<string | null>(null);
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const handlePlayBrief = () => {
    if (isPlaying) {
      window.speechSynthesis?.cancel();
      setIsPlaying(false);
      setActiveSpeech(null);
      return;
    }

    setIsPlaying(true);
    const speechText = isHindi
      ? "पेटीएम कोपायलट अलर्ट: नमस्ते रमेश जी। आज अन्नपूर्णा किराना में ₹10,700 के 3 मुख्य अवसर मिले हैं।"
      : "Paytm Copilot Alert: Good morning Ramesh. Bharat found ₹10,700 of opportunities across 3 priority actions today.";

    setActiveSpeech(speechText);

    speakSoundboxAlert(speechText, isHindi ? "hi" : "en", () => {
      setIsPlaying(false);
      setActiveSpeech(null);
    });
  };

  const handleTestChime = () => {
    setIsPlaying(true);
    const text = isHindi
      ? "पेटीएम पर ₹800 प्राप्त हुए।"
      : "Payment of ₹800 received on Paytm.";

    setActiveSpeech(text);

    speakSoundboxAlert(text, isHindi ? "hi" : "en", () => {
      setIsPlaying(false);
      setActiveSpeech(null);
    });
  };

  return (
    <div className="mt-4 rounded-2xl bg-[#172033] p-4 text-white ring-1 ring-black/20 sm:p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Device Info */}
        <div className="flex items-center gap-3">
          <div className="relative grid size-11 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <Speaker className="size-5 text-[#00BAF2]" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald animate-ping" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#00BAF2]">
                Paytm Soundbox 4.0
              </span>
              <span className="rounded-full bg-[#00BAF2]/20 px-2 py-0.5 text-[9px] font-medium text-[#00BAF2] ring-1 ring-[#00BAF2]/30">
                AI Voice Synced
              </span>
            </div>
            <p className="font-sans text-sm font-semibold sm:text-base text-white">
              {isHindi ? "पेटीएम साउंडबॉक्स वॉयस ब्रीफिंग" : "Paytm Soundbox Morning Briefing"}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Voice Khata Direct Button */}
          <button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20 hover:bg-white/15 active:scale-95 transition-all shadow-2xs"
          >
            <Mic className="size-3.5 text-warning" />
            <span>{isHindi ? "बोल के खाता" : "Voice Khata"}</span>
          </button>

          {/* Test Payment Chime Button */}
          <button
            type="button"
            onClick={handleTestChime}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/20 hover:bg-white/15 active:scale-95 transition-all shadow-2xs"
          >
            <BellRing className="size-3.5 text-[#00BAF2]" />
            <span>{isHindi ? "₹800 साउंडबॉक्स चाइम" : "Test ₹800 Chime"}</span>
          </button>

          {/* Main Play Morning Brief Button */}
          <button
            type="button"
            onClick={handlePlayBrief}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all active:scale-95 shadow-2xs",
              isPlaying
                ? "bg-emerald text-white animate-pulse"
                : "bg-paper text-ink hover:bg-cream",
            )}
          >
            {isPlaying ? (
              <>
                <VolumeX className="size-4" />
                <span>{isHindi ? "ऑडियो रोकें" : "Stop Audio"}</span>
              </>
            ) : (
              <>
                <Volume2 className="size-4 text-rust" />
                <span>{isHindi ? "प्रभात साउंडबॉक्स सुनें" : "Play Audio Brief"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Voice Status Transcript Box */}
      {isPlaying && activeSpeech && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/30 p-2.5 text-xs text-white/90 ring-1 ring-white/10 animate-settle">
          <Radio className="size-3.5 animate-pulse text-emerald shrink-0" />
          <span className="font-medium truncate italic">
            "{activeSpeech}"
          </span>
          <div className="ml-auto flex items-end gap-0.5 h-3">
            <span className="w-1 bg-emerald animate-bounce h-2" />
            <span className="w-1 bg-emerald animate-bounce h-3" style={{ animationDelay: "0.15s" }} />
            <span className="w-1 bg-emerald animate-bounce h-1.5" style={{ animationDelay: "0.3s" }} />
          </div>
        </div>
      )}

      {/* Voice-to-Ledger Modal */}
      <VoiceToLedgerModal
        open={voiceModalOpen}
        onOpenChange={setVoiceModalOpen}
      />
    </div>
  );
}
