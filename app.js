const express = require("express");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Step 2: Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// Step 3: Routes
app.get("/", (req, res) => {
  res.render("index", {
    qrImage: null, // Pass null initially to prevent the error
  });
});

app.post("/generate", async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    // Generate QR Code
    const qrImagePath = path.join(__dirname, "public", "qr.png");
    await QRCode.toFile(qrImagePath, url);

    res.render("index", {
      qrImage: "/qr.png",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating QR code");
  }
});

// Step 4: Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
