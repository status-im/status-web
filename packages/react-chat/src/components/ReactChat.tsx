import React from "react";

import { community } from "../helpers/communityMock";
import { GlobalStyle } from "../styles/GlobalStyle";
import { lightTheme } from "../styles/themes";

import { Chat } from "./Chat";

export function ReactChat() {
  return (
    <div>
      <GlobalStyle />
      <Chat theme={lightTheme} community={community} />
    </div>
  );
}
