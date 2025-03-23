"use client";
import { selectToken } from "@/lib/features/game/gameSlice";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

export default function IndexPage() {
  const router = useRouter();
  const token = useAppSelector(selectToken);
  console.log(token);
  if (token) {
    router.push("/game");
  } else {
    router.push("/login");
  }
  return <></>;
}
