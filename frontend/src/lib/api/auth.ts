import client from "./client";

/** Payload for user registration. */
export type RegisterRequest = {
  username: string;
  password: string;
};

/** Payload for login requests. */
export type LoginRequest = {
  username: string;
  password: string;
};

/** Auth response containing token and identity info. */
export type LoginResponse = {
  token: string;
  username: string;
  role: "ADMIN" | "ANALYST" | "CUSTOMER";
};

/** Creates a new user account. */
export async function register(req: RegisterRequest): Promise<void> {
  await client.post("/api/auth/register", req);
}

/** Authenticates user and returns JWT + role info. */
export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const res = await client.post<LoginResponse>("/api/auth/login", payload);
  return res.data;
}
