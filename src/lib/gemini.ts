export async function generateRoom(image: string, style: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${
      import.meta.env.VITE_GEMINI_API_KEY
    }`,
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
                text: `Transform this room into a ${style} interior design. 
Keep walls, structure, and layout unchanged. Only redesign furniture, lighting, colors, and decoration.`,
              },
              {
                inlineData: {
                  mimeType: "image/png",
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