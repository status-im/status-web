import React from "react";

import { ConnectModal } from "./ConnectModal";
import { Modal } from "./Modal";

export const WalleConnectModalName = "WalleConnectModal";

export function WalleConnectModal() {
  return (
    <Modal name={WalleConnectModalName}>
      <ConnectModal
        name="WalletConnect"
        text="Scan QR code with a WallectConnect-compatible wallet or copy code and
          paste it in your hardware wallet."
        address="https://walletconnect.com/"
      />
    </Modal>
  );
}
