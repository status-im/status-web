import React from "react";

import { GlobalStyle } from "../styles/GlobalStyle";
import { lightTheme } from "../styles/themes";

import { Chat } from "./Chat";

export function ReactChat() {
  return (
    <div>
      <GlobalStyle />
      <Chat channels={true} members={true} theme={lightTheme} />
    </div>
  );
}
