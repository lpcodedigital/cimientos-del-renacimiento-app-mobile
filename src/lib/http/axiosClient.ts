import axios from "axios";

let authToken: string | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export function getAuthToken(): string | null {
  return authToken;
}
