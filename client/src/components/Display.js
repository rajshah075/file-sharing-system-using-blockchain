import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [imageUrls, setImageUrls] = useState([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const hehe = await contract.display(address ? address : account);
      console.log(hehe);
      const userAddress = address.trim() || account;
      const dataArray = await contract.display(userAddress);

      if (!dataArray || dataArray.length === 0) {
        setImageUrls([]);
        return;
      }

      let urls = dataArray.map((url) => url.toString());
      
      // Remove unwanted hardcoded URL dynamically
      const unwantedUrl = "https://gateway.pinata.cloud/ipfs/QmaiRjY7nSJs8CB3vc7rUt1vTcsLcofdqug9jyubUhavvF";
      urls = urls.filter((url) => url !== unwantedUrl).reverse();

      setImageUrls(urls);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("You don't have access to view this content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="display-container">
      <div className="image-list">
        {loading ? (
          <p>Loading...</p>
        ) : imageUrls.length > 0 ? (
          imageUrls.map((url, i) => (
            <a href={url} key={i} target="_blank" rel="noopener noreferrer">
              <img
                src={url}
                alt={`Image ${i + 1}`}
                className="image-list"
                onError={(e) => {
                  e.target.src = "default-image-url"; // Provide an actual fallback image URL
                }}
              />
            </a>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button className="center button" onClick={getData} disabled={loading}>
        {loading ? "Fetching..." : "Get Data"}
      </button>
    </div>
  );
};

export default Display;