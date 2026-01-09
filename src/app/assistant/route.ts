import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { error: "Missing API key" },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a Heat Transfer Expert.
Explain conduction, convection, radiation, insulation, R-values.

User Question: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await res.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I couldn't generate a response.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { error: "Assistant failed" },
      { status: 500 }
    );
  }
}
