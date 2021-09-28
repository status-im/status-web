import React from "react";

import { GlobalStyle } from "../styles/GlobalStyle";
import { lightTheme } from "../styles/themes";

import { Chat } from "./Chat";

export function ReactChat() {
  return (
    <div>
      <GlobalStyle />
      <Chat channelsON={true} membersON={true} theme={lightTheme} />
    </div>
  );
}
