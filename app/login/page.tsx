"use client";
import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectError,
  selectToken,
  updateError,
  updateToken,
  updateUserId,
} from "@/lib/features/game/gameSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectError);
  const token = useAppSelector(selectToken);

  useEffect(() => {
    console.log(token);
    if (token) {
      router.push("/game");
    }
  }, []);

  async function handleSubmit(event: any) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const name = formData.get("name");

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      localStorage.setItem("token", data.token);
      if (data.token) {
        dispatch(updateToken(data.token));
        dispatch(updateUserId(data.user));
        router.push("/game");
      } else {
        dispatch(updateError(data.error));
        setTimeout(() => {
          dispatch(updateError(""));
        }, 2000);
      }
    } catch (error) {
      console.error("An unexpected error happened:", error);
    }

    // if () {
    //   //   router.push("/game");
    // } else {
    //   // Handle errors
    // }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form className="login_form" onSubmit={handleSubmit}>
        <input
          className="login_input"
          type="email"
          name="email"
          placeholder="Email"
          required
        />
        <br />
        <input
          className="login_input"
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <br />
        <br />
        <button className="login_button" type="submit">
          Login
        </button>
        <p>
          If not registered{" "}
          <Link href={"/signup"}>
            <span className="sign-up-button">Sign Up</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
