import { Identity } from "@waku/status-communities/dist/cjs";
import { genPrivateKeyWithEntropy } from "@waku/status-communities/dist/cjs/utils";
import React, { useCallback } from "react";
import styled from "styled-components";

import { useConfig } from "../../contexts/configProvider";
import {
  useSetIdentity,
  useSetWalletIdentity,
} from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { CoinbaseLogo } from "../Icons/CoinbaseLogo";
import { MetamaskLogo } from "../Icons/MetamaskLogo";
import { WalletConnectLogo } from "../Icons/WalletConnectLogo";

import { CoinbaseModalName } from "./CoinbaseModal";
import { Modal } from "./Modal";
import { Heading, MiddleSection, Section, Text } from "./ModalStyle";
import { UserCreationModalName } from "./UserCreationModal";
import { WalletConnectModalName } from "./WalletConnectModal";

export const WalletModalName = "WalletModal";

export function WalletModal() {
  const { setModal } = useModal(WalletModalName);
  const setIdentity = useSetIdentity();
  const setWalletIdentity = useSetWalletIdentity();
  const userCreationModal = useModal(UserCreationModalName);
  const { setModal: setWalleConnectModal } = useModal(WalletConnectModalName);
  const { setModal: setCoinbaseModal } = useModal(CoinbaseModalName);
  const { messenger } = useMessengerContext();
  const { dappUrl } = useConfig();

  const handleMetamaskClick = useCallback(async () => {
    const ethereum = (window as any)?.ethereum as any | undefined;
    if (document.location.origin !== dappUrl) {
      alert("You are not signing in from correct url!");
      return;
    }
    if (ethereum && messenger) {
      try {
        if (ethereum?.isMetaMask) {
          const [account] = await ethereum.request({
            method: "eth_requestAccounts",
          });

          const msgParams = JSON.stringify({
            domain: {
              chainId: 1,
              name: window.location.origin,
              version: "1",
            },
            message: {
              action: "Status Chat Key",
              onlySignOn: dappUrl,
              message:
                "I'm aware that i am signing message that creates a private chat key for status communicator. And I have double checked everything is fine.",
            },
            primaryType: "Mail",
            types: {
              EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
              ],
              Mail: [
                { name: "action", type: "string" },
                { name: "onlySignOn", type: "string" },
                { name: "message", type: "string" },
              ],
            },
          });

          const params = [account, msgParams];
          const method = "eth_signTypedData_v4";

          const signature = await ethereum.request({
            method,
            params,
            from: account,
          });
          const privateKey = genPrivateKeyWithEntropy(signature);

          const loadedIdentity = new Identity(privateKey);

          const userInNetwork = await messenger.checkIfUserInWakuNetwork(
            loadedIdentity.publicKey
          );

          if (userInNetwork) {
            setIdentity(loadedIdentity);
          } else {
            setWalletIdentity(loadedIdentity);
            userCreationModal.setModal(true);
          }
          setModal(false);
          return;
        }
      } catch {
        alert("Error");
      }
    }
    alert("Metamask not found");
  }, [messenger]);

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
          <Wallet onClick={handleMetamaskClick}>
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
