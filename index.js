const admin = require("firebase-admin");
const express = require("express");
const app = express();
var serviceAccount = require("./permissions.js");
app.use(express.json());
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const cors = require("cors");
app.use(cors({ origin: true }));

const db = admin.firestore();
//Routes
app.get("/", async (req, res) => {
  res.send("Hello, World!");
});

//Create
app.post("/create", async (req, res) => {
  const inventoryItems = db.collection("Inventory").doc();
  const data = req.body;

  await inventoryItems.set({
    ID: data.ID,
    itemName : data.itemName,
    categories : data.categories,
    stock : data.stock,
    unitPrice : data.unitPrice
  });

  res.send("Added");

});
//Read

//Update

//Delete

app.listen(3000, ()=> {
    console.log("Listening on port 3000.");
})