export async function generateRoom(image: string, style: string) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=" +
      import.meta.env.VITE_GEMINI_API_KEY,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Redesign this room into a ${style} interior. Keep the architecture exactly the same. Only replace furniture, colors, decor and lighting.`,
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: image.split(",")[1],
                },
              },
            ],
          },
        ],
      }),
    }
  );

  return await response.json();
}