import React from "react";
import styled from "styled-components";

import { useModal } from "../../contexts/modalProvider";
import { WalletConnectIcon } from "../Icons/WalletConnectIcon";

import { Modal } from "./Modal";
import { Heading, Section, Text } from "./ModalStyle";
import { WalleConnectModalName } from "./WalletConnectModal";
// import walletConnect from '../../assets/coinbasewallet.png';
// import walletConnect from '../../assets/metamask.png';

export const WalletModalName = "WalletModal";

export function WalletModal() {
  const { setModal } = useModal(WalletModalName);
  const { setModal: setWalleConnectModal } = useModal(WalleConnectModalName);

  return (
    <Modal name={WalletModalName}>
      <Section>
        <Heading>Connect an Ethereum Wallet</Heading>
      </Section>
      <MiddleSection>
        <Text>Choose a way to chat using your Ethereum address.</Text>
        <Wallets>
          <Wallet onClick={() => (setModal(false), setWalleConnectModal(true))}>
            <Heading>WalletConnect</Heading>
            <WalletConnectIcon />
          </Wallet>
          <Wallet>
            <Heading>Coinbase Wallet</Heading>
            <WalletLogo
              src="../../assets/coinbasewallet.png"
              alt="coinbase wallet logo"
            />
          </Wallet>
          <Wallet>
            <Heading>MetaMask</Heading>
            <WalletLogo src="../../assets/metamask.png" alt="metamask logo" />
          </Wallet>
        </Wallets>
      </MiddleSection>
    </Modal>
  );
}

const MiddleSection = styled(Section)`
  display: flex;
  flex-direction: column;
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

const WalletLogo = styled.img`
  width: 40px;
  height: 40px;
`;
