const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes")
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const env = process.env.NODE_ENV || "local";
const port = process.env.PORT || "8002";

const app = express();
const options = {
  allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
  origin: "*",
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
};


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }));
app.use(cors(options));






app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cluster mongodb+srv://root:5454@twittercluster.bbjs9.mongodb.net/test

// connect to database
//mongoose.connect("mongodb+srv://root:5454@twittercluster.bbjs9.mongodb.net/SaiyansDb");


app.use('/saiyans/api', routes);

app.listen(port,()=>{
    console.log(`Server is listening on ${port}`);
})


