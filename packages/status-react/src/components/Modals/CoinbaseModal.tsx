import React from "react";

import { ConnectModal } from "./ConnectModal";
import { Modal } from "./Modal";

export const CoinbaseModalName = "CoinbaseModal";

export function CoinbaseModal() {
  return (
    <Modal name={CoinbaseModalName}>
      <ConnectModal
        name="Coinbase Wallet"
        text="Scan QR code or copy and pase it in your Coinbase Wallet."
        address="https://www.coinbase.com/wallet"
      />
    </Modal>
  );
}
