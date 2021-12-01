// This is importing or requiring all required  file or data
const express = require('express');
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const port = process.env.PORT || 5000;

// This is middle ware
app.use(cors());
app.use(express.json());

// This is use for MongoClient that required Mongodb
const { MongoClient } = require('mongodb');

// This is for connecting with database with env variable.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwvoh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db('bikeInOnline');
    const reviewsCollection = database.collection('reviews');
    const productsCollection = database.collection('products');
    const usersCollection = database.collection('users');
    const orderCollection = database.collection('manageAllOrder');
    const manageOrderCollection = database.collection(
      'manageAllOrderCollection'
    );

    // Get All reviews from the server
    app.get('/reviews', async (req, res) => {
      const cursor = reviewsCollection.find({});
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    // Get All user from the server
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });
    //verify admin
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === 'admin') {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // Update a user as Admin or make admin

    app.put('/users/admin', async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: 'admin' } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    //Update Order
    app.put('/manageAllOrder/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const updateDoc = { $set: { verified: 'done' } };
      const result = await orderCollection.updateOne(query, updateDoc);
      res.json(result);
    });

    // Get All products from the server
    app.get('/products', async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });
    // Get All manage order data  from the server
    app.get('/manageAllOrderCollection', async (req, res) => {
      const cursor = manageOrderCollection.find({});
      const allOrder = await cursor.toArray();
      res.send(allOrder);
    });

    // Get All Data from the Manage All Orders
    app.get('/manageAllOrder', async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const cursor = orderCollection.find(query);
      const mangeAllOrder = await cursor.toArray();
      res.send(mangeAllOrder);
    });
    // GET Single Product
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      console.log('getting specific service', id);
      const query = { _id: ObjectId(id) };
      const singleProduct = await productsCollection.findOne(query);
      res.json(singleProduct);
    });
    // Post Api to create Offering in the database to manage All order
    app.post('/manageAllOrder', async (req, res) => {
      const manageOrder = req.body;
      const resultManageOrder = await orderCollection.insertOne(manageOrder);
      res.json(resultManageOrder);
    });
    // Post Api to create Offering in the database to manage All order
    app.post('/manageAllOrderCollection', async (req, res) => {
      const manageOrder = req.body;
      const resultManageOrder = await manageOrderCollection.insertOne(
        manageOrder
      );
      res.json(resultManageOrder);
    });

    // To Add Product in the server
    app.post('/products', async (req, res) => {
      const products = req.body;
      const result = await productsCollection.insertOne(products);
      res.json(result);
    });
    // To Add Review in the server
    app.post('/reviews', async (req, res) => {
      const reviews = req.body;
      const result = await reviewsCollection.insertOne(reviews);
      res.json(result);
    });
    //  Post the User
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      console.log(result);
      res.json(result);
    });

    //Delete Order
    app.delete('/manageAllOrder/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
    //Delete Order from Manage All order
    app.delete('/manageAllOrderCollection/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await manageOrderCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello . Are You ready to go?');
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});
