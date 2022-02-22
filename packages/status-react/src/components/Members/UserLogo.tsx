import React, { useMemo } from "react";
import styled from "styled-components";

import { Contact } from "../../models/Contact";

type UserLogoProps = {
  radius: number;
  colorWheel: [string, number][];
  contact?: Contact;
  showOnlineStatus?: boolean;
  icon?: string;
};

export function UserLogo({
  icon,
  contact,
  radius,
  colorWheel,
  showOnlineStatus,
}: UserLogoProps) {
  const conicGradient = useMemo(() => {
    const colors = colorWheel
      .map((color, idx) => {
        const prevDeg = idx === 0 ? "0deg" : `${colorWheel[idx - 1][1]}deg`;
        return `${color[0]} ${prevDeg} ${color[1]}deg`;
      })
      .join(",");
    return `conic-gradient(${colors})`;
  }, [colorWheel]);

  const letters = useMemo(() => {
    if (contact && contact?.customName) {
      return contact.customName.slice(0, 2);
    }
    if (contact && contact.trueName) {
      return contact.trueName.slice(0, 2);
    }
  }, [contact]);

  const logoClassnName = useMemo(() => {
    if (showOnlineStatus) {
      if (contact && contact.online) {
        return "online";
      }
      return "offline";
    }
    return "";
  }, [contact, showOnlineStatus]);

  return (
    <Wrapper radius={radius} conicGradient={conicGradient}>
      <Logo
        icon={icon}
        radius={radius}
        className={contact ? logoClassnName : "empty"}
      >
        {!icon && <TextWrapper radius={radius}>{letters}</TextWrapper>}
      </Logo>
    </Wrapper>
  );
}

const TextWrapper = styled.div<{ radius: number }>`
  font-weight: bold;
  font-size: calc(${({ radius }) => radius}px / 2.5);
  line-height: calc(${({ radius }) => radius}px / 2.1);
  display: flex;
  align-items: center;
  text-align: center;
  letter-spacing: -0.4px;
  color: ${({ theme }) => theme.iconTextColor};
`;

const Logo = styled.div<{ radius: number; icon?: string }>`
  width: calc(${({ radius }) => radius}px - 6px);
  height: calc(${({ radius }) => radius}px - 6px);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  font-weight: bold;
  font-size: 15px;
  line-height: 20px;
  background-color: ${({ theme }) => theme.logoColor};
  background-size: cover;
  background-repeat: no-repeat;
  background-image: ${({ icon }) => icon && `url(${icon}`};

  &.offline {
    &::after {
      content: "";
      position: absolute;
      right: -1px;
      bottom: -2px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.secondary};
      border: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
    }
  }

  &.online {
    &::after {
      content: "";
      position: absolute;
      right: -1px;
      bottom: -2px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.greenColor};
      border: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
    }
  }

  &.empty {
    background-color: ${({ theme }) => theme.bodyBackgroundColor};
    background-image: none;
  }
`;

export const Wrapper = styled.div<{ radius: number; conicGradient: string }>`
  width: ${({ radius }) => radius}px;
  height: ${({ radius }) => radius}px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ conicGradient }) => conicGradient};
`;
