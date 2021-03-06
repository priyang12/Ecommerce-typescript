import { AuthActions } from "./AuthReducer";

export type AuthValues = {
  email: string;
  password: string;
};
export interface User {
  name: string;
  email: string;
  createdAt: string;
  isAdmin: boolean;
  _id: string;
}

export interface alert {
  show: boolean;
  message: string;
  type: string;
}
export interface AuthState {
  loading: boolean;
  err: string | null;
  token: string | null;
  user: User | null;
  alert: alert | null;
}

export interface IContextModel {
  state: AuthState;
  dispatch: React.Dispatch<AuthActions>;
}
