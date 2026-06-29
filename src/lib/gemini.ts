export async function generateRoom(image: string, style: string) {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-room`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        image,
        style,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return await response.json();
}