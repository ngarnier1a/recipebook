import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
  currentUser: User | null;
}

// Define the initial state
const initialState: UserState = {
  currentUser: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      console.log(`setting current user: ${JSON.stringify(action.payload)}`)
      state.currentUser = action.payload;
    },
  },
});

export const { setCurrentUser } = usersSlice.actions;

export default usersSlice.reducer;
