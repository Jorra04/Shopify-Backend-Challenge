const admin = require("firebase-admin");
const express = require("express");
require('dotenv').config();
const app = express();
const { v4: uuidv4 } = require('uuid');
const json2csv = require("json2csv").parse;
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert({ 
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL
  }),
});


const cors = require("cors");
app.use(cors({ origin: true }));
const PORT = process.env.PORT || 3000;
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
    ID: generatedUUID,
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
  const inventoryItems = db.collection("Inventory").doc(req.params.itemID);
  const doc = await inventoryItems.get();
  if(!doc.exists) {
    res.status(404).send("No Such Item Exists in the Inventory");
  } else {
    res.send(doc.data());
  }


});

app.get("/data/generateCSV", async (req, res) => {
  const inventoryItems = db.collection("Inventory");
  const inventoryDocs = await inventoryItems.get();
  let inventoryItemsArray = [];
  inventoryDocs.forEach(doc => {
    inventoryItemsArray.push(doc.data());
  });

  let fields = ["Item ID", "Item Name", "Item Categories", "Item Stock", "Unit Price"];
  const opts = {fields};

  try {
    const csv = json2csv(inventoryItemsArray, fields);
    res.attachment('data.csv');
    res.status(200).send(csv);
  } catch (err) {
    console.error(err);
  }

  


});

//Update

app.put("/items/updateItem/:itemID", async (req,res) => {

  const inventoryItems = db.collection("Inventory").doc(req.params.itemID);
  const data = req.body;
  const result = await inventoryItems.update({
    itemName : data.itemName,
    categories : data.categories,
    stock : data.stock,
    unitPrice : data.unitPrice
  });

  res.send("Inventory Item Updated Successfully.");
  

});

//Delete
app.delete("/items/deleteItem/:itemID", async(req, res) => {
  const result = await db.collection("Inventory").doc(req.params.itemID).delete();
  res.send("Inventory Item Successfully Removed.");
});

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}.`);
})