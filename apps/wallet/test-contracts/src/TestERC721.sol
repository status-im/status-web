// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TestERC721 {
    string public name = "Status Test ERC721";
    string public symbol = "ST721";

    mapping(uint256 tokenId => address owner) private _owners;
    mapping(address owner => uint256 balance) private _balances;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    constructor(address initialOwner) {
        _mint(initialOwner, 0);
    }

    function balanceOf(address owner) external view returns (uint256) {
        require(owner != address(0), "ERC721: address zero is not a valid owner");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) external {
        require(msg.sender == from, "ERC721: caller is not token owner or approved");
        require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
        require(to != address(0), "ERC721: transfer to the zero address");

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _mint(address to, uint256 tokenId) private {
        require(to != address(0), "ERC721: mint to the zero address");
        require(_owners[tokenId] == address(0), "ERC721: token already minted");

        _owners[tokenId] = to;
        _balances[to] += 1;

        emit Transfer(address(0), to, tokenId);
    }
}
