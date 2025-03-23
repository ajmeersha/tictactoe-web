"use client";
import { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectError,
  selectSession,
  selectToken,
  updateError,
  updateToken,
  updateUserId,
} from "@/lib/features/game/gameSlice";
import Link from "next/link";

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
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
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
        <p className="error-strip">{error !== "" ? error : ""}</p>
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
        <input
          className="login_input"
          type="text"
          name="name"
          placeholder="Name"
          required
        />
        <br />
        <br />
        <button className="login_button" type="submit">
          Register
        </button>
        <p>
          already an user{" "}
          <Link href={"/login"}>
            <span className="sign-up-button">Sign In</span>
          </Link>
        </p>
      </form>
    </div>
  );
}
