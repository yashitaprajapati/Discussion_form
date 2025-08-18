const express = require('express');
require("dotenv").config();
const dbConnect = require("./config/db");
const app = express();
const port =  3000;

const voteRoutes = require('./routes/vote.routes');
const commentRoutes = require('./routes/comment.routes');
app.use("/api/user",userRouter);
app.use("/api/vote", voteRoutes);
app.use("/api/comments",commentRoutes);

app.use("/", function (req,res){
  res.status(500).json({message: "Something went wrong!"});
})

app.get("/", (req, res) => {
  res.send("Server is running and connected to MongoDB!");
});

app.listen((req,res),port=>{
    console.log(`server running on port ${port}`);
})