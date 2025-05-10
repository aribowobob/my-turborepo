import { User } from "../../../packages/shared/user";
import { SET_USER, SET_LOADING, SET_ERROR, CLEAR_ERROR } from "./actions";
import { Action, Reducer } from "@reduxjs/toolkit";

// Define the auth state interface
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface SetUserAction extends Action<typeof SET_USER> {
  payload: User | null;
}

interface SetLoadingAction extends Action<typeof SET_LOADING> {
  payload: boolean;
}

interface SetErrorAction extends Action<typeof SET_ERROR> {
  payload: string | null;
}

interface ClearErrorAction extends Action<typeof CLEAR_ERROR> {
  type: typeof CLEAR_ERROR;
}

// Union type of all possible actions
type AuthActionTypes =
  | SetUserAction
  | SetLoadingAction
  | SetErrorAction
  | ClearErrorAction
  | Action<string>; // For other actions that we don't handle

// Initial state
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Reducer function
export const authReducer: Reducer<AuthState> = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: (action as SetUserAction).payload,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: (action as SetLoadingAction).payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: (action as SetErrorAction).payload,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

// Combine all reducers here if you have multiple reducers
// For now we only have one
export const rootReducer = {
  auth: authReducer,
};
