import React, { useState } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");

  const abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "url",
          "type": "string"
        }
      ],
      "name": "add",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "allow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "disallow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "display",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "shareAccess",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "user",
              "type": "address"
            },
            {
              "internalType": "bool",
              "name": "access",
              "type": "bool"
            }
          ],
          "internalType": "struct Upload.Access[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const pv = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(pv);

        // NOTE: Optional reloads on event.
        // window.ethereum.on("chainChanged", () => window.location.reload());
        // window.ethereum.on("accountsChanged", () => window.location.reload());

        await pv.send("eth_requestAccounts", []);
        const signer = pv.getSigner();
        const address = await signer.getAddress();
        setAccount(address);

        const contractAddress = "0x9FE2bb8E48c822F6D7B081651B1E3f0E741aCf3C";
        const contract = new ethers.Contract(contractAddress, abi, signer);
        setContract(contract);
      } else {
        setErrorStatus("MetaMask is not installed");
      }
    } catch (err) {
      console.error(err);
      setErrorStatus("Error connecting to MetaMask. Check console.");
    }
  };

  return (
    <div className="App dark-mode">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <nav className="navbar">
        <div className="nav-logo">
          <h2>Decentralized Vault</h2>
        </div>
        <div className="nav-actions">
          {account ? (
            <>
              <div className="account-pill">
                <span className="dot active"></span>
                <span className="account-text">{account}</span>
              </div>
              <button className="btn-primary share-nav-btn" onClick={() => setModalOpen(true)}>
                Share Access
              </button>
            </>
          ) : (null
            // { <button className="btn-primary connect-nav-btn" onClick={connectWallet}>
            //   Connect Wallet
            // </button> }
          )}
        </div>
      </nav>

      {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract} />}

      <main className="main-content">
        {errorStatus && <div className="error-alert">{errorStatus}</div>}

        {provider && contract ? (
          <div className="dashboard-container">
            <section className="upload-section">
              <FileUpload account={account} provider={provider} contract={contract} />
            </section>
            <section className="display-section">
              <Display contract={contract} account={account} />
            </section>
          </div>
        ) : (
          <div className="hero-section">
            <h1 className="hero-title">A Secure Digital File System.</h1>
            <p className="hero-subtitle">Upload, view, and share your files effortlessly on the blockchain.</p>
            <button className="btn-primary large" onClick={connectWallet}>
              Connect Wallet to Start
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
export default App;