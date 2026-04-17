// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestERC1155 {
    uint256 public constant TOKEN_ID = 1;

    mapping(address account => mapping(uint256 tokenId => uint256 balance)) private _balances;

    event TransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 value
    );

    constructor(address initialOwner) {
        _mint(initialOwner, TOKEN_ID, 3);
    }

    function uri(uint256) external pure returns (string memory) {
        return "ipfs://status-wallet-anvil-test/{id}.json";
    }

    function balanceOf(address account, uint256 id) external view returns (uint256) {
        require(account != address(0), "ERC1155: address zero is not a valid owner");
        return _balances[account][id];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata
    ) external {
        require(msg.sender == from, "ERC1155: caller is not token owner or approved");
        require(to != address(0), "ERC1155: transfer to the zero address");

        uint256 fromBalance = _balances[from][id];
        require(fromBalance >= amount, "ERC1155: insufficient balance for transfer");

        unchecked {
            _balances[from][id] = fromBalance - amount;
        }
        _balances[to][id] += amount;

        emit TransferSingle(msg.sender, from, to, id, amount);
    }

    function _mint(address to, uint256 id, uint256 amount) private {
        require(to != address(0), "ERC1155: mint to the zero address");

        _balances[to][id] += amount;

        emit TransferSingle(msg.sender, address(0), to, id, amount);
    }
}
