const admin = require("firebase-admin");
const express = require("express");
const app = express();
const { v4: uuidv4 } = require('uuid');
const serviceAccount = require("./permissions.js");
app.use(express.json());
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const cors = require("cors");
app.use(cors({ origin: true }));

const db = admin.firestore();
//Routes
app.get("/", async (req, res) => {
  res.send("Welcome to my Submission for the 2022 Shopify Backend Internship Challenge!");
});

//Create
app.post("/create", async (req, res) => {
  const generatedUUID = uuidv4();
  const inventoryItems = db.collection("Inventory").doc(generatedUUID);
  const data = req.body;

  await inventoryItems.set({
    ID: data.ID,
    itemName : data.itemName,
    categories : data.categories,
    stock : data.stock,
    unitPrice : data.unitPrice
  });

  res.send("Inventory Item Successfully Added.");

});
//Read
/*
Here we are getting all items.
*/
app.get("/items", async (req,res) => {
  const inventoryItems = db.collection("Inventory");
  const inventoryDocs = await inventoryItems.get();
  let inventoryItemsArray = [];
  inventoryDocs.forEach(doc => {
    inventoryItemsArray.push(doc.data());
  })

  res.send(inventoryItemsArray);
});

/*
Here we are getting an item with a specific ID.
*/
app.get("/items/:itemID", async (req,res) => {
  const inventoryItems = db.collection("Inventory");
  const inventoryDocs = await inventoryItems.where("ID", "==", req.params.itemID).get();
  let inventoryItemsArray = [];
  inventoryDocs.forEach(doc => {
    inventoryItemsArray.push(doc.data());
  })

  res.send(inventoryItemsArray);


});

//Update

app.put("/items/updateItem/:itemID", async (req,res) => {

  // const data = req.body;
  // const inventoryItems = db.collection("Inventory");
  // const inventoryDocs = await inventoryItems.get();
  // inventoryDocs.forEach(doc => {
  //   if(doc.)
  // })
  

});

//Delete

app.listen(3000, ()=> {
    console.log("Listening on port 3000.");
})