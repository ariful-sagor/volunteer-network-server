const express = require('express')
const app = express()
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dm8wp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const port = 7000
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const taskCollection = client.db("Volunteer").collection("products");
  const addVolunteer = client.db("Volunteer").collection("volunteer");
  
  app.post('/addTask', (req, res) => {
      const task= req.body;
      console.log(task)
      taskCollection.insertOne(task)
      .then(result =>{
          console.log(result.insertedCount)
      })
  })
  app.post('/addVolunteer', (req, res) => {
    const task= req.body;
    console.log(task)
    addVolunteer.insertOne(task)
    .then(result =>{
        console.log(result.insertedCount)
    })
})

  app.get('/tasks', (req, res) => {
      const search= req.query.search;
      taskCollection.find({name: {$regex: search}})
      .toArray((err, documents)=>{
          res.send(documents)

      })
  })
  app.get('/volunteer', (req, res) => {
    addVolunteer.find({})
    .toArray((err, documents)=>{
        res.send(documents)
        })
    })
    app.get('/volunteer/:id', (req, res) => {
       let kk= req.params.id
      addVolunteer.find({volunteerId: req.params.volunteerId})
      .toArray((err, documents)=>{
          res.send(documents[kk])
      })
  })
  app.get('/tasks/:id', (req, res) => {
     let kk= req.params.id
    taskCollection.find({taskId: req.params.taskId})
    .toArray((err, documents)=>{
        res.send(documents[kk])
    })
})
  
  
  
});

app.get('/', (req, res) => {
  res.send('Hello World Sagor')
})


app.listen(process.env.PORT || port)

