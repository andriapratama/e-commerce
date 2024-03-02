"use client";

import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";

interface LoadingPageContextType {
  isLoadingPage: boolean;
  setIsLoadingPage: Dispatch<SetStateAction<boolean>>;
}

export const LoadingPageContext = createContext<LoadingPageContextType | null>(
  null
);

export default function LoadingPageContextProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const [isLoadingPage, setIsLoadingPage] = useState<boolean>(false);

  return (
    <LoadingPageContext.Provider value={{ isLoadingPage, setIsLoadingPage }}>
      {children}
    </LoadingPageContext.Provider>
  );
}

export const useLoadingPageContext = () => {
  const context = useContext(LoadingPageContext);

  if (!context) {
    throw new Error("Loading page is null");
  }

  const isLoadingPage = context.isLoadingPage;
  const setIsLoadingPage = context.setIsLoadingPage;

  return { isLoadingPage, setIsLoadingPage };
};
