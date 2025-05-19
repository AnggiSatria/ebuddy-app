// /app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.redirect("/");
  response.cookies.set("accessToken", "", { maxAge: 0 });
  return response;
}
