const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const allRoutes = require('./routes/index.js');
const app = express();

app.use(express.json());
app.use(cors());

// Routes
app.use('/api', allRoutes); 
/* Whenever we want to access the backend through
   the frontend use this endpoint format: 
   "/api/<model>/<typeofReuqest, ex: getallTasks>"
*/

mongoose
  .connect("mongodb://127.0.0.1:27017/Zone-todo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch(console.error);

app.listen(3001, () => console.log("Server started on port 3001"));
