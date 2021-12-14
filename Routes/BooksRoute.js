var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var ObjId = require("mongodb").ObjectId;

var router = express.Router();

var dbPath = process.env.DB_PATH;
var dbName = process.env.DB_NAME;
var collectionName = process.env.COLLECTION_NAME;

router.get("/api/books", async (req, res, next) => {
  const client = new mongoClient(dbPath);
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const curser = collection.find({});
    const items = [];
    await curser.forEach((doc) => {
      items.push(doc);
    });
    res.status(200).json(items);
  } catch (error) {
    console.log(`Error:${error}`);
    next(error);
  } finally {
    await client.close();
  }
});
router.get("/api/books/:id", async (req, res, next) => {
  const id = req.params.id;
  const client = new mongoClient(dbPath);
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const document = await collection.findOne({ _id: ObjId(id) });
    res.status(200).json(document);
  } catch (error) {
    console.log(`Error:${error}`);
    next(error);
  } finally {
    await client.close();
  }
});
router.post("/api/books", async (req, res, next) => {
  const book = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  };
  const client = new mongoClient(dbPath);
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(book);
    res.status(200).json(result);
  } catch (error) {
    console.log(`Error:${error}`);
    next(error);
  } finally {
    await client.close();
  }
});
router.put("/api/books", async (req, res, next) => {
  const id = req.body.id;
  const book = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  };
  const client = new mongoClient(dbPath);
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const result = await collection.updateOne(
      { _id: ObjId(id) },
      { $set: book }
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(`Error: ${error}`);
    next(error);
  } finally {
    await client.close();
  }
});
router.delete("/api/books", async (req, res, next) => {
  const id = req.body.id;
  const client = new mongoClient(dbPath);
  try {
    await client.connect();
    const database = client.db(dbName);
    const collection = database.collection(collectionName);
    const result = await collection.deleteOne({ _id: ObjId(id) });
    res.status(200).json(result);
  } catch (error) {
    console.log(`Error:${error}`);
    next(error);
  } finally {
    await client.close();
  }
});

module.exports = router;
