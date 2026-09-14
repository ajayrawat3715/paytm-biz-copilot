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
import { PaytmApiBadge } from "@/components/PaytmApiBadge";

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
    <div className="mt-4 rounded-[20px] bg-gradient-to-r from-[#002e6e] to-[#004299] p-4 text-white shadow-sm ring-1 ring-black/10 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Device Info */}
        <div className="flex items-center gap-3">
          <div className="relative grid size-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <Speaker className="size-6 text-white" />
            <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-emerald-400" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/70">
                Paytm Soundbox 4.0
              </span>
              <span className="rounded-full bg-white/20 px-2 py-0.2 text-[9px] font-semibold text-white">
                AI Voice Synced
              </span>
              <PaytmApiBadge type="soundbox" variant="dark" />
            </div>
            <p className="font-display text-sm font-semibold sm:text-base">
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
            className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white ring-1 ring-white/30 hover:bg-white/25 active:scale-95 transition-all shadow-sm"
          >
            <Mic className="size-3.5 text-amber-300" />
            <span>{isHindi ? "बोल के खाता" : "Voice Khata"}</span>
          </button>

          {/* Test Payment Chime Button */}
          <button
            type="button"
            onClick={handleTestChime}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/90 ring-1 ring-white/20 hover:bg-white/20 active:scale-95 transition-all"
          >
            <BellRing className="size-3.5" />
            <span>{isHindi ? "₹800 साउंडबॉक्स चाइम" : "Test ₹800 Chime"}</span>
          </button>

          {/* Main Play Morning Brief Button */}
          <button
            type="button"
            onClick={handlePlayBrief}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 shadow-md",
              isPlaying
                ? "bg-emerald-500 text-white animate-pulse"
                : "bg-white text-[#002e6e] hover:bg-white/95",
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
                <span>{isHindi ? "प्रभात साउंडबॉक्स संदेश सुनें" : "Play Morning Audio Brief"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live Voice Status Transcript Box */}
      {isPlaying && activeSpeech && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-black/20 p-2.5 text-xs text-white/90 animate-settle">
          <Radio className="size-3.5 animate-pulse text-emerald-400 shrink-0" />
          <span className="font-medium truncate italic">
            "{activeSpeech}"
          </span>
          <div className="ml-auto flex items-end gap-0.5 h-3">
            <span className="w-1 bg-emerald-400 animate-bounce h-2" />
            <span className="w-1 bg-emerald-400 animate-bounce h-3" style={{ animationDelay: "0.15s" }} />
            <span className="w-1 bg-emerald-400 animate-bounce h-1.5" style={{ animationDelay: "0.3s" }} />
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
