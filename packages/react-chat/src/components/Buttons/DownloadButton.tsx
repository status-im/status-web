import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Theme } from "../../styles/themes";

const userAgent = window.navigator.userAgent;
const platform = window.navigator.platform;
const macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"];
const windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"];
const iosPlatforms = ["iPhone", "iPad", "iPod"];

interface DownloadButtonProps {
  theme: Theme;
  className?: string;
}

export const DownloadButton = ({ theme, className }: DownloadButtonProps) => {
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
      theme={theme}
      target="_blank"
      rel="noopener noreferrer"
    >
      {os ? `Download Status for ${os}` : "Download Status"}
    </Link>
  );
};

const Link = styled.a`
  margin-top: 24px;
  padding: 11px 32px;
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  text-align: center;
  color: ${({ theme }) => theme.tertiary};
  background: ${({ theme }) => theme.buttonBg};
  border-radius: 8px;
`;
