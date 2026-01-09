import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { reply: "Missing GROQ_API_KEY" },
        { status: 500 }
      );
    }

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a Heat Transfer expert. Explain conduction, convection, radiation, insulation and R-values simply.",
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

    if (!groqRes.ok) {
      const err = await groqRes.text();
      return NextResponse.json(
        { reply: "Groq API error", error: err },
        { status: 500 }
      );
    }

    const data = await groqRes.json();

    const reply =
      data?.choices?.[0]?.message?.content ??
      "No response generated.";

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json(
      { reply: "Server error" },
      { status: 500 }
    );
  }
}
