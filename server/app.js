const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.post("/hash", async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: "No data provided" });
    }
    
    const saltRounds = 10;
    const hash = await bcrypt.hash(data, saltRounds);
    res.json({ hash });
  } catch (error) {
    console.error("Hashing error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
