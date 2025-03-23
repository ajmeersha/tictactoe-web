import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import { AES, enc } from "crypto-js";

interface User {
  id: number | null;
  email: string;
  name: string;
}

interface Stats {
  id: number;
  wins: number;
  losses: number;
  draws: number;
}

export interface GameSliceState {
  board: number[][];
  // status: "ongoing" | "loading" | "failed";
  status: string;
  winner: number | null;
  user: User | null;
  sessionId: number | null;
  token: any | null;
  error: string | null;
  currentPlayer: string;
  stats: Stats;
}

const initialState: GameSliceState = {
  user: {
    id: null,
    email: "",
    name: "",
  },
  currentPlayer: "",
  sessionId: null,
  token: null,
  board: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  status: "ongoing",
  winner: null,
  error: "",
  stats: {
    id: 0,
    wins: 0,
    losses: 0,
    draws: 0,
  },
};

// If you are not using async thunks you can use the standalone `createSlice`.
export const gameSlice = createAppSlice({
  name: "game",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: (create) => ({
    // increment: create.reducer((state) => {
    //   // Redux Toolkit allows us to write "mutating" logic in reducers. It
    //   // doesn't actually mutate the state because it uses the Immer library,
    //   // which detects changes to a "draft state" and produces a brand new
    //   // immutable state based off those changes
    //   state.value += 1;
    // }),
    // decrement: create.reducer((state) => {
    //   state.value -= 1;
    // }),
    // // Use the `PayloadAction` type to declare the contents of `action.payload`
    updateGameboard: create.reducer(
      (state, action: PayloadAction<number[][]>) => {
        state.board = action.payload;
      }
    ),
    updateSessionId: create.reducer((state, action: PayloadAction<number>) => {
      state.sessionId = action.payload;
    }),
    updateUserId: create.reducer((state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }),
    updateStatus: create.reducer((state, action: PayloadAction<string>) => {
      state.status = action.payload;
    }),
    updateWinner: create.reducer((state, action: PayloadAction<number>) => {
      state.winner = action.payload;
    }),
    updateToken: create.reducer((state, action: PayloadAction<string>) => {
      state.token = AES.encrypt(action.payload, "avrioc");
      localStorage.setItem("token", action.payload);
    }),
    updateError: create.reducer((state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }),
    updateCurrentPlayer: create.reducer(
      (state, action: PayloadAction<string>) => {
        state.currentPlayer = action.payload;
      }
    ),
    updateStats: create.reducer((state, action: PayloadAction<Stats>) => {
      state.stats = action.payload;
    }),
    // The function below is called a thunk and allows us to perform async logic. It
    // can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
    // will call the thunk with the `dispatch` function as the first argument. Async
    // code can then be executed and other actions can be dispatched. Thunks are
    // typically used to make async requests.
    // updateGameboard: create.asyncThunk(
    //   async (board) => {
    //     state.board = board;
    //     // const session = selectSession(getState());
    //     // try {
    //     //     const response = await fetch("http://localhost:8080/auth/pc_move", {
    //     //       method: "POST",
    //     //       headers: { "Content-Type": "application/json" },
    //     //       body: JSON.stringify({ board, sessionId: state.sessionId }),
    //     //     });
    //     //     const data = await response.json();
    //     //     console.log(data, "response json");
    //     //   } catch (error) {
    //     //     console.error("An unexpected error happened:", error);
    //     //   }

    //     // // const response = await fetchCount(amount);
    //     // // The value we return becomes the `fulfilled` action payload
    //     // return response.data;
    //   }
    // ),
  }),
  // You can define your selectors here. These selectors receive the slice
  // state as their first argument.
  selectors: {
    selectBoard: (counter) => counter.board,
    selectStatus: (counter) => counter.status,
    selectWinner: (counter) => counter.winner,
    selectUserId: (counter) => counter.user,
    selectSession: (counter) => counter.sessionId,
    selectToken: (counter) =>
      counter.token
        ? AES.decrypt(counter.token, "avrioc").toString(enc.Utf8)
        : counter.token,
    selectError: (counter) => counter.error,
    selectCurrentPlayer: (counter) => counter.currentPlayer,
    selectStats: (counter) => counter.stats,
  },
});

// Action creators are generated for each case reducer function.
export const {
  updateGameboard,
  updateSessionId,
  updateStatus,
  updateToken,
  updateUserId,
  updateWinner,
  updateError,
  updateCurrentPlayer,
  updateStats,
} = gameSlice.actions;

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const {
  selectBoard,
  selectStatus,
  selectSession,
  selectUserId,
  selectWinner,
  selectToken,
  selectError,
  selectCurrentPlayer,
  selectStats,
} = gameSlice.selectors;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());

//     if (currentValue % 2 === 1 || currentValue % 2 === -1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };
