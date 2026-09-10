import { createBootstrapSession } from "@/features/auth/application/bootstrapSession";
import { createDeclineBiometricOptIn } from "@/features/auth/application/declineBiometricOptIn";
import { createEnableBiometric } from "@/features/auth/application/enableBiometric";
import { createListBiometricMethods } from "@/features/auth/application/listBiometricMethods";
import { createSignIn } from "@/features/auth/application/signIn";
import { createSignOut } from "@/features/auth/application/signOut";
import { createUnlockWithBiometrics } from "@/features/auth/application/unlockWithBiometrics";
import type { AuthUseCases } from "@/features/auth/application/types";
import { createAxiosAuthApi } from "@/features/auth/infrastructure/AxiosAuthApi";
import { createAxiosAuthTokenHolder } from "@/features/auth/infrastructure/AxiosAuthTokenHolder";
import { createExpoBiometricGateway } from "@/features/auth/infrastructure/ExpoBiometricGateway";
import { createSecureStoreSessionRepository } from "@/features/auth/infrastructure/SecureStoreSessionRepository";

export function createAuthUseCases(): AuthUseCases {
  const tokenHolder = createAxiosAuthTokenHolder();
  const sessionRepository = createSecureStoreSessionRepository();
  const biometricGateway = createExpoBiometricGateway();
  const authApi = createAxiosAuthApi();
  return {
    bootstrapSession: createBootstrapSession({
      sessionRepository,
      biometricGateway,
      tokenHolder,
    }),
    signIn: createSignIn({
      authApi,
      sessionRepository,
      biometricGateway,
      tokenHolder,
    }),
    unlockWithBiometrics: createUnlockWithBiometrics({
      sessionRepository,
      biometricGateway,
      tokenHolder,
    }),
    enableBiometric: createEnableBiometric({
      sessionRepository,
      biometricGateway,
    }),
    declineBiometricOptIn: createDeclineBiometricOptIn({ sessionRepository }),
    signOut: createSignOut({ sessionRepository, tokenHolder }),
    listBiometricMethods: createListBiometricMethods({ biometricGateway }),
  };
}
