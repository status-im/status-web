import QRCode from "qrcode.react";
import React, { useState } from "react";
import styled from "styled-components";

import { buttonStyles } from "../Buttons/buttonStyle";
import { LoginInstructions } from "../Form/LoginInstructions";
import { PasteInput } from "../Form/PasteInput";

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

  const mobileFlow = modalState === StatusModalState.Mobile;
  const desktopFlow = modalState === StatusModalState.Desktop;

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

        {mobileFlow && <QRCode value="https://status.im/get/" size={158} />}

        {desktopFlow && <PasteInput label="Paste sync code" />}

        <LoginInstructions mobileFlow={mobileFlow} />
      </MiddleSection>
    </Modal>
  );
}

const MiddleSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 514px;
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
