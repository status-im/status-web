import QRCode from "qrcode.react";
import React from "react";
import styled from "styled-components";

import { CopyInput } from "../Form/CopyInput";

import { Modal } from "./Modal";
import { Heading, Section, Text } from "./ModalStyle";

export const WalleConnectModalName = "WalleConnectModal";

export function WalleConnectModal() {
  return (
    <Modal name={WalleConnectModalName}>
      <Section>
        <Heading>Connect with WalletConnect</Heading>
      </Section>
      <MiddleSection>
        <Text>
          Scan QR code with a WallectConnect-compatible wallet or copy code and
          paste it in your hardware wallet.
        </Text>
        <QRWrapper>
          {" "}
          <QRCode value="https://walletconnect.com/" size={224} />
        </QRWrapper>
        <CopyInput value="2Ef1907d50926...6dt4cEbd975aC5E0Ba" />
      </MiddleSection>
    </Modal>
  );
}

const MiddleSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const QRWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.border};
  box-sizing: border-box;
  border-radius: 8px;
  margin: 16px 0;
  padding: 14px;
`;
