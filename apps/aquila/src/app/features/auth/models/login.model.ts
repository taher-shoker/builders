export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  type: string;
  accessToken: string;
}