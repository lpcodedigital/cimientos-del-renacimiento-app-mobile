import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const HEADER_TITLE_DEFAULT = "INICIO";

export type HeaderLeftMode = "menu" | "back";

type HeaderTitleContextValue = {
  title: string;
  setTitle: (title: string) => void;
  leftMode: HeaderLeftMode;
  setLeftMode: (mode: HeaderLeftMode) => void;
};

const HeaderTitleContext = createContext<HeaderTitleContextValue | null>(null);

export function HeaderTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState<string>(HEADER_TITLE_DEFAULT);
  const [leftMode, setLeftModeState] = useState<HeaderLeftMode>("menu");

  const setTitle = useCallback((nextTitle: string) => {
    setTitleState(nextTitle);
  }, []);

  const setLeftMode = useCallback((nextMode: HeaderLeftMode) => {
    setLeftModeState(nextMode);
  }, []);

  const value = useMemo(
    () => ({ title, setTitle, leftMode, setLeftMode }),
    [title, setTitle, leftMode, setLeftMode],
  );

  return (
    <HeaderTitleContext.Provider value={value}>
      {children}
    </HeaderTitleContext.Provider>
  );
}

export { HeaderTitleContext };
export type { HeaderTitleContextValue };
