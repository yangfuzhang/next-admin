"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();

  return (
    <Button onClick={() => router.back()}>
      <ArrowLeft className="w-4 h-4 mr-1" />
      <span>返回</span>
    </Button>
  );
}
