const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const FILE_PATH = "../src/services/mockProducts.json";

// قراءة البيانات
app.get("/products", (req, res) => {
  const data = fs.readFileSync(FILE_PATH, "utf8");
  res.json(JSON.parse(data));
});

// حفظ البيانات
app.post("/products", (req, res) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(req.body, null, 2));
  res.json({ success: true });
});

app.listen(8787, () => {
  console.log("Data Tube API running on http://localhost:8787");
});
