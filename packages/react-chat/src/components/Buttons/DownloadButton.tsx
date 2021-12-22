import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { buttonStyles } from "./buttonStyle";

const userAgent = window.navigator.userAgent;
const platform = window.navigator.platform;
const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
const iosPlatforms = ["iPhone", "iPad", "iPod"];

interface DownloadButtonProps {
  className?: string;
}

export const DownloadButton = ({ className }: DownloadButtonProps) => {
  const [link, setlink] = useState("https://status.im/get/");
  const [os, setOs] = useState<string | null>(null);

  useEffect(() => {
    if (macosPlatforms.includes(platform)) {
      setlink(
        "https://status-im-files.ams3.cdn.digitaloceanspaces.com/StatusIm-Desktop-v0.3.0-beta-a8c37d.dmg"
      );
      setOs("Mac");
    } else if (iosPlatforms.includes(platform)) {
      setlink(
        "https://apps.apple.com/us/app/status-private-communication/id1178893006"
      );
      setOs("iOS");
    } else if (windowsPlatforms.includes(platform)) {
      setlink(
        "https://status-im-files.ams3.cdn.digitaloceanspaces.com/StatusIm-Desktop-v0.3.0-beta-a8c37d.exe"
      );
      setOs("Windows");
    } else if (/Android/.test(userAgent)) {
      setlink(
        "https://play.google.com/store/apps/details?id=im.status.ethereum"
      );
      setOs("Android");
    } else if (/Linux/.test(platform)) {
      setlink(
        "https://status-im-files.ams3.cdn.digitaloceanspaces.com/StatusIm-Desktop-v0.3.0-beta-a8c37d.tar.gz"
      );
      setOs("Linux");
    }
  }, []);

  return (
    <Link
      className={className}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {os
        ? `${className === "activity" ? "d" : "D"}ownload Status for ${os}`
        : `${className === "activity" ? "d" : "D"}ownload Status`}
    </Link>
  );
};

const Link = styled.a`
  margin-top: 24px;
  padding: 11px 32px;

  ${buttonStyles}

  &.activity {
    margin: 0;
    padding: 0;
    color: ${({ theme }) => theme.secondary};
    font-style: italic;
    border-radius: 0;
    font-weight: 400;
    text-decoration: underline;
    background: inherit;

    &:hover {
      background: inherit;
      color: ${({ theme }) => theme.tertiary};
    }
  }
`;
