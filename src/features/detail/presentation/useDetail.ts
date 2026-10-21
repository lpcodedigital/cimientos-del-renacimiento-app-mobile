import { useContext } from "react";

import { DetailContext, type DetailContextValue } from "./DetailProvider";

export function useDetail(): DetailContextValue {
  const context = useContext(DetailContext);
  if (context === null) {
    throw new Error("useDetail debe usarse dentro de DetailProvider");
  }
  return context;
}
