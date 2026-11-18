import { NextResponse } from "next/server";
import { supabase, teacherAuthorized } from "@/lib/server";

export async function GET(req: Request) {
  const password = req.headers.get("x-teacher-password");
  if (!teacherAuthorized(password)) return NextResponse.json({ error: "Incorrect teacher password." }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const classCode = searchParams.get("classCode");
  if (!classCode || classCode !== process.env.GAME_CLASS_CODE) return NextResponse.json({ error: "Invalid class." }, { status: 400 });
  const { data, error } = await supabase.from("submissions").select("condition,initial_rating,ratings,created_at").eq("class_code", classCode).order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Could not load results." }, { status: 500 });
  return NextResponse.json({ submissions: data || [] });
}