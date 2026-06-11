import { snippetDataType } from "@/database/snippetQueries";

export type AiResponseType = {
  summary: string;
  tags: string[];
  improvements: string[];
  description?: string;
};

const EnhanceWithAI = async ({
  language,
  title,
  code,
  description,
}: snippetDataType) => {
  try {
    console.log("fetching gemini response");
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key": `${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
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
                    "improvements": []
                    "description"? : "",
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
    console.log("data recieved", data);
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("rawText Done", rawText);
    const cleanedResponse = rawText?.replace(/```json|```/g, "").trim();
    console.log("clean done", cleanedResponse);
    const parsed = JSON.parse(cleanedResponse);
    console.log("STATUS:", response.status);
    console.log(JSON.stringify(parsed, null, 2));
    console.log(parsed);

    const AiResponse: AiResponseType = parsed;
    return AiResponse;
  } catch (error) {
    console.log("FETCH ERROR:", error);
  }
};

export default EnhanceWithAI;
