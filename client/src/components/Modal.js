import React from 'react';
import { useEffect } from "react";
import "./Modal.css";
const Modal = ({ setModalOpen, contract }) => {
  const sharing = async () => {
    const address = document.querySelector(".address").value;
    await contract.allow(address);
    setModalOpen(false);
  };
  useEffect(() => {
    const accessList = async () => {
      const addressList = await contract.shareAccess();
      let select = document.querySelector("#selectNumber");
      const options = addressList;

      for (let i = 0; i < options.length; i++) {
        let opt = options[i];
        let e1 = document.createElement("option");
        e1.textContent = opt;
        e1.value = opt;
        select.appendChild(e1);
      }
    };
    contract && accessList();
  }, [contract]);
  return (
    <div className="modalBackground">
      <div className="modalContainer glassmorphic">
        <div className="titleRoot">
          <h3>Share Access</h3>
          <button className="closeBtn" onClick={() => setModalOpen(false)}>×</button>
        </div>
        
        <div className="bodyContent">
          <label>Grant access to wallet address:</label>
          <input
            type="text"
            className="address modal-input"
            placeholder="0x..."
          />
        </div>
        
        <div className="sharedList">
          <label>Current Access List:</label>
          <select id="selectNumber" className="modal-select">
            <option>People With Access</option>
          </select>
        </div>
        
        <div className="footerActions">
          <button
            className="btn-secondary"
            onClick={() => setModalOpen(false)}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button className="btn-primary" onClick={() => sharing()}>
            Grant Access
          </button>
        </div>
      </div>
    </div>
  );
};
export default Modal;
