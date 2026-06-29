import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {
  try {
    const { image, style } = await req.json();

    const apiKey = Deno.env.get("GEMINI_API_KEY");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent?key=${apiKey}`,
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
                  text: `Transform this room into a ${style} interior. Keep walls and layout unchanged.`,
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

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
});