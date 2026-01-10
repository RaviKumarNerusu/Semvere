import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const API_KEY = process.env.GROQ_API_KEY;

    if (!API_KEY) {
      return NextResponse.json(
        { reply: "❌ Missing GROQ_API_KEY in environment variables." },
        { status: 500 }
      );
    }

    const groqRes = await fetch(
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
                "You are a Heat Transfer expert. Explain conduction, convection, radiation, insulation, R-values clearly for students.",
            },
            { role: "user", content: message },
          ],
          temperature: 0.6,
        }),
      }
    );

    const data = await groqRes.json();

    if (!data?.choices?.[0]?.message?.content) {
      return NextResponse.json(
        { reply: "⚠️ No response from Groq API." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reply: data.choices[0].message.content,
    });
  } catch (err) {
    return NextResponse.json(
      { reply: "❌ Groq connection error." },
      { status: 500 }
    );
  }
}
