import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { assignCondition, signSession } from "@/lib/server";

export async function POST(req: Request) {
  try {
    const { classCode } = await req.json();
    if (!classCode || classCode !== process.env.GAME_CLASS_CODE) {
      return NextResponse.json({ error: "That class code was not recognised. Check with your teacher." }, { status: 401 });
    }
    const condition = assignCondition();
    const token = signSession({
      participantId: crypto.randomUUID(),
      condition,
      classCode,
      issuedAt: Date.now()
    });
    return NextResponse.json({ token, condition });
  } catch {
    return NextResponse.json({ error: "Unable to start the game." }, { status: 500 });
  }
}