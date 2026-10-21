import { useContext } from "react";

import {
  HeaderTitleContext,
  type HeaderTitleContextValue,
} from "./HeaderTitleProvider";

export function useHeaderTitle(): HeaderTitleContextValue {
  const context = useContext(HeaderTitleContext);
  if (context === null) {
    throw new Error("useHeaderTitle debe usarse dentro de HeaderTitleProvider");
  }
  return context;
}
