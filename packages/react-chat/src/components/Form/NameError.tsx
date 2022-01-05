import React, { useEffect } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { Hint } from "../Modals/ModalStyle";

interface NameErrorProps {
  nameInput: string;
  setErrorName: (val: boolean) => void;
}

export function NameError({ nameInput, setErrorName }: NameErrorProps) {
  const { contacts } = useMessengerContext();
  const nameExists = Object.values(contacts).find(
    (contact) => contact.trueName === nameInput
  );
  const RegName = new RegExp("^[a-z0-9_-]+$");

  useEffect(() => {
    if (
      nameExists ||
      !nameInput.match(RegName) ||
      nameInput.slice(-4) === "_eth" ||
      nameInput.slice(-4) === "-eth" ||
      nameInput.length === 24
    ) {
      setErrorName(true);
    }
  }, [nameInput]);

  return (
    <ErrorText>
      {nameExists &&
        "Sorry, the name you have chosen is not allowed, try picking another username"}
      {!nameInput.match(RegName) &&
        "Only letters, numbers, underscores and hypens allowed"}
      {nameInput.slice(-4) === "_eth" &&
        "Usernames ending with “_eth” are not allowed"}
      {nameInput.slice(-4) === "-eth" &&
        "Usernames ending with “-eth” are not allowed"}
      {nameInput.length === 24 && "24 character username limit"}
    </ErrorText>
  );
}

const ErrorText = styled(Hint)`
  color: ${({ theme }) => theme.redColor};
  text-align: center;
  width: 328px;
  margin: 8px 0;
`;
