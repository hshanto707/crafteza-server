const cors = require('cors');
const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

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
    })

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
    console.log(`Example app listening at http://localhost:${port}`)
})