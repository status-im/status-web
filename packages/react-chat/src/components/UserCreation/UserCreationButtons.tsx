import React, { useMemo } from "react";
import styled from "styled-components";

import { useModal } from "../../contexts/modalProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { loadEncryptedIdentity } from "../../utils";
import { buttonStyles, buttonTransparentStyles } from "../Buttons/buttonStyle";
import { ProfileFoundModalName } from "../Modals/ProfileFoundModal";
import { StatusModalName } from "../Modals/StatusModal";
import { UserCreationModalName } from "../Modals/UserCreationModal";
import { UserCreationStartModalName } from "../Modals/UserCreationStartModal";
import { WalletModalName } from "../Modals/WalletModal";
import { textSmallStyles } from "../Text";

interface UserCreationProps {
  permission: boolean;
}

export function UserCreationButtons({ permission }: UserCreationProps) {
  const narrow = useNarrow();
  const { setModal } = useModal(UserCreationModalName);
  const { setModal: setStatusModal } = useModal(StatusModalName);
  const { setModal: setWalletModal } = useModal(WalletModalName);
  const { setModal: setProfileFoundModal } = useModal(ProfileFoundModalName);
  const { setModal: setCreationStartModal } = useModal(
    UserCreationStartModalName
  );

  const encryptedIdentity = useMemo(() => loadEncryptedIdentity(), []);

  return (
    <Wrapper>
      <LoginBtn
        onClick={() => {
          setStatusModal(true);
          setCreationStartModal(false);
        }}
        className={`${narrow && "narrow"}`}
      >
        Sync with Status profile
      </LoginBtn>
      <LoginBtn
        onClick={() => {
          setWalletModal(true);
          setCreationStartModal(false);
        }}
        className={`${narrow && "narrow"}`}
      >
        Connect Ethereum Wallet
      </LoginBtn>
      {permission && (
        <ThrowAwayButton
          onClick={() => {
            encryptedIdentity ? setProfileFoundModal(true) : setModal(true);
            setCreationStartModal(false);
          }}
        >
          Use a throwaway profile
        </ThrowAwayButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const LoginBtn = styled.button`
  ${buttonStyles}
  ${textSmallStyles}
  padding: 10px 12px;
  margin-bottom: 16px;

  &.narrow {
    margin-bottom: 32px;
  }
`;

const ThrowAwayButton = styled.button`
  ${buttonTransparentStyles}
`;
