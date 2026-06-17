import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AnalyzeInput = z.object({
  type: z.enum(["job_description", "offer", "company"]),
  content: z.string().min(20).max(20000),
});

const AnalysisSchema = z.object({
  risk_score: z.number().min(0).max(100),
  risk_level: z.enum(["Low Risk", "Medium Risk", "High Risk"]),
  red_flags: z.array(z.object({ title: z.string(), explanation: z.string() })),
  positive_indicators: z.array(z.object({ title: z.string(), explanation: z.string() })),
  summary: z.string(),
});

const SYSTEM_PROMPT = `You are OfferLens, an AI assistant that helps students and fresh graduates think critically about internship and job opportunities.

You analyze a piece of content (a job description, offer letter, or company information) and identify potential risk indicators and positive signals.

CRITICAL RULES:
- NEVER definitively label any company, recruiter, or offer as a "scam", "fraud", "fake", or "illegal".
- Frame everything as risk INDICATORS, CONCERNS, or SIGNALS — not verdicts.
- Always be balanced: surface positive indicators when present.
- Phrase red flags as observations and concerns that the user should investigate or ask about.
- Your professional summary should help the user make their own informed decision.

Scoring guidance:
- 0–33  = Low Risk  (few or no concerning indicators)
- 34–66 = Medium Risk (some indicators worth investigating)
- 67–100 = High Risk (multiple serious indicators worth careful review)`;

export const analyzeOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured");

    const { createLovableAiGateway } = await import("./ai-gateway.server");
    const gateway = createLovableAiGateway(apiKey);

    const typeLabel =
      data.type === "job_description"
        ? "job description"
        : data.type === "offer"
          ? "internship/job offer letter"
          : "company information";

    try {
      const { experimental_output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        system: SYSTEM_PROMPT,
        prompt: `Analyze the following ${typeLabel} and return structured risk analysis.\n\n---\n${data.content}\n---`,
        experimental_output: Output.object({ schema: AnalysisSchema }),
      });

      const result = experimental_output;

      const { data: row, error } = await context.supabase
        .from("analyses")
        .insert({
          user_id: context.userId,
          type: data.type,
          input_preview: data.content.slice(0, 280),
          risk_score: result.risk_score,
          risk_level: result.risk_level,
          red_flags: result.red_flags,
          positive_indicators: result.positive_indicators,
          summary: result.summary,
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return row;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Analysis failed";
      if (message.includes("429")) throw new Error("Rate limit reached. Please wait a moment and try again.");
      if (message.includes("402")) throw new Error("AI credits exhausted. Please add credits in your workspace settings.");
      throw new Error(message);
    }
  });

export const listAnalyses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("analyses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const deleteAnalysis = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("analyses").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
