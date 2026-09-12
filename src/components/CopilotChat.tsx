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
import { shop } from "@/lib/khata";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Languages,
  Mic,
  MicOff,
  Sparkles,
  Volume2,
} from "lucide-react";

const SUGGESTIONS = [
  "Aaj kya focus karun?",
  "Who should I remind for udhaar?",
  "Why are Tuesday sales slow?",
  "What should I reorder?",
  "How can I increase today's sales?",
];

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
}

import { useLanguage } from "@/lib/language-context";

export function CopilotChat({
  shopContext,
  className,
  onTriggerModal,
}: CopilotChatProps) {
  const { language, setLanguage } = useLanguage();
  const lang = language;
  const setLang = setLanguage;
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const initialGreeting = useMemo(() => {
    return lang === "hi"
      ? `Namaste Ramesh ji. Aaj ki sale, udhaar aur stock — jo bhi poochna ho poochiye. Main Annapurna Kirana ke data par live dhyan rakh raha hoon.`
      : `Namaste Ramesh ji. Ask anything about today's sales, udhaar, or stock. I'm actively analyzing Annapurna Kirana's live numbers.`;
  }, [lang]);

  const sendQuery = (text: string) => {
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

    // Simulate realistic 400ms neural reasoning time
    setTimeout(() => {
      const response = getCopilotResponse(query, lang);
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: response.text,
        action: response.suggestedAction,
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 400);
  };

  const handleVoiceDemo = () => {
    if (isListening) return;
    setIsListening(true);
    setInput(lang === "hi" ? "Sun raha hoon…" : "Listening…");

    setTimeout(() => {
      const demoVoiceQuery =
        lang === "hi"
          ? "Why are Tuesday sales slow?"
          : "Why are Tuesday sales slow?";
      setInput(demoVoiceQuery);
      setIsListening(false);
      sendQuery(demoVoiceQuery);
    }, 1200);
  };

  return (
    <div className={cn("flex min-h-0 flex-col bg-paper/60", className)}>
      {/* Header with Language Toggle */}
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-ink font-display text-base font-semibold text-cream">
            भ
          </span>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="font-display text-[15px] font-semibold leading-tight text-ink">
                Bharat, your copilot
              </p>
              <span className="rounded-full bg-rust/10 px-1.5 py-0.2 text-[9px] font-bold text-rust">
                AI
              </span>
            </div>
            <p className="text-xs text-inksoft">
              <span className="mr-1 inline-block size-1.5 animate-tick rounded-full bg-emerald align-middle" />
              watching {shop.name}
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

      {/* Messages Conversation Area */}
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-3 px-4 py-4">
          {/* Welcoming card */}
          <div className="rounded-2xl rounded-bl-sm bg-paper p-3.5 text-xs text-inksoft ring-1 ring-line leading-relaxed">
            <div className="flex items-center gap-1.5 text-rust font-semibold mb-1">
              <Sparkles className="size-3" />
              <span>{lang === "hi" ? "भारत एआई सहायक" : "Kirana AI Assistant"}</span>
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
                    "text-xs leading-relaxed whitespace-pre-line",
                    isUser
                      ? "rounded-2xl rounded-br-sm bg-rust px-3.5 py-2.5 text-cream font-medium shadow-sm"
                      : "rounded-2xl rounded-bl-sm bg-paper p-3.5 text-ink ring-1 ring-line",
                  )}
                >
                  {message.text}
                </div>

                {/* Inline Action Button inside message */}
                {message.action && onTriggerModal && (
                  <button
                    type="button"
                    onClick={() => onTriggerModal(message.action!.type)}
                    className="inline-flex items-center gap-1 rounded-full bg-rust/10 px-3 py-1.5 text-[11px] font-semibold text-rust hover:bg-rust/15 active:scale-95 transition-all"
                  >
                    <span>{message.action.label}</span>
                    <ArrowRight className="size-3" />
                  </button>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm bg-paper px-3.5 py-2.5 ring-1 ring-line">
              <span className="size-2 animate-ping rounded-full bg-rust" />
              <Shimmer className="text-xs text-inksoft">
                {lang === "hi" ? "Soch raha hoon…" : "Analyzing live shop data…"}
              </Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Suggested Questions & Input Bar */}
      <div className="border-t border-line p-3.5 bg-paper/40">
        {/* Suggested Chips */}
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {SUGGESTIONS.slice(0, 3).map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => sendQuery(suggestion)}
              className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-medium text-inksoft ring-1 ring-line hover:bg-sand hover:text-ink transition-colors"
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
          className="flex items-center gap-1.5 rounded-2xl bg-paper px-2.5 py-1.5 ring-1 ring-line focus-within:ring-rust"
        >
          {/* Microphone Demo Interaction */}
          <button
            type="button"
            title="Voice input demo"
            onClick={handleVoiceDemo}
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full transition-all",
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
                ? "Hindi ya Hinglish me poochiye…"
                : "Ask in Hindi, Hinglish, or English…"
            }
            className="flex-1 bg-transparent px-2 text-xs text-ink outline-none placeholder:text-inksoft/60"
          />

          <button
            type="submit"
            disabled={!input.trim() || isThinking}
            className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-cream disabled:opacity-40 transition-opacity"
          >
            <ArrowRight className="size-4" />
          </button>
        </form>

        {isListening && (
          <p className="mt-1.5 text-center text-[10px] text-rust animate-pulse">
            ● Voice listening active (speak or wait for demo query)
          </p>
        )}
      </div>
    </div>
  );
}
