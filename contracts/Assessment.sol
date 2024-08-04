// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public itemQuantity;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance, uint256 _itemQuantity) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        itemQuantity = _itemQuantity;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;
        require(msg.sender == owner, "You are not the owner of this account");

        balance += _amount;

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        balance -= _withdrawAmount;

        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    function increaseQuantity(uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than zero");
        itemQuantity += _amount;
    }

    function decreaseQuantity(uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than zero");
        assert(itemQuantity >= _amount);

        if (itemQuantity < _amount) {
            revert("Not enough items to decrease");
        }

        itemQuantity -= _amount;
    }

    function resetQuantity(uint256 _newQuantity) public {
        require(_newQuantity >= 0, "Quantity must be non-negative");
        itemQuantity = _newQuantity;
    }
}
