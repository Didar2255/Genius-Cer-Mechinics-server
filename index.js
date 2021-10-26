const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const { MongoClient } = require('mongodb');
const { ObjectID } = require('bson');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// meddle wear

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzbym.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic")
        const servicesCollection = database.collection('services')
        // get api
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray();
            res.send(services)
        })

        // get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }

            const service = await servicesCollection.findOne(query)
            res.json(service);

        })

        // post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service)
            const result = await servicesCollection.insertOne(service)
            console.log(result);
            res.json(result)

        })

        // delete api

        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectID(id) }
            const service = await servicesCollection.deleteOne(query)
            res.send(service)

        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Well come to Genius Car Mechanics')
})
app.listen(port, () => {
    console.log('Identity localhost : ', port)
})