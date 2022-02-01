import { bufToHex } from "@waku/status-communities/dist/cjs/utils";
import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useIdentity } from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { useToasts } from "../../contexts/toastProvider";
import { copy } from "../../utils";
import { buttonStyles } from "../Buttons/buttonStyle";
import {
  ClearBtn,
  inputStyles,
  NameInput,
  NameInputWrapper,
} from "../Form/inputStyles";
import { ClearSvgFull } from "../Icons/ClearIconFull";
import { CopyIcon } from "../Icons/CopyIcon";
import { EditIcon } from "../Icons/EditIcon";
import { LeftIcon } from "../Icons/LeftIcon";
import { UntrustworthIcon } from "../Icons/UntrustworthIcon";
import { UserIcon } from "../Icons/UserIcon";
import { textMediumStyles, textSmallStyles } from "../Text";

import { Modal } from "./Modal";
import {
  BackBtn,
  Btn,
  ButtonSection,
  Heading,
  Hint,
  Section,
} from "./ModalStyle";

export const ProfileModalName = "profileModal" as const;

export type ProfileModalProps = {
  id: string;
  image?: string;
  renamingState?: boolean;
  requestState?: boolean;
};

export const ProfileModal = () => {
  const { props } = useModal(ProfileModalName);
  const { id, image, renamingState, requestState } = useMemo(
    () => (props ? props : { id: "" }),
    [props]
  );

  const { setToasts } = useToasts();
  const { setModal } = useModal(ProfileModalName);

  const identity = useIdentity();
  const isUser = useMemo(() => {
    if (identity) {
      return id === bufToHex(identity.publicKey);
    } else {
      return false;
    }
  }, [id, identity]);

  const [renaming, setRenaming] = useState(renamingState ?? false);

  useEffect(() => {
    setRenaming(renamingState ?? false);
  }, [renamingState]);

  const [request, setRequest] = useState("");
  const [requestCreation, setRequestCreation] = useState(requestState ?? false);

  useEffect(() => {
    setRequestCreation(requestState ?? false);
  }, [requestState]);

  const { contacts, contactsDispatch } = useMessengerContext();
  const contact = useMemo(() => contacts[id], [id, contacts]);
  const [customNameInput, setCustomNameInput] = useState("");

  if (!contact) return null;
  return (
    <Modal name={ProfileModalName} className={`${!requestCreation && "wide"}`}>
      <Section>
        <Heading>{contact.trueName}’s Profile</Heading>
      </Section>

      <ProfileSection>
        <NameSection className={`${requestCreation && "small"}`}>
          {image ? (
            <ProfileIcon
              style={{
                backgroundImage: `url(${image}`,
              }}
              className={`${requestCreation && "small"}`}
            />
          ) : (
            <UserIcon modalView={!requestCreation} />
          )}
          <UserNameWrapper>
            <UserName className={`${requestCreation && "small"}`}>
              {contact?.customName ?? contact.trueName}
            </UserName>
            {contact.isUntrustworthy && <UntrustworthIcon />}
            {!renaming && (
              <button onClick={() => setRenaming(true)}>
                {" "}
                {!requestCreation && <EditIcon width={24} height={24} />}
              </button>
            )}
          </UserNameWrapper>
          {contact?.customName && (
            <UserTrueName>{contact.trueName}</UserTrueName>
          )}
        </NameSection>
        {renaming ? (
          <NameInputWrapper>
            <NameInput
              placeholder="Only you will see this nickname"
              value={customNameInput}
              onChange={(e) => setCustomNameInput(e.currentTarget.value)}
            />
            {customNameInput && (
              <ClearBtn
                onClick={() => {
                  contactsDispatch({
                    type: "setCustomName",
                    payload: { id, customName: undefined },
                  });
                  setCustomNameInput("");
                }}
              >
                <ClearSvgFull width={16} height={16} />
              </ClearBtn>
            )}
          </NameInputWrapper>
        ) : (
          <>
            <UserAddressWrapper className={`${requestCreation && "small"}`}>
              {requestCreation ? (
                <UserAddress>
                  {id.slice(0, 10)}...{id.slice(-3)}
                </UserAddress>
              ) : (
                <>
                  <UserAddress className={`${requestCreation && "small"}`}>
                    Chatkey: {id.slice(0, 30)}
                  </UserAddress>

                  <CopyButton onClick={() => copy(id)}>
                    <CopyIcon width={24} height={24} />
                  </CopyButton>
                </>
              )}
            </UserAddressWrapper>
            <EmojiKey className={`${requestCreation && "small"}`}>
              🎩🍞🥑🦍🌈📡💅🏻♣️🔔⛸👵🅱
            </EmojiKey>{" "}
          </>
        )}
        {requestCreation && (
          <RequestSection>
            <Hint>{request.length}/280</Hint>
            <RequestInput
              value={request}
              placeholder="Say who you are / why you want to became a contact..."
              maxLength={280}
              onInput={(e) => setRequest(e.currentTarget.value)}
              required
              autoFocus
            />
          </RequestSection>
        )}
      </ProfileSection>
      <ButtonSection>
        {renaming ? (
          <>
            <BackBtn onClick={() => setRenaming(false)}>
              <LeftIcon width={28} height={28} />
            </BackBtn>
            <Btn
              disabled={!customNameInput}
              onClick={() => {
                contactsDispatch({
                  type: "setCustomName",
                  payload: { id, customName: customNameInput },
                });
                setRenaming(false);
              }}
            >
              Apply nickname
            </Btn>
          </>
        ) : requestCreation ? (
          <>
            <BackBtn onClick={() => setRequestCreation(false)}>
              <LeftIcon width={28} height={28} />
            </BackBtn>
            <Btn
              disabled={!request}
              onClick={() => {
                setToasts((prev) => [
                  ...prev,
                  {
                    id: id + request,
                    type: "confirmation",
                    text: "Contact Request Sent",
                  },
                ]),
                  setRequestCreation(false),
                  setModal(false),
                  setRequest("");
              }}
            >
              Send Contact Request
            </Btn>
          </>
        ) : (
          <>
            {!contact.isFriend && !isUser && (
              <ProfileBtn
                className={contact.blocked ? "" : "red"}
                onClick={() => {
                  contactsDispatch({ type: "toggleBlocked", payload: { id } });
                }}
              >
                {contact.blocked ? "Unblock" : "Block"}
              </ProfileBtn>
            )}
            {contact.isFriend && (
              <ProfileBtn
                className="red"
                onClick={() =>
                  contactsDispatch({
                    type: "setIsFriend",
                    payload: { id, isFriend: false },
                  })
                }
              >
                Remove Contact
              </ProfileBtn>
            )}
            <ProfileBtn
              className={contact.isUntrustworthy ? "" : "red"}
              onClick={() =>
                contactsDispatch({ type: "toggleTrustworthy", payload: { id } })
              }
            >
              {contact.isUntrustworthy
                ? "Remove Untrustworthy Mark"
                : "Mark as Untrustworthy"}
            </ProfileBtn>
            {!contact.isFriend && (
              <Btn onClick={() => setRequestCreation(true)}>
                Send Contact Request
              </Btn>
            )}
          </>
        )}
      </ButtonSection>
    </Modal>
  );
};

