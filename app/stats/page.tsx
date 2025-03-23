"use client";
import {
  selectStats,
  selectToken,
  selectUserId,
  updateCurrentPlayer,
  updateGameboard,
  updateStats,
  updateStatus,
} from "@/lib/features/game/gameSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import React, { useEffect, useState } from "react";

function stats() {
  const Ustats = useAppSelector(selectStats);
  const user = useAppSelector(selectUserId);
  const Stoken = useAppSelector(selectToken);
  const [token, settoken] = useState(Stoken);
  const dispatch = useAppDispatch();
  const [stats, setstats] = useState(Ustats);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      settoken(token);
    }
    getStats();
  }, []);

  const getStats = async () => {
    try {
      const response = await fetch("http://localhost:8080/stats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data);
      dispatch(updateStats(data.stats));
      setstats(data.stats);
    } catch (error) {
      console.error("An unexpected error happened:", error);
    }
  };

  return (
    <div>
      <h2 className="absolute top-0 p-3 right-2 underline cursor-pointer">
        <Link href={"/game"}>Home</Link>
      </h2>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-xl mb-4">Player Stats</h1>
        <table>
          <thead>
            <tr>
              <th className="border p-3">Player</th>
              <th className="border p-3">Wins</th>
              <th className="border p-3">Losses</th>
              <th className="border p-3">Draws</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-3">{user?.name}</td>
              <td className="border p-3">{stats.wins}</td>
              <td className="border p-3">{stats.losses}</td>
              <td className="border p-3">{stats.draws}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default stats;
