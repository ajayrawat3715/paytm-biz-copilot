import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
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
import { shop } from "@/lib/khata";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Aaj kya focus karun?",
  "Who should I chase for udhar?",
  "Why is Tuesday slow?",
];

export function CopilotChat({
  shopContext,
  className,
}: {
  shopContext: string;
  className?: string;
}) {
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: { messages, shopContext },
        }),
      }),
    [shopContext],
  );

  const { messages, sendMessage, status, error } = useChat({ transport });

  const send = (text: string) => {
    const value = text.trim();
    if (!value || status === "streaming" || status === "submitted") return;
    sendMessage({ text: value });
    setInput("");
  };

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-ink font-display text-sm font-semibold text-cream">
          भ
        </span>
        <div>
          <p className="font-display text-[15px] font-semibold leading-tight">
            Bharat, your copilot
          </p>
          <p className="text-xs text-inksoft">
            <span className="mr-1 inline-block size-1.5 animate-tick rounded-full bg-emerald align-middle" />
            watching {shop.name}
          </p>
        </div>
      </div>

      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-3 px-4 py-5">
          {messages.length === 0 && (
            <div className="rounded-2xl rounded-bl-sm bg-paper px-3.5 py-2.5 text-sm text-inksoft ring-1 ring-line">
              Namaste {shop.owner} ji. Aaj ke sale, udhar aur stock — jo poochna
              ho poochiye.
            </div>
          )}

          {messages.map((message) => {
            const text = message.parts
              .filter((part) => part.type === "text")
              .map((part) => (part as { text: string }).text)
              .join("");
            if (!text) return null;
            return (
              <Message
                key={message.id}
                from={message.role}
                className={message.role === "user" ? "ml-auto items-end" : ""}
              >
                <MessageContent
                  className={cn(
                    "text-sm",
                    message.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-rust px-3.5 py-2.5 text-cream"
                      : "bg-transparent p-0 text-ink",
                  )}
                >
                  <MessageResponse>{text}</MessageResponse>
                </MessageContent>
              </Message>
            );
          })}

          {(status === "submitted" || status === "streaming") && (
            <Shimmer className="text-sm">Soch raha hoon…</Shimmer>
          )}

          {error && (
            <p className="rounded-2xl bg-rust/10 px-3.5 py-2.5 text-sm text-rust">
              {error.message || "The copilot could not answer just now."}
            </p>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-line p-4">
        {messages.length === 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full bg-paper px-3 py-1.5 text-xs font-medium text-inksoft ring-1 ring-line"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <PromptInput
          onSubmit={(_message, event) => {
            event.preventDefault();
            send(input);
          }}
          className="rounded-2xl bg-paper ring-1 ring-line"
        >
          <PromptInputTextarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask in plain Hindi or English…"
            className="bg-transparent text-sm"
          />
          <PromptInputFooter className="justify-end border-0">
            <PromptInputSubmit
              status={status}
              disabled={!input.trim()}
              className="rounded-full bg-ink text-cream"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