const ProfileSection = styled(Section)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NameSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;

  &.small {
    margin-bottom: 0;
  }
`;

const ProfileIcon = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: end;
  border-radius: 50%;
  background-color: #bcbdff;
  background-size: contain;
  background-position: center;
  flex-shrink: 0;
  position: relative;
  cursor: pointer;

  &.small {
    width: 64px;
    height: 64px;
  }
`;

export const UserNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;

  & > svg {
    fill: ${({ theme }) => theme.tertiary};
  }

  &.logout {
    margin: 8px 0;
  }
`;

export const UserName = styled.p`
  color: ${({ theme }) => theme.primary};
  font-weight: bold;
  font-size: 22px;
  line-height: 30px;
  letter-spacing: -0.2px;
  margin-right: 8px;

  &.small {
    font-size: 17px;
    line-height: 24px;
    margin-right: 0;
  }
`;

const UserTrueName = styled.p`
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  margin-top: 8px;
`;

export const UserAddressWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;

  &.small {
    margin-bottom: 8px;
  }
`;

export const UserAddress = styled.p`
  display: flex;
  letter-spacing: 1px;
  margin-right: 8px;
  color: ${({ theme }) => theme.secondary};

  ${textMediumStyles}

  &.small {
    margin-right: 0;

    ${textSmallStyles}
  }
`;
export const EmojiKey = styled.div`
  width: 116px;
  gap: 8px;
  font-size: 15px;
  line-height: 14px;
  letter-spacing: 0.2px;

  &.small {
    width: 83px;
    ${textSmallStyles}
  }
`;

const ProfileBtn = styled.button`
  padding: 11px 24px;
  ${buttonStyles}
  background: ${({ theme }) => theme.bodyBackgroundColor};
  border: 1px solid ${({ theme }) => theme.border};
  margin-left: 8px;

  &.red {
    color: ${({ theme }) => theme.redColor};
  }

  &.red:hover {
    background: ${({ theme }) => theme.buttonNoBgHover};
  }
`;

const CopyButton = styled.button`
  & > svg {
    fill: ${({ theme }) => theme.tertiary};
  }
`;

const RequestSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 16px 0;
`;

const RequestInput = styled.textarea`
  width: 100%;
  height: 152px;
  padding: 10px 16px;
  resize: none;
  margin-top: 16px;
  font-family: "Inter";

  ${inputStyles}
`;
