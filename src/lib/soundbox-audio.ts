// Web Audio API & Speech Synthesis for Paytm Soundbox AI Voice

export function playPaytmChime(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioContextClass) {
        resolve();
        return;
      }

      const ctx = new AudioContextClass();
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      // Classic Paytm chime: E5 (659Hz) -> G#5 (830Hz) -> B5 (987Hz)
      const notes = [
        { freq: 659.25, start: 0, duration: 0.12 },
        { freq: 830.61, start: 0.12, duration: 0.14 },
        { freq: 987.77, start: 0.26, duration: 0.35 },
      ];

      notes.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.start);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + note.start);
        gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + note.start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + note.start + note.duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + note.start);
        osc.stop(ctx.currentTime + note.start + note.duration);
      });

      setTimeout(() => {
        resolve();
      }, 650);
    } catch {
      resolve();
    }
  });
}

export async function speakSoundboxAlert(
  text: string,
  lang: "en" | "hi" = "hi",
  onEnd?: () => void,
) {
  // Play chime first
  await playPaytmChime();

  if (!("speechSynthesis" in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel(); // cancel any active speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.0;
  utterance.pitch = 1.05;

  const voices = window.speechSynthesis.getVoices();
  const targetVoice = voices.find((v) =>
    lang === "hi"
      ? v.lang.includes("hi") || v.name.includes("Hindi")
      : v.lang.includes("en-IN") || v.name.includes("India") || v.lang.includes("en"),
  );

  if (targetVoice) {
    utterance.voice = targetVoice;
  }
  utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}
