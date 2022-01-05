import { darkTheme, lightTheme, ReactChat } from "@dappconnect/react-chat";
import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

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

function DragDiv() {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(window.innerWidth - 50);
  const [height, setHeight] = useState(window.innerHeight - 50);
  const [showChat, setShowChat] = useState(true);
  const ref = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  const setting = useRef("");

  const [theme, setTheme] = useState(true);

  const onMouseMove = (e: MouseEvent) => {
    if (setting.current === "position") {
      e.preventDefault();
      setX(e.x - 20);
      setY(e.y - 20);
    }
    if (setting.current === "size") {
      setWidth(e.x - x);
      setHeight(e.y - y);
      e.preventDefault();
    }
    moved.current = true;
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    if (!moved.current) [setShowChat((prev) => !prev)];
    moved.current = false;
  };

  return (
    <>
      <button
        onClick={() => {
          setTheme(!theme);
        }}
      >
        Change theme
      </button>
      <Drag style={{ left: x, top: y, width: width, height: height }} ref={ref}>
        <Bubble
          onMouseDown={() => {
            setting.current = "position";
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
          }}
        />
        <FloatingDiv className={showChat ? "" : "hide"}>
          <ReactChat
            theme={theme ? lightTheme : darkTheme}
            config={{
              communityKey: process.env.COMMUNITY_KEY ?? "",
              environment: process.env.ENV ?? "",
            }}
            fetchMetadata={fetchMetadata}
          />
        </FloatingDiv>
        {showChat && (
          <SizeSet
            onMouseDown={() => {
              setting.current = "size";
              document.addEventListener("mousemove", onMouseMove);
              document.addEventListener("mouseup", onMouseUp);
            }}
          ></SizeSet>
        )}
      </Drag>
    </>
  );
}

const FloatingDiv = styled.div`
  height: calc(100% - 50px);
  border: 1px solid black;

  &.hide {
    display: none;
  }
`;

const SizeSet = styled.div`
  margin-left: auto;
  margin-right: 0px;
  width: 10px;
  height: 10px;
  background-color: light-grey;
  border: 1px solid;
`;

const Bubble = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: lightblue;
  border: 1px solid;
`;

const Drag = styled.div`
  position: absolute;
`;

ReactDOM.render(
  <div style={{ height: "100%" }}>
    <DragDiv />
  </div>,
  document.getElementById("root")
);
