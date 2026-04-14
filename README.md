# Decentralized File Sharing System (Web3)

This is a Web3-based file sharing application using React, Node.js, Ethers.js, Hardhat, Ganache, and Pinata (IPFS).

## 🌟 Project Overview
This project acts as a **Decentralized Digital Vault**, allowing users to upload, store, and safely share their personal files utilizing Ethereum-compatible blockchains and the IPFS distributed file system. 

### Core Features:
- **Premium Glassmorphic UI:** A beautifully designed, fully responsive dark-mode interface with frosted glass components and floating orbs.
- **Universal File Support:** Upload and preview any file type—from Images and Videos (played natively) to PDFs and raw Documents (.docx, .zip) with safe-download triggers.
- **Access Control:** File ownership and read-permissions are strictly governed by an immutable Smart Contract deployed on your blockchain network.
- **Share & Collaborate:** The sleek modal overlay allows file owners to seamlessly grant or revoke viewing rights to specific external wallet addresses.
- **IPFS Pinning:** Files are uploaded and cryptographically pinned to IPFS via the Pinata API, ensuring they are not stored on any centralized company server.

Follow these step-by-step instructions to completely configure and start the project locally.

---

## ?? Prerequisites
1. **Node.js** (v16+ recommended).
2. **Ganache** (GUI or CLI) for your local blockchain network.
3. **MetaMask** browser extension installed.
4. **Pinata Account**: Sign up at [Pinata.cloud](https://app.pinata.cloud/) to store files on IPFS.

---

## ?? Step 1: Pinata IPFS Setup & Credentials
To upload files to IPFS, you need Pinata API keys.
1. Log in to Pinata -> Click on **API Keys** -> **New Key**.
2. Give it Admin privileges or allow `pinFileToIPFS`.
3. Copy the **API Key** and **API Secret**.
4. In this project, navigate to the `client/` folder and create a file named exactly `.env`.
5. Add your keys into `client/.env` in this exact format:
```env
REACT_APP_PINATA_API_KEY="your_api_key_here"
REACT_APP_PINATA_SECRET_API_KEY="your_secret_key_here"
```
*(Note: If the dev server is running, you must restart it after creating/editing the .env file!)*

---

## ? Step 2: Blockchain & Smart Contract Setup
1. **Start Ganache**: Open Ganache and click *Quickstart*. Note the RPC Server URL (usually `http://127.0.0.1:7545` or `8545`).
2. **MetaMask Setup**: 
   - Open MetaMask -> Add Network -> Add manually.
   - Network Name: Ganache Local
   - RPC URL: `http://127.0.0.1:7545` (match your Ganache).
   - Chain ID: `1337`
   - Import an Account to MetaMask using a **Private Key** listed in your Ganache UI.
3. **Deploy the Smart Contract**:
   Open a terminal in the root directory (`Dgdrive3.0`) and run:
   ```bash
   npm install
   npx hardhat compile
   npx hardhat run scripts/deploy.js --network localhost
   ```
4. **Update React App**: The deployment terminal will print a **Contract Address**. Go to `client/src/App.js` and paste this new address into the `contractAddress` variable.

---

## ?? Step 3: Start the Backend (Server)
The backend node server encrypts/hashes data.
Open a **new terminal window**:
```bash
cd server
npm install
node app.js
```
*You should see "Server running on port 5000".*

---

## ?? Step 4: Start the Frontend (Client)
Open another **new terminal window**:
```bash
cd client
npm install
npm start
```
*Your browser will open to `localhost:3000`.*

---

## ?? Troubleshooting
*   **White Screen on Load**: Check the browser console. Usually means MetaMask isn't connected or the Contract Address in `App.js` is wrong.
*   **"Unable to upload to Pinata" Error**: Your `client/.env` file is missing, incorrectly named, or you haven't restarted the React server (close `npm start` terminal and run it again).
*   **"EADDRINUSE 5000" (Server)**: Port 5000 is blocked by another task. Kill it using `npx kill-port 5000` and restart `node app.js`.
*   **Transactions failing / Nonce Error**: MetaMask has cached old Ganache history. In MetaMask, go to Settings > Advanced > **Clear activity tab data**.
