"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isOnboardingComplete } from "@/lib/user-profile";

/**
 * ホーム画面に配置するクライアントコンポーネント。
 * オンボーディング未完了なら /onboarding にリダイレクトする。
 */
export default function OnboardingGate() {
  const router = useRouter();

  useEffect(() => {
    if (!isOnboardingComplete()) {
      router.replace("/onboarding");
    }
  }, [router]);

  return null;
}
