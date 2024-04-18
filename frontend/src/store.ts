import { configureStore } from "@reduxjs/toolkit";

import usersReducer from "./users/reducer";

export interface UserState {
  users: {
    currentUser: User | null;
  };
}

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

export default store;
