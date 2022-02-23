import React from "react";
import styled from "styled-components";

import { useToasts } from "../../contexts/toastProvider";

import { ToastMessage } from "./ToastMessage";

export function ToastMessageList() {
  const { toasts } = useToasts();

  return (
    <ToastsWrapper>
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} toast={toast} />
      ))}
    </ToastsWrapper>
  );
}

const ToastsWrapper = styled.div`
  position: absolute;
  bottom: 56px;
  right: 16px;
  width: 343px;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  z-index: 999;
`;
