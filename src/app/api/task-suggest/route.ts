import { NextResponse } from "next/server";
import OpenAI from "openai";
import { addDays, formatISO } from "date-fns";
import { auth } from "@clerk/nextjs/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(request: Request) {
  const { userId } = await auth();
  const { title, description } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  const todayStr = formatISO(today, { representation: "date" });
  const maxDueDate = formatISO(addDays(today, 30), { representation: "date" });

  if (!title) {
    return NextResponse.json({ error: "Missing title" }, { status: 400 });
  }

  const prompt = `
You are a smart task assistant.
Given a task with title "${title}" and description "${description}",
suggest:
1) a due date *after* ${todayStr} and *on or before* ${maxDueDate}, in YYYY-MM-DD format
2) a priority: low, medium, or high

Respond *only* with a JSON object, for example:
{"dueDate":"2025-05-14","priority":"medium"}
  `.trim();

  try {
    const chat = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const choice = chat.choices?.[0];
    const text = choice?.message?.content;
    if (!text) {
      throw new Error("Empty response from AI");
    }

    const suggestion = JSON.parse(text.trim()) as {
      dueDate: string;
      priority: "low" | "medium" | "high";
    };

    const due = new Date(suggestion.dueDate);
    if (isNaN(due.getTime()) || due <= today || due > addDays(today, 30)) {
      throw new Error(`AI returned out-of-range date: ${suggestion.dueDate}`);
    }

    return NextResponse.json(suggestion);
  } catch (err: unknown) {
    console.error("AI suggestion error", err);
    return NextResponse.json(
      { error: "AI suggestion failed, please try again." },
      { status: 500 }
    );
  }
}
