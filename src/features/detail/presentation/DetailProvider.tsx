import { createContext, type ReactNode } from "react";

import type { DetailUseCases } from "../application/types";

type DetailContextValue = {
  useCases: DetailUseCases;
};

const DetailContext = createContext<DetailContextValue | null>(null);

type DetailProviderProps = {
  useCases: DetailUseCases;
  children: ReactNode;
};

export function DetailProvider({ useCases, children }: DetailProviderProps) {
  return (
    <DetailContext.Provider value={{ useCases }}>
      {children}
    </DetailContext.Provider>
  );
}

export { DetailContext };
export type { DetailContextValue };
