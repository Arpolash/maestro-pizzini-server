const cors = require("cors");
const express = require("express");
const bodyParser = require('body-parser')
require('dotenv').config()
const app = express();

app.use(express.json());
app.use(bodyParser.json())
app.use(cors());

const port = 5000;

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sjfoa.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology : true });

app.get("/", (req, res) => {
  res.send("Add your Stripe Secret Key to the .require('stripe') statement!");
});



client.connect(err => {
  const pizziniCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  console.log('connect')
    app.post('/payment', (req,res)=>{
        const token = req.body;
        pizziniCollection.insertOne(token)
        .then(result => {
            res.send(result.insertedCount > 0);
          })
    })
    
    app.post('/addUserInfo', (req, res) => {
      const first = req.body.first;
      const last = req.body.last;
      const city = req.body.city;
      const state = req.body.state;
      const zip = req.body.zip;

      pizziniCollection.insertOne({ first, last,city, state,zip })
          .then(result => {
              res.send(result.insertedCount > 0);
          })
  })

});


app.listen(process.env.PORT || port)