import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";

const SYSTEM = `You are "Bharat", the AI business partner inside a Paytm merchant's app.
You speak to a small Indian shopkeeper — a kirana owner, chai stall, salon, sweet shop.

How you talk:
- Plain, warm, short. Two or three sentences unless asked for detail.
- Understand and reply in Hindi, Hinglish or English — match whatever the shopkeeper used.
- Never use analyst jargon (churn, CAC, funnel). Say it the way a trusted shop manager would.
- Always use rupee amounts (₹) with Indian formatting.

What you do:
- Read the shop snapshot given below and answer questions about sales, udhar (credit), customers and stock using those real numbers.
- When you spot a chance to earn more or lose less, say it as one concrete action with an expected rupee impact.
- For udhar, be practical and respectful: suggest gentle reminders, realistic due dates, and never shame a customer.
- If something is genuinely not in the snapshot, say so plainly and suggest what the shopkeeper could track.
- Never invent transactions or customers that are not in the snapshot.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return Response.json(
            { error: "AI is not configured for this shop yet." },
            { status: 500 },
          );
        }

        const body = (await request.json()) as {
          messages: UIMessage[];
          shopContext?: string;
        };

        const initialRunId = getLovableAiGatewayRunId(request);
        const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: {
            "Lovable-API-Key": apiKey,
            "X-Lovable-AIG-SDK": "vercel-ai-sdk",
          },
          fetch: runIdFetch.fetch,
        });

        try {
          const result = streamText({
            model: lovable.responses("openai/gpt-6-astra"),
            system: `${SYSTEM}\n\nToday's shop snapshot:\n${body.shopContext ?? "(not available)"}`,
            messages: await convertToModelMessages(body.messages ?? []),
            providerOptions: {
              openai: {
                forceReasoning: true,
                reasoningEffort: "low",
                store: false,
              },
            },
            abortSignal: request.signal,
          });

          return result.toUIMessageStreamResponse();
        } catch (error) {
          const status =
            typeof error === "object" &&
            error !== null &&
            "statusCode" in error &&
            typeof (error as { statusCode?: number }).statusCode === "number"
              ? (error as { statusCode: number }).statusCode
              : 500;
          const message =
            status === 402
              ? "The shop's AI credits are used up. Add credits to keep the copilot running."
              : status === 429
                ? "Too many questions at once — try again in a few seconds."
                : "The copilot could not answer just now. Please try again.";
          return Response.json({ error: message }, { status });
        }
      },
    },
  },
});
