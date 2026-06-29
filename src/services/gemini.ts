const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export async function generateRoomDesign(
  image: string,
  roomType: string,
  style: string
): Promise<string> {
  const base64 = image.split(",")[1];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation?key=${API_KEY}`,
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
                text: `Transform this ${roomType} into a beautiful ${style} interior design. Keep the same room layout but redesign it professionally.`,
              },
              {
                inlineData: {
                  mimeType: "image/png"
                  data: base64,
                },
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  console.log(data);

  return image; // Temporary placeholder
}