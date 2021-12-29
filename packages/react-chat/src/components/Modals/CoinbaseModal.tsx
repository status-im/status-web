import QRCode from "qrcode.react";
import React from "react";

import { CopyInput } from "../Form/CopyInput";

import { Modal } from "./Modal";
import { Heading, MiddleSection, QRWrapper, Section, Text } from "./ModalStyle";

export const CoinbaseModalName = "CoinbaseModal";

export function CoinbaseModal() {
  return (
    <Modal name={CoinbaseModalName}>
      <Section>
        <Heading>Connect with Coinbase Wallet</Heading>
      </Section>
      <MiddleSection>
        <Text>Scan QR code or copy and pase it in your Coinbase Wallet.</Text>
        <QRWrapper>
          {" "}
          <QRCode value="https://www.coinbase.com/wallet" size={224} />
        </QRWrapper>
        <CopyInput value="2Ef1907d50926...6dt4cEbd975aC5E0Ba" />
      </MiddleSection>
    </Modal>
  );
}
