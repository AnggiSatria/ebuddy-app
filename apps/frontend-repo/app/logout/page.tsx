"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    Cookies.remove("accessToken");
    router.replace("/");
  }, [router]);

  return null;
}
