const express = require("express");
const bodyParser = require("body-parser");
const sectors = require("./data/sectors.json");
const certificates = require("./data/certificates.json");

let baseAmount = 2_000_000;

const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());

const PORT = process.env.PORT || 80;

// get base amount for the calculator
app.get("/base-amount", (req, res) => {
  res.send(JSON.stringify({ baseAmount }));
});

// get sectors
app.get("/sectors", (req, res) => {
    res.send(JSON.stringify({ sectors }));
});

// get certificates
app.get("/certificates", (req, res) => {
    res.send(JSON.stringify({ certificates }));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


