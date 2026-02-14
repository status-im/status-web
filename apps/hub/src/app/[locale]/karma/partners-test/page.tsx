'use client'

// Please don't review this file
// This file is a temporary testing page for Karma partners simulation flow
// This file should be removed when the PR is reviewed
import { useState } from 'react'

import { HubLayout } from '~components/hub-layout'
import { AirdropClaimCard, KarmaPartnersPanel } from '~components/karma'

export default function KarmaPartnersTestPage() {
  const [airdropAddress, setAirdropAddress] = useState('')
  const [copiedKey, setCopiedKey] = useState('')

  const ozV4ImportPatch = `import "@openzeppelin/contracts@4.9.6/access/Ownable2Step.sol";
import "@openzeppelin/contracts@4.9.6/security/Pausable.sol";`

  const remixDeployInputsQuickCopy = `_token: 0xYourTokenAddress
_owner: 0xYourWalletAddress
_allowMerkleRootUpdate: true
_defaultDelegatee: 0xYourWalletAddress`

  const simulationTokenDeployQuickCopy =
    'initialSupply: 1000000000000000000000 // 1000 tokens (18 decimals)'

  const simulationVotesTokenTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.2/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@5.0.2/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts@5.0.2/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts@5.0.2/utils/Nonces.sol";

contract PartnerSimulationVotesToken is ERC20, ERC20Permit, ERC20Votes {
    constructor(uint256 initialSupply)
        ERC20("Partner Simulation Karma", "pKARMA")
        ERC20Permit("Partner Simulation Karma")
    {
        _mint(msg.sender, initialSupply);
    }

    function _update(address from, address to, uint256 value)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, value);
    }

    function nonces(address owner)
        public
        view
        override(ERC20Permit, Nonces)
        returns (uint256)
    {
        return super.nonces(owner);
    }
}`

  const minimalKarmaAirdropTemplate = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.2/access/Ownable2Step.sol";
import "@openzeppelin/contracts@5.0.2/utils/Pausable.sol";
import "@openzeppelin/contracts@5.0.2/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts@5.0.2/utils/cryptography/MerkleProof.sol";

contract KarmaAirdrop is Ownable2Step, Pausable {
    IERC20 public immutable token;
    bytes32 public merkleRoot;
    bool public allowMerkleRootUpdate;
    address public defaultDelegatee;

    mapping(uint256 => uint256) private claimedBitMap;

    event Claimed(uint256 indexed index, address indexed account, uint256 amount);
    event MerkleRootSet(bytes32 indexed merkleRoot);

    constructor(
        address _token,
        address _owner,
        bool _allowMerkleRootUpdate,
        address _defaultDelegatee
    ) Ownable(_owner) {
        require(_token != address(0), "Invalid token");
        require(_owner != address(0), "Invalid owner");

        token = IERC20(_token);
        allowMerkleRootUpdate = _allowMerkleRootUpdate;
        defaultDelegatee = _defaultDelegatee;
    }

    function isClaimed(uint256 index) public view returns (bool) {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        uint256 claimedWord = claimedBitMap[claimedWordIndex];
        uint256 mask = (1 << claimedBitIndex);
        return claimedWord & mask == mask;
    }

    function _setClaimed(uint256 index) private {
        uint256 claimedWordIndex = index / 256;
        uint256 claimedBitIndex = index % 256;
        claimedBitMap[claimedWordIndex] = claimedBitMap[claimedWordIndex] | (1 << claimedBitIndex);
    }

    function claim(
        uint256 index,
        address account,
        uint256 amount,
        bytes32[] calldata merkleProof
    ) external whenNotPaused {
        require(!isClaimed(index), "Already claimed");

        bytes32 node = keccak256(abi.encodePacked(index, account, amount));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), "Invalid proof");

        _setClaimed(index);
        require(token.transfer(account, amount), "Token transfer failed");

        emit Claimed(index, account, amount);
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        require(_merkleRoot != bytes32(0), "Invalid root");
        require(allowMerkleRootUpdate || merkleRoot == bytes32(0), "Merkle root update disabled");
        merkleRoot = _merkleRoot;
        emit MerkleRootSet(_merkleRoot);
    }

    function updateMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        require(allowMerkleRootUpdate, "Merkle root update disabled");
        require(_merkleRoot != bytes32(0), "Invalid root");
        merkleRoot = _merkleRoot;
        emit MerkleRootSet(_merkleRoot);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}`

  const copySnippet = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      setTimeout(() => {
        setCopiedKey(current => (current === key ? '' : current))
      }, 2000)
    } catch {
      setCopiedKey('')
    }
  }

  return (
    <HubLayout>
      <div className="mx-auto flex size-full flex-col gap-4 p-4 lg:gap-8 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-27 font-semibold">Karma Partner Simulation</h1>
          <p className="text-15 text-neutral-60">
            Follow each step from top to bottom.
          </p>
          <p className="text-15 text-neutral-60">
            This page is for testing purposes only. Will be removed when the PR
            is reviewed (or can keep it if useful)
          </p>
        </div>

        <section className="rounded-8 border border-neutral-20 bg-white-100 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-neutral-20 px-2 py-0.5 text-11 font-medium text-neutral-70">
              Step 1
            </span>
            <h2 className="text-15 font-semibold text-neutral-100">
              Prepare wallet and deploy KarmaAirdrop in{' '}
              <a
                href="https://remix.ethereum.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Remix
              </a>
            </h2>
          </div>

          <p className="mb-3 text-15 text-neutral-60">
            Use your own wallet to deploy the contract in Remix. Then use the
            same wallet in Step 4 to post Merkle root onchain.
          </p>

          <div className="mb-3 rounded-8 bg-neutral-10 p-3 text-15 text-neutral-70">
            <p>
              Network: Status Network Testnet (Chain ID: <b>1660990954</b>)
            </p>
            <p>RPC: https://public.sepolia.rpc.status.network</p>
            <p>Explorer: https://sepoliascan.status.network</p>
            <p className="mt-1">
              Contract ETH balance can be <b>0</b>. What you need is test ETH in
              your wallet for gas when deploying/posting root/claiming.
            </p>
          </div>

          <ol className="list-decimal space-y-2 pl-5 text-15 text-neutral-70">
            <li>
              Open your wallet (for example MetaMask),{' '}
              <a
                href="https://docs.status.network/general-info/add-status-network/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                add Status testnet
              </a>
              , and
              {` `}
              <a
                href="https://faucet.status.network/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                receive test ETH from faucet.
              </a>
            </li>
            <li>
              Open{' '}
              <a
                href="https://remix.ethereum.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Remix
              </a>{' '}
              and create two files in <b>/contracts</b>:
              <b> PartnerSimulationVotesToken.sol</b> and{' '}
              <b>KarmaAirdrop.sol</b>.
              <br />
              1) Paste PartnerSimulationVotesToken code from the box below into
              <b> PartnerSimulationVotesToken.sol</b>.
              <br />
              2) Copy the template below into <b>KarmaAirdrop.sol</b>.
            </li>
            <li>
              <div className="mb-3 rounded-8 border border-neutral-20 bg-neutral-10 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-15 font-medium text-neutral-90">
                    PartnerSimulationVotesToken - Deploy ERC20 Votes token
                  </p>
                  <button
                    type="button"
                    className="rounded-8 border border-neutral-20 px-2 py-1 text-15 text-neutral-80"
                    onClick={() =>
                      void copySnippet(
                        'simulation-votes-token-template',
                        simulationVotesTokenTemplate
                      )
                    }
                  >
                    {copiedKey === 'simulation-votes-token-template'
                      ? 'Copied'
                      : 'Copy'}
                  </button>
                </div>
                <p className="mb-2 text-15 text-neutral-70">
                  Recommend changing the token name 'Partner Simulation Karma'
                  and the ticker 'pKARMA'
                </p>
                <pre className="overflow-x-auto rounded-8 bg-white-100 p-3 text-15 text-neutral-80">
                  {simulationVotesTokenTemplate}
                </pre>
                <p className="mt-2 text-15 text-neutral-70">
                  Deploy input example:{' '}
                  <code className="rounded bg-white-100 px-1 py-0.5 text-15">
                    {simulationTokenDeployQuickCopy}
                  </code>
                </p>
              </div>
            </li>
            <li>
              <div className="mb-3 rounded-8 border border-neutral-20 bg-neutral-10 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-15 font-medium text-neutral-90">
                    KarmaAirdrop - Deploy KarmaAirdrop template contract
                  </p>
                  <button
                    type="button"
                    className="rounded-8 border border-neutral-20 px-2 py-1 text-15 text-neutral-80"
                    onClick={() =>
                      void copySnippet(
                        'minimal-karma-airdrop-template',
                        minimalKarmaAirdropTemplate
                      )
                    }
                  >
                    {copiedKey === 'minimal-karma-airdrop-template'
                      ? 'Copied'
                      : 'Copy'}
                  </button>
                </div>
                <p className="mb-2 text-15 text-neutral-70">
                  If you want to start from scratch quickly, copy this full
                  template and paste into Remix as <b>KarmaAirdrop.sol</b>. This
                  is for local testing/simulation flow.
                </p>
                <pre className="overflow-x-auto rounded-8 bg-white-100 p-3 text-15 text-neutral-80">
                  {minimalKarmaAirdropTemplate}
                </pre>
              </div>
            </li>
            <li>
              In Remix, go to <b>Solidity Compiler</b>, choose a compiler
              version compatible with contract <b>pragma</b>, set{' '}
              <b>EVM Version = Paris</b>, then compile both files
              (PartnerSimulationVotesToken.sol and KarmaAirdrop.sol).
            </li>
            <li>
              <div className="mb-3 rounded-8 border border-neutral-20 bg-neutral-10 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-15 font-medium text-neutral-90">
                    Remix Deploy Inputs (For This Simulation)
                  </p>
                  <button
                    type="button"
                    className="rounded-8 border border-neutral-20 px-2 py-1 text-15 text-neutral-80"
                    onClick={() =>
                      void copySnippet(
                        'remix-deploy-inputs-quick-copy',
                        remixDeployInputsQuickCopy
                      )
                    }
                  >
                    {copiedKey === 'remix-deploy-inputs-quick-copy'
                      ? 'Copied'
                      : 'Copy'}
                  </button>
                </div>

                <ul className="mb-2 list-disc space-y-1 pl-5 text-15 text-neutral-70">
                  <li>
                    <code className="rounded bg-white-100 px-1 py-0.5 text-15">
                      _token
                    </code>
                    : use your deployed token address. You can find it in Remix.
                  </li>
                  <li>
                    <code className="rounded bg-white-100 px-1 py-0.5 text-15">
                      _owner
                    </code>
                    : your deployer wallet address (admin for root updates)
                  </li>
                  <li>
                    <code className="rounded bg-white-100 px-1 py-0.5 text-15">
                      _allowMerkleRootUpdate
                    </code>
                    : set to <b>true</b> for testing
                  </li>
                  <li>
                    <code className="rounded bg-white-100 px-1 py-0.5 text-15">
                      _defaultDelegatee
                    </code>
                    : your wallet address (same as owner for now)
                  </li>
                </ul>

                <p className="mt-2 text-15 text-neutral-70">
                  Make sure network is{' '}
                  <b>Status Network Testnet (chainId 1660990954)</b>.
                </p>
              </div>
            </li>
            <li>
              In <b>Deploy & Run Transactions</b>, set Environment to{' '}
              <b>Browser extension {'>'} Injected Provider - MetaMask</b>,
              confirm wallet connection, confirm network is Status testnet, fill
              constructor parameters, and deploy in this order:
              <br />
              1) <b>PartnerSimulationVotesToken</b>
              <br />
              2) <b>KarmaAirdrop</b> (use your deployed token address in
              <code className="rounded ml-1 bg-neutral-10 px-1 py-0.5 text-15">
                _token
              </code>
              )
            </li>
            <li>
              After deployment, copy addresses from Remix Deployed Contracts:
              <b> token address</b> and <b>KarmaAirdrop address</b>. You can
              also confirm both in explorer via deployment tx hashes.
            </li>
            <li>
              From your token contract, call{' '}
              <code className="rounded bg-neutral-10 px-1 py-0.5 text-15">
                transfer(airdropAddress, amount)
              </code>{' '}
              in Remix so KarmaAirdrop has enough token balance before claiming.
              Use <b>10 tokens</b> example value:{' '}
              <code className="rounded bg-neutral-10 px-1 py-0.5 text-15">
                10000000000000000000
              </code>{' '}
              (18 decimals).
            </li>
            <li>
              Then call{' '}
              <code className="rounded bg-neutral-10 px-1 py-0.5 text-15">
                balanceOf(airdropAddress)
              </code>{' '}
              on the same token contract and confirm the returned amount is
              greater than or equal to total claim amount.
            </li>
            <li>
              Keep these values: deployed contract address, deployment tx hash,
              constructor parameters.
            </li>
          </ol>

          <div className="mt-3 rounded-8 border border-neutral-20 bg-neutral-10 p-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-neutral-20 px-2 py-0.5 text-11 font-medium text-neutral-70">
                Troubleshooting
              </span>
              <p className="text-15 font-medium text-neutral-90">
                Remix Compile/Deploy errors
              </p>
            </div>
            <div className="mb-3 rounded-8 border border-neutral-20 bg-white-100 p-3">
              <p className="mb-1 text-15 font-medium text-neutral-90">
                If deployment fails with status 0
              </p>
              <ul className="list-disc space-y-1 pl-5 text-15 text-neutral-70">
                <li>In Solidity Compiler, set EVM Version to Paris.</li>
                <li>
                  If transaction consumes full gas limit, increase gas limit in
                  Remix (for example 10000000) and deploy again.
                </li>
              </ul>
            </div>
            <div className="mb-3 rounded-8 border border-neutral-20 bg-white-100 p-3">
              <p className="mb-1 text-15 font-medium text-neutral-90">
                If Step 4 fails with owner permission error
              </p>
              <ul className="list-disc space-y-1 pl-5 text-15 text-neutral-70">
                <li>
                  Error message usually includes{' '}
                  <code className="rounded bg-neutral-10 px-1 py-0.5 text-15">
                    Ownable: caller is not the owner
                  </code>
                  .
                </li>
                <li>
                  Switch wallet to the address used as{' '}
                  <code className="rounded bg-neutral-10 px-1 py-0.5 text-15">
                    _owner
                  </code>{' '}
                  at deployment, then click <b>Post Merkle Root Onchain</b>{' '}
                  again.
                </li>
              </ul>
            </div>
            <div className="mb-3 rounded-8 border border-neutral-20 bg-white-100 p-3">
              <p className="mb-1 text-15 font-medium text-neutral-90">
                If Step 4 fails with updateMerkleRoot unknown revert
              </p>
              <ul className="list-disc space-y-1 pl-5 text-15 text-neutral-70">
                <li>
                  Confirm connected wallet is the same address used as{' '}
                  <code className="rounded bg-neutral-10 px-1 py-0.5 text-15">
                    _owner
                  </code>
                  .
                </li>
                <li>
                  If error includes selector{' '}
                  <code className="rounded bg-neutral-10 px-1 py-0.5 text-15">
                    0x5db8ec57
                  </code>{' '}
                  (KarmaAirdrop__MustBePausedToUpdate), do this in Remix with
                  owner wallet:
                  <code className="rounded ml-1 bg-neutral-10 px-1 py-0.5 text-15">
                    pause() → setMerkleRoot(newRoot) → unpause()
                  </code>
                  .
                </li>
                <li>
                  If your contract has{' '}
                  <code className="rounded bg-neutral-10 px-1 py-0.5 text-15">
                    allowMerkleRootUpdate
                  </code>{' '}
                  set to false and root was already set once, update will
                  revert. Deploy a new contract for a fresh simulation.
                </li>
                <li>
                  If this error appears immediately, verify the address is your
                  actual KarmaAirdrop deployment (not a failed deployment
                  address or different contract).
                </li>
              </ul>
            </div>
            <div className="mb-3 rounded-8 border border-neutral-20 bg-white-100 p-3">
              <p className="mb-1 text-15 font-medium text-neutral-90">
                If claim still reverts after root/balance/index checks
              </p>
              <ul className="list-disc space-y-1 pl-5 text-15 text-neutral-70">
                <li>
                  You may be using a KarmaAirdrop implementation that is not
                  compatible with a generic simulation token.
                </li>
                <li>
                  For this page flow, redeploy using the{' '}
                  <b>Minimal KarmaAirdrop Template</b> in Step 1, then run Step
                  2 to Step 5 again.
                </li>
              </ul>
            </div>
            <p className="mb-2 text-15 text-neutral-70">
              If compile fails with{' '}
              <code className="rounded bg-white-100 px-1 py-0.5 text-15">
                No arguments passed to the base constructor
              </code>
              , Remix resolved OpenZeppelin v5 and Ownable now requires
              <code className="rounded ml-1 bg-white-100 px-1 py-0.5 text-15">
                initialOwner
              </code>
              .
            </p>
            <ul className="mb-3 list-disc space-y-1 pl-5 text-15 text-neutral-70">
              <li>
                v4 behavior: Ownable constructor had no required argument.
              </li>
              <li>
                v5 behavior: Ownable constructor requires initial owner address.
              </li>
            </ul>

            <div className="space-y-3">
              <div className="rounded-8 border border-neutral-20 bg-white-100 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-15 font-medium text-neutral-90">
                    Quick alternative fix: pin OpenZeppelin imports to v4
                  </p>
                  <button
                    type="button"
                    className="rounded-8 border border-neutral-20 px-2 py-1 text-15 text-neutral-80"
                    onClick={() =>
                      void copySnippet('oz-v4-import-patch', ozV4ImportPatch)
                    }
                  >
                    {copiedKey === 'oz-v4-import-patch' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="overflow-x-auto rounded-8 bg-neutral-10 p-3 text-15 text-neutral-80">
                  {ozV4ImportPatch}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-8 border border-neutral-20 bg-neutral-30 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-neutral-20 px-2 py-0.5 text-11 font-medium text-neutral-70">
              Step 2
            </span>
            <h2 className="text-15 font-semibold text-neutral-100">
              Enter Your Deployed KarmaAirdrop Address
            </h2>
          </div>
          <p className="mb-3 text-15 text-neutral-60">
            Copy and pastee the airdrop contract address. This address is used
            for Merkle root posting and user claim transactions below.
          </p>
          <label
            htmlFor="airdrop-contract-address"
            className="mb-2 block text-15 font-semibold text-neutral-100"
          >
            KarmaAirdrop Contract Address
          </label>
          <input
            id="airdrop-contract-address"
            className="w-full rounded-8 border border-neutral-20 px-3 py-2 text-15"
            placeholder="0x..."
            value={airdropAddress}
            onChange={e => setAirdropAddress(e.target.value)}
          />
          <p className="mt-2 text-15 text-neutral-60">
            Do not paste token address
            <b> PartnerSimulationVotesToken</b> here. This field must be your
            deployed <b>KarmaAirdrop</b> contract address.
          </p>
        </section>

        <section className="rounded-8 border border-neutral-20 bg-white-100 p-4">
          <div className="mb-3 flex items-center gap-2">
            <span className="rounded-full bg-neutral-20 px-2 py-0.5 text-11 font-medium text-neutral-70">
              Step 3 Preview
            </span>
            <h2 className="text-15 font-semibold text-neutral-100">
              Prepare Merkle Input JSON
            </h2>
          </div>
          <p className="mb-2 text-15 text-neutral-60">
            In Step 3 below, you will generate Merkle root and proofs from a
            recipient list. Prepare JSON in this shape:
          </p>
          <pre className="overflow-x-auto rounded-8 bg-neutral-10 p-3 text-15 text-neutral-80">
            {`[
  {"account":"0xRecipientAddress1","amount":"1000000000000000000"},
  {"account":"0xRecipientAddress2","amount":"2500000000000000000"}
]`}
          </pre>
          <p className="mt-2 text-15 text-neutral-60">
            Amount should be a string in wei units. Example:
            <code className="rounded ml-1 bg-neutral-10 px-1 py-0.5 text-15">
              "1000000000000000000"
            </code>{' '}
            means 1 token (18 decimals). `index` is included in each leaf and
            automatically generated by Step 3 using start index + row order.
          </p>
          <p className="mt-2 text-15 text-neutral-60">
            Leaf format used for hashing: <b>(index, account, amount)</b>.
          </p>
        </section>

        <KarmaPartnersPanel airdropAddress={airdropAddress} />

        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-neutral-20 px-2 py-0.5 text-11 font-medium text-neutral-70">
              Step 5
            </span>
            <h2 className="text-15 font-semibold text-neutral-100">
              Claim as Recipient Wallet
            </h2>
          </div>
          <p className="text-15 text-neutral-60">
            Switch to the recipient wallet, paste the same Merkle output JSON
            from Step 3, then submit claim. If claim succeeds once and fails on
            second try as already claimed, simulation is working correctly.
          </p>
          <AirdropClaimCard airdropAddress={airdropAddress} />
          <div className="rounded-8 border border-neutral-20 bg-white-100 p-3 text-15 text-neutral-70">
            <p className="mb-1 font-medium text-neutral-90">
              If Claim Airdrop fails (execution reverted)
            </p>
            <ol className="list-decimal space-y-1 pl-5">
              <li>
                Confirm you pasted the same Merkle output JSON used in Step 4
                root posting.
              </li>
              <li>
                Confirm Step 4 was submitted by owner wallet and root is posted
                successfully.
              </li>
              <li>
                Confirm airdrop contract has enough Karma token balance for your
                claim amount.
              </li>
              <li>
                0 ETH on contract is okay. Check that your connected wallet has
                enough test ETH for gas.
              </li>
              <li>
                Transfer enough tokens from your token contract to the airdrop
                contract first.
              </li>
              <li>
                Confirm this index is not already claimed and contract is not
                paused.
              </li>
              <li>
                For single-entry trees, empty proof{' '}
                <code className="rounded bg-neutral-10 px-1 py-0.5 text-15">
                  []
                </code>{' '}
                is valid.
              </li>
            </ol>
          </div>
        </section>
      </div>
    </HubLayout>
  )
}
