import { community, lightTheme, ReactChat } from "@dappconnect/react-chat";
import React from "react";
import ReactDOM from "react-dom";

const fetchMetadata = async (link: string) => {
  const response = await fetch("https://localhost:3000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ site: link }),
  });
  const body = await response.text();
  const parsedBody = JSON.parse(body);
  if (
    "og:image" in parsedBody &&
    "og:site_name" in parsedBody &&
    "og:title" in parsedBody
  ) {
    return JSON.parse(body);
  }
};

ReactDOM.render(
  <div style={{ height: "100%" }}>
    <ReactChat
      theme={lightTheme}
      community={community}
      fetchMetadata={fetchMetadata}
    />
  </div>,
  document.getElementById("root")
);
