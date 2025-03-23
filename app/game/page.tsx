"use client";
import {
  selectBoard,
  selectCurrentPlayer,
  selectSession,
  selectStatus,
  selectToken,
  selectUserId,
  updateCurrentPlayer,
  updateGameboard,
  updateSessionId,
  updateStatus,
} from "@/lib/features/game/gameSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function game() {
  const [selection, setSelection] = useState("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUserId);
  const board = useAppSelector(selectBoard);
  const session = useAppSelector(selectSession);
  const status = useAppSelector(selectStatus);
  const Stoken = useAppSelector(selectToken);
  const [token, setToken] = useState(Stoken);
  const currentPlayer = useAppSelector(selectCurrentPlayer);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setToken(token);
    }
    if (!token) {
      router.push("/login");
    }
  }, []);

  const handleNewGame = () => {
    setSelection("");
    dispatch(
      updateGameboard([
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ])
    );
    dispatch(updateStatus(""));
    dispatch(updateCurrentPlayer(""));
  };

  const handlePcMove = async (newBoard: number[][], id?: string) => {
    try {
      const resp = await fetch(`http://localhost:8080/game/pc_move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          board: newBoard,
          sessionId: `${id ? id : session}`,
        }),
      });
      const data = await resp.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      if (data) {
        dispatch(updateGameboard(data.board));
        dispatch(updateStatus(data.status));
        dispatch(updateCurrentPlayer("x"));
      }
    } catch (error) {
      console.error("An unexpected error happened:", error);
    }
  };

  const handlePlayerMove = async (newBoard: number[][]) => {
    try {
      const resp = await fetch(`http://localhost:8080/game/player_move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          board: newBoard,
          sessionId: `${session}`,
        }),
      });
      const data = await resp.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      if (data.status !== "ongoing") {
        dispatch(updateGameboard(newBoard));
        dispatch(updateStatus(data.status));
        dispatch(updateCurrentPlayer("o"));
      } else {
        dispatch(updateStatus(data.status));
        dispatch(updateGameboard(newBoard));
        dispatch(updateCurrentPlayer("o"));
        handlePcMove(newBoard);
      }
    } catch (error) {
      console.error("An unexpected error happened:", error);
    }
  };

  const handleBoardStatus = async (i: number, j: number) => {
    console.log(i, j);
    const newBoard = board.map((row, index) => {
      if (index === i) {
        return row.map((cell, cellIndex) => {
          if (cellIndex === j) {
            return -1;
          }
          return cell;
        });
      }
      return row;
    });
    if (currentPlayer === "x") {
      handlePlayerMove(newBoard);
    } else {
      handlePcMove(newBoard);
    }
  };

  const handleSelection = async (value: string) => {
    // setSelection(value);
    try {
      const response = await fetch(
        "http://localhost:8080/game/create_game_session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            startWithPlayer: value === "user" ? true : false,
          }),
        }
      );
      const data = await response.json();
      console.log(data, "response json");
      if (data.id) {
        dispatch(updateSessionId(data.id));
        dispatch(updateStatus(data.status));
        dispatch(updateCurrentPlayer(data.currentPlayer));
        if (data.currentPlayer !== "x") {
          handlePcMove(board, data.id);
        }
        setSelection(value);
      }
    } catch (error) {
      console.error("An unexpected error happened:", error);
    }
  };

  return (
    <div>
      {selection === "" && (
        <h1 className="absolute top-0 right-2 underline cursor-pointer text-end p-4">
          <Link href={"/stats"}>Stats</Link>
        </h1>
      )}
      <div className="flex flex-col items-center justify-center h-screen">
        {!selection ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-sans font-bold text-base mb-3">
              Please select the starting player
            </h1>
            <div>
              <div
                onClick={() => handleSelection("computer")}
                className="flex items-center flex-col border-2 rounded cursor-pointer border-red-500 hover:bg-red-500 mb-3"
              >
                <svg
                  width="150px"
                  height="150px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2 6C2 4.34315 3.34315 3 5 3H19C20.6569 3 22 4.34315 22 6V15C22 16.6569 20.6569 18 19 18H13V19H15C15.5523 19 16 19.4477 16 20C16 20.5523 15.5523 21 15 21H9C8.44772 21 8 20.5523 8 20C8 19.4477 8.44772 19 9 19H11V18H5C3.34315 18 2 16.6569 2 15V6ZM5 5C4.44772 5 4 5.44772 4 6V15C4 15.5523 4.44772 16 5 16H19C19.5523 16 20 15.5523 20 15V6C20 5.44772 19.5523 5 19 5H5Z"
                    fill="#000000"
                  />
                </svg>
                <p>Computer</p>
              </div>
              <div
                onClick={() => handleSelection("user")}
                className="flex items-center flex-col border-2 cursor-pointer rounded hover:bg-green-500 border-green-500"
              >
                <svg
                  width="150px"
                  height="150px"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p>{user?.name || "Player"}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="">
            <h1 className="font-sans font-bold text-base mb-3">
              Current Player: {currentPlayer === "x" ? user?.name : "computer"}
            </h1>
            {board.map((row, i) => (
              <div key={i} className="flex">
                {row.map((cell, j) => (
                  <button
                    disabled={cell !== 0}
                    onClick={() => handleBoardStatus(i, j)}
                    key={j}
                    className="border-2 cursor-pointer h-16 w-16 flex items-center justify-center"
                  >
                    {cell === 1 ? "O" : cell === -1 ? "X" : ""}
                  </button>
                ))}
              </div>
            ))}
            <div>
              {status !== "ongoing" && (
                <div>
                  <h1 className="font-sans font-bold text-base mb-3">
                    {status === "draw" ? "Game Draw" : `${status}`}
                  </h1>
                  <p
                    className="font-bold cursor-pointer text-green-500"
                    onClick={() => handleNewGame()}
                  >
                    Start New Game
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default game;
