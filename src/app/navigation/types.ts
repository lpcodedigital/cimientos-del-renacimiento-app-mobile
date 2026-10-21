export type AuthStackParamList = {
  Login: undefined;
  BiometricOptIn: undefined;
  BiometricUnlock: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Search: undefined;
  Detail: { tipo: "OBRA" | "CURSO"; id: number };
};

export type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};
