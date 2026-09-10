import { setAuthToken } from "@/shared/infrastructure/http/axiosClient";
import type { AuthTokenHolder } from "../domain/ports/AuthTokenHolder";

export function createAxiosAuthTokenHolder(): AuthTokenHolder {
  return { setToken: setAuthToken };
}
