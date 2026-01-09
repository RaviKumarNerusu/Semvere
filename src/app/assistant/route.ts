import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const API_KEY = process.env.GROQ_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { reply: "Missing Groq API key" },
        { status: 500 }
      );
    }

    const res = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a Heat Transfer Expert. Explain conduction, convection, radiation, insulation, and R-values clearly.",
            },
            {
              role: "user",
              content: message,
            },
          ],
          temperature: 0.6,
        }),
      }
    );

    const data = await res.json();

    const reply =
      data?.choices?.[0]?.message?.content ??
      "No response generated.";

    return NextResponse.json({ reply });
  } catch (error) {
    return NextResponse.json(
      { reply: "Groq server error." },
      { status: 500 }
    );
  }
}
