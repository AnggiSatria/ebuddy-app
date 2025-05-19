"use client";

import { useSearchParams } from "next/navigation";

export default function LogoutClient() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return <div>Logging out... {error}</div>;
}
