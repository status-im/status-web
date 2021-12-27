import QRCode from "qrcode.react";
import React, { useState } from "react";
import styled from "styled-components";

import { buttonStyles } from "../Buttons/buttonStyle";
import { MobileIcon } from "../Icons/MobileIcon";
import { ProfileSvg } from "../Icons/ProfileIcon";
import { ScanIcon } from "../Icons/ScanIcon";
import { textMediumStyles } from "../Text";

import { Modal } from "./Modal";
import { Heading, Section } from "./ModalStyle";

export const StatusModalName = "StatusModal";

export enum StatusModalState {
  Mobile,
  Desktop,
}

export function StatusModal() {
  const [modalState, setModalState] = useState<StatusModalState>(
    StatusModalState.Mobile
  );

  const switchModalState = (state: StatusModalState) => {
    setModalState((prev) => (prev === state ? StatusModalState.Mobile : state));
  };
  return (
    <Modal name={StatusModalName}>
      <Section>
        <Heading>Sync with Status profile</Heading>
      </Section>
      <MiddleSection>
        <Switch>
          <SwitchBtn
            className={`${modalState === StatusModalState.Mobile && "active"}`}
            onClick={() => switchModalState(StatusModalState.Mobile)}
          >
            From mobile
          </SwitchBtn>
          <SwitchBtnMobile
            className={`${modalState === StatusModalState.Desktop && "active"}`}
            onClick={() => switchModalState(StatusModalState.Desktop)}
          >
            From desktop
          </SwitchBtnMobile>
        </Switch>

        {modalState === StatusModalState.Mobile && (
          <>
            <QRCode value="https://status.im/get/" size={158} />
            <Instructions>
              <InstructionStep>Open Status App on your mobile</InstructionStep>
              <InstructionStep>
                Navigate yourself to{" "}
                <InstructionIcon>
                  {" "}
                  <ProfileSvg width={13} height={13} /> <span>Profile</span>
                </InstructionIcon>{" "}
                tab
              </InstructionStep>
              <InstructionStep>
                Select{" "}
                <InstructionIcon>
                  <MobileIcon />
                </InstructionIcon>{" "}
                <span>Sync Settings</span>
              </InstructionStep>
              <InstructionStep>
                Tap{" "}
                <InstructionIcon>
                  {" "}
                  <ScanIcon />{" "}
                </InstructionIcon>{" "}
                <span>Scan sync code</span>
              </InstructionStep>
              <InstructionStep>
                Scan the sync code from this screen ↑
              </InstructionStep>
            </Instructions>
          </>
        )}
      </MiddleSection>
    </Modal>
  );
}

const MiddleSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
`;

const Switch = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 32px;
`;

const SwitchBtn = styled.button`
  ${buttonStyles}
  width: 159px;
  padding: 7px 0;
  text-align: center;
  color: ${({ theme }) => theme.tertiary};
  background: ${({ theme }) => theme.buttonBg};
  position: relative;

  &.active {
    background: ${({ theme }) => theme.tertiary};
    color: ${({ theme }) => theme.bodyBackgroundColor};
    z-index: 10000;
  }
`;

const SwitchBtnMobile = styled(SwitchBtn)`
  margin-left: -8px;
`;

const Instructions = styled.ol`
  color: ${({ theme }) => theme.secondary};
  margin-top: 32px;
  list-style-type: decimal;
  counter-reset: ollist;

  ${textMediumStyles}
`;

const InstructionStep = styled.li`
  display: flex;
  align-items: center;

  & + & {
    margin-top: 10px;
  }

  & > span {
    color: ${({ theme }) => theme.tertiary};
  }

  &::before {
    counter-increment: ollist;
    content: counter(ollist) ".";
    margin-right: 4px;
  }
`;

const InstructionIcon = styled.div`
  width: 40px;
  height: 40px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.buttonBg};
  color: ${({ theme }) => theme.tertiary};
  font-size: 8px;
  line-height: 10px;
  margin: 0 6px;
`;
