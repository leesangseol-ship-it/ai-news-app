import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

const client = new Anthropic();

const ArticleAnalysisSchema = z.object({
  translatedTitle: z.string().nullable(),
  translatedContent: z.string().nullable(),
  summary: z.string(),
  categoryName: z.string(),
});

export type ArticleAnalysis = z.infer<typeof ArticleAnalysisSchema>;

export async function analyzeArticle(input: {
  title: string;
  content: string | null;
  language: string;
  existingCategories: string[];
}): Promise<ArticleAnalysis> {
  const response = await client.beta.messages.parse({
    model: "claude-haiku-5-5",
    max_tokens: 2000,
    system: [
      "You process one news article for a Korean news dashboard.",
      "Set translatedTitle/translatedContent only when the original language is not Korean; otherwise set them to null.",
      "summary is always written in Korean, 2-3 sentences, regardless of the original language.",
      input.existingCategories.length > 0
        ? `Pick categoryName from this existing list when one fits: ${input.existingCategories.join(", ")}.`
        : "Propose a short, general Korean categoryName (e.g. 정치, 경제, 기술, 국제).",
      "If none of the existing categories fit well, propose a short new Korean categoryName instead of forcing a bad fit.",
    ].join(" "),
    messages: [
      {
        role: "user",
        content: `Title: ${input.title}\nLanguage: ${input.language}\nContent: ${input.content ?? "(no content)"}`,
      },
    ],
    output_format: betaZodOutputFormat(ArticleAnalysisSchema),
  });

  if (!response.parsed_output) {
    throw new Error("claude_parse_failed");
  }
  return response.parsed_output;
}
