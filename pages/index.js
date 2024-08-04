import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [quantity, setQuantity] = useState(undefined);
  const [newQuantity, setNewQuantity] = useState(0);
  const [amount, setAmount] = useState(0);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (accounts) => {
    if (accounts.length > 0) {
      console.log("Account connected: ", accounts[0]);
      setAccount(accounts[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      const balance = await atm.getBalance();
      setBalance(ethers.utils.formatUnits(balance, "wei"));
    }
  };

  const getQuantity = async () => {
    if (atm) {
      const quantity = await atm.itemQuantity();
      setQuantity(quantity.toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(
        ethers.utils.parseUnits(amount.toString(), "wei")
      );
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(
        ethers.utils.parseUnits(amount.toString(), "wei")
      );
      await tx.wait();
      getBalance();
    }
  };

  const increaseQuantity = async () => {
    if (atm) {
      let tx = await atm.increaseQuantity(newQuantity);
      await tx.wait();
      getQuantity();
    }
  };

  const decreaseQuantity = async () => {
    if (atm) {
      let tx = await atm.decreaseQuantity(newQuantity);
      await tx.wait();
      getQuantity();
    }
  };

  const resetQuantity = async () => {
    if (atm) {
      let tx = await atm.resetQuantity(newQuantity);
      await tx.wait();
      getQuantity();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    if (!account) {
      return (
        <>
          <button className="button" onClick={connectAccount}>
            Please connect your Metamask wallet
          </button>
          <style jsx>
            {`
              .button {
                padding: 10px 20px;
                margin: 10px 0;
                margin-right: 10px;
                border: none;
                border-radius: 5px;
                background-color: #007bff;
                color: white;
                cursor: pointer;
                font-size: 16px;
              }
              .button:hover {
                background-color: #0056b3;
              }
            `}
          </style>
        </>
      );
    }

    if (balance == undefined) {
      getBalance();
    }

    if (quantity == undefined) {
      getQuantity();
    }

    return (
      <div className="card">
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance} ETH</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (ETH)"
        />
        <button className="button" onClick={deposit}>
          Deposit
        </button>
        <button className="button" onClick={withdraw}>
          Withdraw
        </button>
        <p>Item Quantity: {quantity}</p>
        <input
          type="number"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
          placeholder="New Quantity"
        />
        <button className="button" onClick={increaseQuantity}>
          Increase Quantity
        </button>
        <button className="button" onClick={decreaseQuantity}>
          Decrease Quantity
        </button>
        <button className="button" onClick={resetQuantity}>
          Reset Quantity
        </button>

        <style jsx>
          {`
            .card {
              display: inline-block;
              padding: 20px;
              margin: 20px;
              border: 1px solid #ddd;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              background: #fff;
              text-align: left;
            }
            .button {
              padding: 10px 20px;
              margin: 10px 0;
              margin-right: 10px;
              border: none;
              border-radius: 5px;
              background-color: #007bff;
              color: white;
              cursor: pointer;
              font-size: 16px;
            }
            .button:hover {
              background-color: #0056b3;
            }
            input {
              padding: 10px;
              margin: 10px 0;
              border: 1px solid #ddd;
              border-radius: 5px;
              width: calc(100% - 22px);
              font-size: 16px;
            }
          `}
        </style>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>
        {`
          .container {
            text-align: center;
            padding: 20px;
          }
        `}
      </style>
    </main>
  );
}
