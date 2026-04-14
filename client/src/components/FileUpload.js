import React from 'react';
import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";
//import env from "hardhat";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");
  const [fileHash, setFileHash] = useState(null);
  const [url,setUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
            "Content-Type": "multipart/form-data",
          },
        });

        const fileUrl = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        const dataToStore = `${file.type}::${fileUrl}`;
        await contract.add(account, dataToStore);
        setUrl(fileUrl);

        const hashResponse = await axios.post("http://localhost:5000/hash", { data: fileUrl });
        const hashedData = hashResponse.data.hash;

        setFileHash(hashedData);
        alert("Successfully Uploaded File");
        setFileName("No file selected");
        setFile(null);
      } catch (e) {
        console.error("Pinata Upload Error:", e.response ? e.response.data : e.message);
        alert(`Unable to upload file to Pinata: ${e.response ? e.response.data.error || e.message : e.message}`);
      }
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  return (
    <div className="upload-container">
      <div className="upload-card glassmorphic">
        <div className="upload-header">
          <h3 className="upload-title">Secure File Upload</h3>
          <p className="upload-subtitle">Pin your files to IPFS & Blockchain</p>
        </div>

        <form className="upload-form" onSubmit={handleSubmit}>
          <div className="file-drop-zone">
            <div className="drop-icon">☁️</div>
            <label htmlFor="file-upload" className="btn-secondary">
              Browse Local Files
            </label>
            <input
              disabled={!account}
              type="file"
              id="file-upload"
              name="data"
              onChange={retrieveFile}
            />
            <p className="selected-file-name">
              {fileName !== "No file selected" ? fileName : "No file chosen"}
            </p>
          </div>
          
          <button type="submit" className="btn-primary" disabled={!file} style={{ width: '100%', marginTop: '20px' }}>
            Encrypt & Upload
          </button>
        </form>

        {fileHash && (
          <div className="hash-display">
            <div className="success-icon">✅</div>
            <p className="hash-label">Transaction Hash:</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="hash-link" title={fileHash}>
              {fileHash}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;