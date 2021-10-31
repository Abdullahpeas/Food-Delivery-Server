const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhhzl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('foodDelivery');
        const foodCollection = database.collection('foods');
        const orderCollection = database.collection('orders');


        // Get ALL foods API
        app.get('/foods', async (req, res) => {
            const cursor = foodCollection.find({});
            const foods = await cursor.toArray();
            res.send(foods);
        })


        // Get single food API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodCollection.findOne(query);
            res.send(result);
        })



        // Post API------

        app.post('/services/:id', async (req, res) => {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
        })


        // MY ORDERS
        app.get("/myOrders/:email", async (req, res) => {
            const result = await orderCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });


        // Cancel ORDER
        app.delete("/deleteOrder/:id", async (req, res) => {
            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });


        // add orders
        app.post("/addFoods", async (req, res) => {
            const foods = req.body;
            const result = await foodCollection.insertOne(foods);
            res.send(result)
        });


        // Manage all Orders

        app.get("/allOrders", async (req, res) => {
            const result = await orderCollection.find({}).toArray();
            res.send(result);
        });


        // ORDER delete

        app.delete("/ordersDelete/:id", async (req, res) => {

            const result = await orderCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            // console.log(req.params.id)
            // console.log(result)
            res.send(result);
        });


        app.put("/status/:id", async (req, res) => {
            const id = req.params.id;
            const statusShow = req.body;
            const filter = { _id: ObjectId(id) };
            const result = await orderCollection.updateOne(filter, { $set: { status: "Approved", }, })
            res.send(result);
            console.log(result)
        })

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Food server deliver is runnig')
})


app.listen(port, () => {
    console.log('Food server is running', port)
})