import React, { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [fileItems, setFileItems] = useState([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const userAddress = address.trim() || account;
      const dataArray = await contract.display(userAddress);

      if (!dataArray || dataArray.length === 0) {
        setFileItems([]);
        return;
      }

      let files = dataArray.map((item) => {
        const itemStr = item.toString();
        if (itemStr.includes("::")) {
          const [type, url] = itemStr.split("::");
          return { type, url };
        } else {
          return { type: "image/legacy", url: itemStr };
        }
      });

      // Dynamically filter out unwanted URL
      const unwantedUrl =
        "https://gateway.pinata.cloud/ipfs/QmaiRjY7nSJs8CB3vc7rUt1vTcsLcofdqug9jyubUhavvF";
      files = files.filter((file) => file.url !== unwantedUrl).reverse();

      setFileItems(files);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("You don't have access to view this content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="display-container">
      <div className="fetch-section glassmorphic">
        <input
          type="text"
          placeholder="Enter an address to view files..."
          className="address-input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="btn-primary" onClick={getData} disabled={loading}>
          {loading ? "Searching Vault..." : "Access Vault"}
        </button>
      </div>

      <div className="file-grid">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Decrypting files...</p>
          </div>
        ) : fileItems.length > 0 ? (
          fileItems.map((file, i) => (
            <div className="file-card glassmorphic" key={i}>
              <div className="file-preview">
                {file.type.startsWith("image/") && (
                  <img
                    src={file.url}
                    alt={`File ${i + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/fallback.jpg";
                    }}
                  />
                )}
                {file.type.startsWith("video/") && (
                  <video src={file.url} controls />
                )}
                {file.type === "application/pdf" && (
                  <div className="icon-preview pdf-icon">
                    <span>PDF</span>
                  </div>
                )}
                {!file.type.startsWith("image/") && !file.type.startsWith("video/") && file.type !== "application/pdf" && (
                  <div className="icon-preview doc-icon">
                    <span>DOC</span>
                  </div>
                )}
              </div>
              
              <div className="file-footer">
                <span className="file-type-badge">
                  {file.type === "image/legacy" ? "IMAGE" : (file.type.split('/')[1] || 'FILE').toUpperCase().substring(0, 10)}
                </span>
                
                {/* Download / Open Logic */}
                {(!file.type.startsWith("image/") && !file.type.startsWith("video/")) ? (
                  /* Documents and PDFs */
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn-secondary small view-btn">
                     Download / View
                  </a>
                ) : (
                  /* Images and Videos open in new tab */
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn-secondary small view-btn">
                    View Full
                  </a>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No files found in this vault.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Display;
