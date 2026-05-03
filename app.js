const express = require("express");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(express.json());

// ====== CONFIG ======
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || "supersecure123";
const DATA_FILE = "./data/notes.json";

// ====== AUTH MIDDLEWARE ======
function auth(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== API_KEY) {
    return res.status(403).send("Unauthorized");
  }

  next();
}

// ====== ROOT ROUTE (for browser/demo) ======
app.get("/", (req, res) => {
  res.send(`
    <h2>🏥 Secure Healthcare DevSecOps App</h2>
    <p>Student: Spandan Duari</p>
    <p>Status: Running Successfully ✅</p>
    <p><b>Protected Endpoint:</b> /notes (requires API key)</p>
  `);
});

// ====== HEALTH CHECK ======
app.get("/health", (req, res) => {
  res.send("OK");
});

// ====== GET NOTES (PROTECTED) ======
app.get("/notes", auth, (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE);
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).send("Error reading notes");
  }
});

// ====== ADD NOTE (PROTECTED) ======
app.post("/notes", auth, (req, res) => {
  try {
    const notes = JSON.parse(fs.readFileSync(DATA_FILE));

    const newNote = {
      ...req.body,
      timestamp: new Date()
    };

    notes.push(newNote);

    fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));

    res.send("Note added successfully");
  } catch (err) {
    res.status(500).send("Error saving note");
  }
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`🚀 Secure Healthcare App running on port ${PORT}`);
});
