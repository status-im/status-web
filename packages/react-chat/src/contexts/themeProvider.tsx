import React, { createContext, ReactNode } from "react";
import { ThemeProvider } from "styled-components";

import { lightTheme, Theme } from "../styles/themes";

export const ThemeContext = createContext<Theme>(lightTheme);

export type ThemeProps = {
  theme: Theme;
  children: ReactNode;
};

export const ThemeContextProvider = ({ theme, children }: ThemeProps) => {
  return (
    <ThemeContext.Provider value={theme}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
