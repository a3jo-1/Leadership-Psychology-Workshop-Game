import { NextResponse } from "next/server";
import { supabase, verifySession } from "@/lib/server";

export async function POST(req: Request) {
  try {
    const { token, initialRating, ratings, reflection } = await req.json();
    const session = typeof token === "string" ? verifySession(token) : null;
    if (!session || session.classCode !== process.env.GAME_CLASS_CODE) {
      return NextResponse.json({ error: "Your game session has expired. Please restart." }, { status: 401 });
    }
    if (!Number.isInteger(initialRating) || initialRating < 1 || initialRating > 5 ||
        !Array.isArray(ratings) || ratings.length !== 3 ||
        !ratings.every((r:any) => ["competence","trust","support"].every(k => Number.isInteger(r[k]) && r[k] >= 1 && r[k] <= 5))) {
      return NextResponse.json({ error: "Please check your ratings and try again." }, { status: 400 });
    }
    const { error } = await supabase.from("submissions").insert({
      participant_id: session.participantId,
      class_code: session.classCode,
      condition: session.condition,
      initial_rating: initialRating,
      ratings,
      reflection: typeof reflection === "string" ? reflection.slice(0, 1200) : ""
    });
    if (error) {
      if (error.code === "23505") return NextResponse.json({ error: "This game session has already been submitted." }, { status: 409 });
      console.error(error);
      return NextResponse.json({ error: "We could not save your answers. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to submit responses." }, { status: 500 });
  }
}