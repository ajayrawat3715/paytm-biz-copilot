import { useEffect, useMemo, useRef, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { getCopilotResponse, type LanguageMode } from "@/lib/copilot-ai";
import { askGeminiCopilot, getGeminiApiKey, setGeminiApiKey } from "@/lib/gemini";
import { shop } from "@/lib/khata";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Key,
  Languages,
  Mic,
  MicOff,
  Sparkles,
  TrendingDown,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  action?: {
    label: string;
    type: "campaign" | "inventory" | "udhaar";
  };
}

interface CopilotChatProps {
  shopContext: string;
  className?: string;
  onTriggerModal?: (type: "campaign" | "inventory" | "udhaar") => void;
  onExplain?: (context: string) => void;
}

export function CopilotChat({
  shopContext,
  className,
  onTriggerModal,
  onExplain,
}: CopilotChatProps) {
  const { language, setLanguage } = useLanguage();
  const lang = language;
  const setLang = setLanguage;

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [apiKey, setApiKey] = useState(() => getGeminiApiKey());
  const [mounted, setMounted] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [tempKeyInput, setTempKeyInput] = useState("");
  const [isKeySaved, setIsKeySaved] = useState(false);
  const [isProactiveExpanded, setIsProactiveExpanded] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentDayName = useMemo(() => {
    return new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
      timeZone: "Asia/Kolkata",
      weekday: "long",
    });
  }, [lang]);

  const handleOpenKeyModal = () => {
    setTempKeyInput(apiKey);
    setIsKeySaved(false);
    setIsKeyModalOpen(true);
  };

  const handleSaveKey = (keyToSave: string) => {
    const trimmed = keyToSave.trim();
    setGeminiApiKey(trimmed);
    setApiKey(trimmed);
    setIsKeySaved(true);
    setTimeout(() => {
      setIsKeyModalOpen(false);
      setIsKeySaved(false);
    }, 800);
  };

  const initialGreeting = useMemo(() => {
    return lang === "hi"
      ? `नमस्ते रमेश जी! आज की बिक्री, उधार और स्टॉक — जो भी पूछना हो पूछिए। मैं अन्नपूर्णा किराना के लाइव आंकड़ों पर लगातार ध्यान रख रहा हूँ।`
      : `Hello Ramesh ji! Ask anything about today's sales, udhaar, or stock. I'm actively analyzing Annapurna Kirana's live numbers.`;
  }, [lang]);

  const suggestions = useMemo(() => {
    return lang === "hi"
      ? [
          "मंगलवार को बिक्री कम क्यों है?",
          "30 दिनों से कौन नहीं आया?",
          "फॉर्च्यून तेल का स्टॉक चेक करें",
          "उधार वसूली के लिए किसे याद दिलाएं?",
        ]
      : [
          "Why are Tuesday sales slow?",
          "Who hasn't visited in 30 days?",
          "Check Fortune Oil stock",
          "Who should I remind for udhaar?",
        ];
  }, [lang]);

  // Text-to-speech speaker output for audio response in chosen language
  const speakMessage = (msgId: string, text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#•]/g, "").replace(/\n+/g, " ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const sendQuery = async (text: string) => {
    const query = text.trim();
    if (!query || isThinking) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    try {
      const response = await askGeminiCopilot({
        query,
        lang,
        shopContext,
      });

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: response.text,
        action: response.suggestedAction,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn("Copilot query failed, falling back to offline rules:", err);
      const fallback = getCopilotResponse(query, lang);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: fallback.text,
        action: fallback.suggestedAction,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleVoiceDemo = () => {
    if (isListening) return;
    setIsListening(true);
    setInput(lang === "hi" ? "सुन रहा हूँ…" : "Listening…");

    setTimeout(() => {
      const demoVoiceQuery =
        lang === "hi"
          ? "मंगलवार को बिक्री कम क्यों है?"
          : "Why are Tuesday sales slow?";
      setInput(demoVoiceQuery);
      setIsListening(false);
      sendQuery(demoVoiceQuery);
    }, 1200);
  };

  return (
    <div className={cn("relative flex min-h-0 flex-col bg-paper/60", className)}>
      {/* Header with Language Toggle & Key Settings */}
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-ink font-display text-base font-semibold text-cream">
            भ
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-display text-[15px] font-semibold leading-tight text-ink">
                {lang === "hi" ? "भारत — किराना कोपायलट" : "Bharat, your copilot"}
              </p>
              <button
                type="button"
                onClick={handleOpenKeyModal}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold transition-all",
                  mounted && apiKey
                    ? "bg-emerald/10 text-emerald hover:bg-emerald/15"
                    : "bg-rust/10 text-rust hover:bg-rust/15",
                )}
                title={mounted && apiKey ? "Gemini AI Active (Click to view/change key)" : "Click to enter Gemini API Key"}
              >
                <Key className="size-2.5" />
                <span>{mounted && apiKey ? "Gemini Active" : "Add Key"}</span>
              </button>
            </div>
            <p className="text-xs text-inksoft">
              <span className="mr-1 inline-block size-1.5 animate-tick rounded-full bg-emerald align-middle" />
              {lang === "hi" ? "अन्नपूर्णा किराना सक्रिय" : `watching ${shop.name}`}
            </p>
          </div>
        </div>

        {/* English | हिंदी Toggle */}
        <div className="flex items-center rounded-full bg-sand/80 p-0.5 ring-1 ring-line">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all",
              lang === "en"
                ? "bg-paper text-ink shadow-sm ring-1 ring-line/50"
                : "text-inksoft hover:text-ink",
            )}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang("hi")}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all",
              lang === "hi"
                ? "bg-paper text-ink shadow-sm ring-1 ring-line/50"
                : "text-inksoft hover:text-ink",
            )}
          >
            हिंदी
          </button>
        </div>
      </div>

      {/* 7. THE BHARAT AI PANEL — Proactive Intelligence (Observation -> Reason -> Recommendation -> Impact -> Action) */}
      <div className="border-b border-line bg-paper/95 p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rust" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-rust">
              {lang === "hi" ? "दुकान अवलोकन (Live Intelligence)" : "Proactive Intelligence"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsProactiveExpanded(!isProactiveExpanded)}
            className="flex items-center gap-1 text-[11px] font-medium text-inksoft hover:text-ink transition-colors"
          >
            <span>
              {isProactiveExpanded
                ? lang === "hi"
                  ? "संक्षिप्त"
                  : "Collapse"
                : lang === "hi"
                  ? "विस्तार"
                  : "Expand"}
            </span>
            {isProactiveExpanded ? (
              <ChevronUp className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </button>
        </div>

        {/* 1. Observation */}
        <p className="mt-2 font-sans text-sm font-semibold text-ink leading-snug">
          {lang === "hi"
            ? `${currentDayName} की बिक्री सामान्य से 16% कम चल रही है।`
            : `${currentDayName} sales are running 16% below normal.`}
        </p>

        {isProactiveExpanded && (
          <div className="mt-2.5 space-y-2.5 animate-settle">
            {/* 2. Reason */}
            <div className="rounded-xl bg-sand/40 p-2.5 ring-1 ring-line/60">
              <p className="text-[11px] font-semibold text-inksoft">
                {lang === "hi" ? "ऐसा क्यों हो रहा है?" : "Why is this happening?"}
              </p>
              <ul className="mt-1.5 space-y-1 text-xs text-inksoft leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <span className="text-rust font-bold">•</span>
                  <span>{lang === "hi" ? "240 ग्राहक इस महीने वापस नहीं आए" : "240 customers haven't returned this month"}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rust font-bold">•</span>
                  <span>{lang === "hi" ? "शाम के व्यस्त समय की बिक्री 22% गिरी" : "Evening rush hour sales dropped 22%"}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rust font-bold">•</span>
                  <span>{lang === "hi" ? "औसत बास्केट साइज़ ₹45 कम हुआ" : "Average basket size down ₹45"}</span>
                </li>
              </ul>
            </div>

            {/* 3. Bharat Recommends & 4. Estimated Impact */}
            <div className="rounded-xl bg-rust-light/40 p-3 ring-1 ring-rust/35">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-rust">
                  {lang === "hi" ? "भारत एआई की सलाह" : "Bharat recommends"}
                </span>
                <span className="text-[11px] font-bold text-emerald tabular-nums">
                  {lang === "hi" ? "अवसर: +₹6,100" : "Estimated opportunity: ₹6,100"}
                </span>
              </div>
              <p className="mt-1 font-sans text-xs font-semibold text-ink leading-relaxed">
                {lang === "hi"
                  ? "आवश्यक वस्तुओं पर 10% छूट के साथ 42 निष्क्रिय ग्राहकों को संदेश भेजें।"
                  : "Target 42 inactive customers with a 10% offer on essentials."}
              </p>

              {/* 5. Actions */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => onTriggerModal?.("campaign")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rust px-3 py-1.5 text-xs font-semibold text-cream shadow-xs hover:bg-rust/95 active:scale-95 transition-all"
                >
                  <span>{lang === "hi" ? "ऑफ़र देखें →" : "Review action →"}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onExplain?.(
                      lang === "hi"
                        ? "42 निष्क्रिय ग्राहकों को 10% ऑफ़र"
                        : "Target 42 inactive customers with a 10% offer"
                    )
                  }
                  className="text-[11px] font-medium text-inksoft underline hover:text-rust transition-colors"
                >
                  {lang === "hi" ? "यह सलाह क्यों?" : "Why this recommendation?"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Messages Conversation Area */}
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-3 px-4 py-4">
          {/* Welcoming card */}
          <div className="rounded-2xl rounded-bl-sm bg-paper p-3.5 text-xs text-inksoft ring-1 ring-line leading-relaxed shadow-2xs">
            <div className="flex items-center justify-between text-rust font-semibold mb-1">
              <div className="flex items-center gap-1.5">
                <Sparkles className="size-3" />
                <span>{lang === "hi" ? "भारत एआई सहायक" : "Kirana AI Assistant"}</span>
              </div>
              <button
                type="button"
                onClick={() => speakMessage("greeting", initialGreeting)}
                className="rounded-full p-1 text-inksoft hover:bg-sand hover:text-rust transition-colors"
                title={lang === "hi" ? "आवाज़ में सुनें" : "Listen to audio"}
              >
                {isSpeaking === "greeting" ? (
                  <VolumeX className="size-3.5 text-rust animate-pulse" />
                ) : (
                  <Volume2 className="size-3.5" />
                )}
              </button>
            </div>
            {initialGreeting}
          </div>

          {messages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-1.5 animate-settle",
                  isUser ? "ml-auto items-end max-w-[85%]" : "mr-auto items-start max-w-[95%]",
                )}
              >
                <div
                  className={cn(
                    "text-xs leading-relaxed whitespace-pre-line relative group shadow-2xs",
                    isUser
                      ? "rounded-2xl rounded-br-xs bg-sand/80 px-3.5 py-2.5 text-ink font-medium ring-1 ring-line"
                      : "rounded-2xl rounded-bl-xs bg-paper p-3.5 text-ink ring-1 ring-line border-l-[3px] border-l-rust",
                  )}
                >
                  {message.text}

                  {/* Speaker Button on Assistant Messages */}
                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-line/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => speakMessage(message.id, message.text)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-rust hover:underline transition-colors"
                      >
                        {isSpeaking === message.id ? (
                          <>
                            <VolumeX className="size-3.5 animate-pulse" />
                            <span>{lang === "hi" ? "आवाज़ रोकें" : "Stop audio"}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="size-3.5" />
                            <span>{lang === "hi" ? "आवाज़ में सुनें" : "Listen"}</span>
                          </>
                        )}
                      </button>

                      <span className="text-[10px] text-inksoft flex items-center gap-1">
                        <Sparkles className="size-2.5 text-rust" />
                        {lang === "hi" ? "पेटीएम • जेमिनी एआई" : "Paytm • Gemini AI"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Inline Action Button inside message */}
                {message.action && onTriggerModal && (
                  <button
                    type="button"
                    onClick={() => onTriggerModal(message.action!.type)}
                    className="inline-flex items-center gap-1 rounded-xl bg-rust/10 px-3 py-1.5 text-[11px] font-semibold text-rust ring-1 ring-rust/20 hover:bg-rust/20 active:scale-95 transition-all shadow-2xs"
                  >
                    <span>{message.action.label}</span>
                    <ArrowRight className="size-3" />
                  </button>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-paper px-3.5 py-2.5 ring-1 ring-line shadow-2xs">
              <span className="size-2 animate-ping rounded-full bg-rust" />
              <Shimmer className="text-xs text-inksoft">
                {lang === "hi"
                  ? "जेमिनी एआई दुकान का लाइव डेटा विश्लेषण कर रहा है…"
                  : "Gemini AI analyzing live shop data…"}
              </Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Suggested Questions & Input Bar */}
      <div className="border-t border-line p-3.5 bg-paper/60">
        {/* Suggested Chips */}
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => sendQuery(suggestion)}
              className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-medium text-inksoft ring-1 ring-line hover:bg-sand hover:text-ink active:scale-95 transition-all shadow-2xs"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Bar with Voice Button */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuery(input);
          }}
          className="flex items-center gap-1.5 rounded-xl bg-paper px-2.5 py-1.5 ring-1 ring-line focus-within:ring-rust shadow-2xs"
        >
          {/* Microphone Demo Interaction */}
          <button
            type="button"
            title={lang === "hi" ? "बोलकर पूछें (Voice Demo)" : "Voice input demo"}
            onClick={handleVoiceDemo}
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-lg transition-all",
              isListening
                ? "bg-rust text-cream animate-pulse ring-2 ring-rust/30"
                : "text-inksoft hover:bg-sand hover:text-ink",
            )}
          >
            <Mic className="size-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              lang === "hi"
                ? "दुकान के बारे में भारत से कुछ भी पूछें..."
                : "Ask Bharat anything about your store..."
            }
            className="flex-1 bg-transparent px-2 text-xs text-ink outline-none placeholder:text-inksoft/60 font-sans"
          />

          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="grid size-8 shrink-0 place-items-center rounded-lg bg-ink text-cream disabled:opacity-40 hover:opacity-90 active:scale-95 transition-all"
          >
            <ArrowRight className="size-4" />
          </button>
        </form>

        {isListening && (
          <p className="mt-1.5 text-center text-[10px] text-rust animate-pulse">
            {lang === "hi"
              ? "● आवाज़ सुनी जा रही है (बोलें या डेमो प्रश्न की प्रतीक्षा करें)..."
              : "● Voice listening active (speak or wait for demo query)..."}
          </p>
        )}
      </div>

      {/* Interactive Gemini Key Modal */}
      {isKeyModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-paper p-4 shadow-xl ring-1 ring-line animate-settle">
            <div className="flex items-center justify-between border-b border-line pb-2.5">
              <div className="flex items-center gap-1.5 font-display text-sm font-semibold text-ink">
                <Key className="size-4 text-rust" />
                <span>{lang === "hi" ? "Google Gemini API कुंजी" : "Google Gemini API Key"}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsKeyModalOpen(false)}
                className="rounded-full p-1 text-inksoft hover:bg-sand hover:text-ink transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <p className="mt-2 text-xs text-inksoft leading-relaxed">
              {lang === "hi"
                ? "चैटबॉट को रियल-टाइम जेमिनी एआई से संचालित करने के लिए अपनी API Key दर्ज करें। यह आपके ब्राउज़र में सुरक्षित रहेगी।"
                : "Enter your Gemini API Key to power live dynamic Kirana responses. Stored securely in your browser session."}
            </p>

            <div className="mt-3">
              <input
                type="password"
                value={tempKeyInput}
                onChange={(e) => setTempKeyInput(e.target.value)}
                placeholder="Enter Gemini API key (AIzaSy...)..."
                className="w-full rounded-xl border border-line bg-sand/50 px-3 py-2 text-xs font-mono text-ink outline-none focus:border-rust"
              />
            </div>

            {isKeySaved && (
              <p className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-emerald animate-settle">
                <Check className="size-3.5" />
                <span>{lang === "hi" ? "सफलतापूर्वक सहेजा गया!" : "Key saved & activated!"}</span>
              </p>
            )}

            <div className="mt-3.5 flex items-center justify-between gap-2">
              {apiKey ? (
                <button
                  type="button"
                  onClick={() => handleSaveKey("")}
                  className="text-[10px] text-rust underline hover:text-rust/80 transition-colors"
                >
                  {lang === "hi" ? "कुंजी हटाएं (Clear)" : "Clear key"}
                </button>
              ) : (
                <span className="text-[10px] text-inksoft">
                  {lang === "hi" ? "Google AI Studio कुंजी पेस्ट करें" : "Paste key from Google AI Studio"}
                </span>
              )}

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="rounded-xl px-3 py-1.5 text-xs text-inksoft hover:bg-sand transition-colors"
                >
                  {lang === "hi" ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveKey(tempKeyInput)}
                  className="rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-cream hover:bg-ink/90 transition-colors"
                >
                  {lang === "hi" ? "सहेजें" : "Save Key"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
