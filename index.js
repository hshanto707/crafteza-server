const cors = require('cors');
const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swoyo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db('crafteza');
    const productsCollection = database.collection('products');
    const cartCollection = database.collection('cart');

    // GET ALL PRODUCTS

    app.get('/products', async (req, res) => {
      const products = productsCollection.find({});
      const result = await products.toArray();
      res.send(result)
    });

    // GET SINGLE PRODUCT

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await productsCollection.findOne(query);
      res.json(result);
    });

    // ADD DATA TO CART

    app.post('/cart', async (req, res) => {
      const product = req.body;
      const result = await cartCollection.insertOne(product);
      res.json(result);
    })

    // GET USER'S CART DATA

    app.get('./cart/:uid', async (req, res) => {
      const uid = req.params.uid;
      const query = { uid: uid }
      const result = await cartCollection.find(query).toArray();
    })

    // DELETE DATA FROM CART

    // GET USER'S WISH LIST DATA

    // ADD DATA TO WISH LIST

    // DELETE DATA FROM WISH LIST

  }
  finally {
    // await client.close()
  }

}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Crafteza Server Is Working Perfectly!')
})

app.listen(port, () => {
  console.log(`Example app listening at port: ${port}`)
})