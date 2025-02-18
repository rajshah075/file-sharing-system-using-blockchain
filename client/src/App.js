import { useState, useEffect } from "react";
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

  useEffect(() => {
    console.log(window.ethereum);
    const pv = new ethers.providers.Web3Provider(window.ethereum);
    console.log(pv);
    setProvider(pv);

    const loadProvider = async () => {
      if (pv) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await pv.send("eth_requestAccounts", []);
        const signer = pv.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x849B5D41b43fd2083d6AAaDEe16232273882e37A";

        const contract = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(pv);
      } else {
        console.error("Metamask is not installed");
      }
    };
    pv && loadProvider();
  }, []);
  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && <Modal setModalOpen={setModalOpen} contract={contract}></Modal>}
  
      <div className="App">
        <h1 style={{ color: "white" }}>Decentralize File System</h1>
        <div className="bg"></div>
        <div className="bg bg2"></div>
        <div className="bg bg3"></div>
  
        <p style={{ color: "white" }}>
          Account : {account ? account : "Not connected"}
        </p>
  
        {/* Add a conditional render to check for contract/provider availability */}
        {provider && contract ? (
          <>
            <FileUpload account={account} provider={provider} contract={contract} />
            <Display contract={contract} account={account} />
          </>
        ) : (
          <p>Loading provider and contract...</p> // Add loading feedback
        )}
      </div>
    </>
  );  
}

export default App;