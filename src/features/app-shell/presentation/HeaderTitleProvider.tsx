import {
  createContext,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const HEADER_TITLE_DEFAULT = "INICIO";

type HeaderTitleContextValue = {
  title: string;
  setTitle: (title: string) => void;
};

const HeaderTitleContext = createContext<HeaderTitleContextValue | null>(null);

export function HeaderTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitleState] = useState<string>(HEADER_TITLE_DEFAULT);

  const setTitle = useCallback((nextTitle: string) => {
    setTitleState(nextTitle);
  }, []);

  const value = useMemo(() => ({ title, setTitle }), [title, setTitle]);

  return (
    <HeaderTitleContext.Provider value={value}>
      {children}
    </HeaderTitleContext.Provider>
  );
}

export { HeaderTitleContext };
export type { HeaderTitleContextValue };
