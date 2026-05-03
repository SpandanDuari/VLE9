const express = require("express");
require("dotenv").config();

const notesRoute = require("./routes/notes");

const app = express();
app.use(express.json());

app.use("/notes", notesRoute);

// health check
app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(3000, () => {
  console.log("Secure Health App running on port 3000");
});