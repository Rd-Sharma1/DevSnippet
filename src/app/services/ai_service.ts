
const EnhanceWithAI = async () => {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "x-goog-api-key":
            `${process.env.GOOGLE_API_KEY}`,
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "Twinkle Twinkle",
                },
              ],
            },
          ],
        }),
      }
    );

    const data =
      await response.json();

    console.log(
      "STATUS:",
      response.status
    );

    console.log(
      JSON.stringify(
        data,
        null,
        2
      )
    );

    console.log(
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text
    );
  } catch (error) {
    console.log(
      "FETCH ERROR:",
      error
    );
  }
};

export default EnhanceWithAI;
