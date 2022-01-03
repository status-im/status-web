import React from "react";
import styled from "styled-components";

import { useModal } from "../../contexts/modalProvider";
import { CoinbaseLogo } from "../Icons/CoinbaseLogo";
import { MetamaskLogo } from "../Icons/MetamaskLogo";
import { WalletConnectLogo } from "../Icons/WalletConnectLogo";

import { CoinbaseModalName } from "./CoinbaseModal";
import { Modal } from "./Modal";
import { Heading, MiddleSection, Section, Text } from "./ModalStyle";
import { WalletConnectModalName } from "./WalletConnectModal";

export const WalletModalName = "WalletModal";

export function WalletModal() {
  const { setModal } = useModal(WalletModalName);
  const { setModal: setWalleConnectModal } = useModal(WalletConnectModalName);
  const { setModal: setCoinbaseModal } = useModal(CoinbaseModalName);

  return (
    <Modal name={WalletModalName}>
      <Section>
        <Heading>Connect an Ethereum Wallet</Heading>
      </Section>
      <MiddleSectionWallet>
        <Text>Choose a way to chat using your Ethereum address.</Text>
        <Wallets>
          <Wallet onClick={() => (setModal(false), setWalleConnectModal(true))}>
            <Heading>WalletConnect</Heading>
            <WalletConnectLogo />
          </Wallet>
          <Wallet onClick={() => (setModal(false), setCoinbaseModal(true))}>
            <Heading>Coinbase Wallet</Heading>
            <CoinbaseLogo />
          </Wallet>
          <Wallet>
            <Heading>MetaMask</Heading>
            <MetamaskLogo />
          </Wallet>
        </Wallets>
      </MiddleSectionWallet>
    </Modal>
  );
}

const MiddleSectionWallet = styled(MiddleSection)`
  align-items: stretch;
`;

const Wallets = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
`;

const Wallet = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.skeletonDark};
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.buttonBgHover};
  }
`;
