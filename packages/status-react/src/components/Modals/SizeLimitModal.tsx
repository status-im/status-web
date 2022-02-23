import React from "react";

import { useModal } from "../../contexts/modalProvider";

import { Modal } from "./Modal";

export const SizeLimitModalName = "SizeLimitModal";

export function SizeLimitModal() {
  const { setModal } = useModal(SizeLimitModalName);

  return (
    <Modal name={SizeLimitModalName}>
      <div onClick={() => setModal(false)} style={{ padding: "20px" }}>
        File size must be less than 1MB
      </div>
    </Modal>
  );
}
