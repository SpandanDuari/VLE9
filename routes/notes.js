const express = require("express");
const fs = require("fs");
const router = express.Router();
const auth = require("../middleware/auth");

const file = "./data/notes.json";

// Get notes
router.get("/", auth, (req, res) => {
  const data = JSON.parse(fs.readFileSync(file));
  res.json(data);
});

// Add note
router.post("/", auth, (req, res) => {
  const notes = JSON.parse(fs.readFileSync(file));
  notes.push(req.body);
  fs.writeFileSync(file, JSON.stringify(notes, null, 2));
  res.send("Note added");
});

module.exports = router;