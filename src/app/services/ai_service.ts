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
  try {
    const key = apiKey || process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

    if (!key) {
      console.log("No API key available");
      return undefined;
    }

    // console.log("fetching gemini response");
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": key,
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
${description && "description: short description for the snippet"}
- avoid generic advice
- prioritize developer usefulness


                    Programming language:
                    ${language}

                    Title:
                    ${title}

                    ${description && `Description (**return the same description if not empty): ${description}`}

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

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const cleanedResponse = rawText?.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedResponse);

    const AiResponse: AiResponseType = {
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

    return AiResponse;
  } catch (error) {
    console.log("FETCH ERROR:", error);
    return undefined;
  }
};

export default EnhanceWithAI;
