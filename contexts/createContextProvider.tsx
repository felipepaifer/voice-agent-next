"use client";

import { createContext, useContext } from "react";

export function createContextProvider<T>(useStateHook: () => T) {
  const Context = createContext<T | undefined>(undefined);

  function Provider({ children }: { children: React.ReactNode }) {
    const value = useStateHook();
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useValue() {
    const ctx = useContext(Context);
    if (!ctx) {
      throw new Error("Context hook used outside provider.");
    }
    return ctx;
  }

  return [Provider, useValue] as const;
}
