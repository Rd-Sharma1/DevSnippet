import { snippetDataType } from "@/database/snippetQueries";

export type AiResponseType = {
  summary: string;
  tags: string[];
  improvements: string[];
  description?: string;
};

const EnhanceWithAI = async (
  { language, title, code, description }: snippetDataType,
  apiKey?: string,
) => {
  if (!apiKey) {
    return undefined;
  }

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Analyze this code snippet.

Return ONLY valid JSON.

Rules:
- summary: max 2 sentences
- tags: max 5 useful searchable tags
- improvements: max 3 practical improvements
${description ? "description: short description for the snippet" : ""}
- avoid generic advice
- prioritize developer usefulness

Programming language: ${language}
Title: ${title}
${description ? `Description: ${description}` : ""}
Code:
${code}

Return this shape:
{
  "summary": "",
  "tags": [],
  "improvements": [],
  "description": ""
}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        }),
      },
    );

    if (!response.ok) {
      return undefined;
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanedResponse = rawText?.replace(/```json|```/g, "").trim();

    if (!cleanedResponse) {
      return undefined;
    }

    const parsed = JSON.parse(cleanedResponse);

    return {
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      tags: Array.isArray(parsed.tags) ? parsed.tags : [],
      improvements: Array.isArray(parsed.improvements)
        ? parsed.improvements
        : [],
      description:
        typeof parsed.description === "string" && parsed.description.length > 0
          ? parsed.description
          : undefined,
    };
  } catch (_) {
    return undefined;
  }
};

export default EnhanceWithAI;
