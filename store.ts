import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./src/features/loginSlice";
import registerReducer from "./src/features/registerSlice";
import shoppingListReducer from "./src/features/shoppingListSlice";
import profileReducer from "./src/features/profileSlice";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    shoppingList: shoppingListReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
