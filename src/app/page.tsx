"use client";

import { useGetMe } from "@/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ASSETS, LOGIN } from "@/utils/constants";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {
  const router = useRouter();

  const { status } = useGetMe();

  useEffect(() => {
    if (status === "error") {
      router.push(LOGIN);
    } else if (status === "success") {
      router.push(ASSETS);
    }
  }, [status]);

  return (
    <div
      className={"absolute left-2/4 top-2/4 -translate-y-2/4 -translate-x-2/4"}
    >
      <LoadingSpinner />
    </div>
  );
}
