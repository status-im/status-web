import React, { useCallback, useEffect, useState } from "react";
import { Identity } from "status-communities/dist/cjs";
import styled from "styled-components";

import {
  decryptIdentity,
  loadEncryptedIdentity,
  saveIdentity,
} from "../../utils";

interface IdentityLoaderProps {
  setIdentity: (e: Identity) => void;
}

export function IdentityLoader({ setIdentity }: IdentityLoaderProps) {
  const [password, setPassword] = useState("");
  // Test password for now
  // Need design for password input
  const [encryptedIdentity, setEncryptedIdentity] = useState(
    loadEncryptedIdentity() ?? ""
  );
  const [identityInMemory, setIdentityInMemory] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);

  useEffect(() => {
    if (encryptedIdentity) {
      setIdentityInMemory(true);
    }
    setWrongPassword(false);
  }, [encryptedIdentity]);

  const loadIdentity = useCallback(async () => {
    const identity = await decryptIdentity(encryptedIdentity, password);
    if (!identity) {
      setWrongPassword(true);
    } else {
      setIdentity(identity);
    }
  }, [encryptedIdentity, password]);

  const createIdentity = useCallback(async () => {
    const identity = Identity.generate();
    await saveIdentity(identity, password);
    setIdentity(identity);
  }, [encryptedIdentity, password]);

  return (
    <Wrapper>
      {encryptedIdentity ? (
        <FormWrappers>
          <InfoDiv>Please provide password for your identity</InfoDiv>
          {wrongPassword && <div>Wrong password</div>}
          <Input
            value={password}
            type={"password"}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                loadIdentity();
              }
            }}
          />
          <Button onClick={loadIdentity}>LOAD</Button>
          <Button
            onClick={() => {
              setEncryptedIdentity("");
            }}
          >
            Create new identity
          </Button>
        </FormWrappers>
      ) : (
        <FormWrappers>
          <InfoDiv>Please provide password for your identity</InfoDiv>
          <Input
            value={password}
            type={"password"}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                createIdentity();
              }
            }}
          />
          <Button onClick={createIdentity}>Create</Button>
          {identityInMemory && (
            <Button
              onClick={() =>
                setEncryptedIdentity(loadEncryptedIdentity() ?? "")
              }
            >
              Go back
            </Button>
          )}
        </FormWrappers>
      )}
    </Wrapper>
  );
}

const Input = styled.input`
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
`;

const Button = styled.button`
  padding: 5px;
  margin: 5px;

  box-shadow: 5px 5px 10px -4px rgba(197, 197, 255, 1);
  border-radius: 5px;
  background-color: ${({ theme }) => theme.buttonBg};
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;

const FormWrappers = styled.div`
  margin: auto;
`;

const InfoDiv = styled.div`
  margin: 5px;
  font-weight: 500;
  font-size: 16px;
`;
