import React from "react";

import { ConnectModal } from "./ConnectModal";
import { Modal } from "./Modal";

export const WalletConnectModalName = "WalletConnectModal";

export function WalletConnectModal() {
  return (
    <Modal name={WalletConnectModalName}>
      <ConnectModal
        name="WalletConnect"
        text="Scan QR code with a WallectConnect-compatible wallet or copy code and
          paste it in your hardware wallet."
        address="https://walletconnect.com/"
      />
    </Modal>
  );
}
