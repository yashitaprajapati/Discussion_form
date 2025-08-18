const express = require('express');
require("dotenv").config();
const dbConnect = require("./config/db");
const app = express();
const port =  3000;

const connectDB = require("./config/db");
const userRouter = require("./routes/userRouter");
const threadRouter = require("./routes/threadRouter");
const voteRoutes = require('./routes/vote.routes');
const commentRoutes = require('./routes/comment.routes');
app.use("/api/user",userRouter);
app.use("/api/vote", voteRoutes);
app.use("/api/comments",commentRoutes);
app.use("/api/threads", threadRouter);

connectDB();

app.use("/", function (req,res){
  res.status(500).json({message: "Something went wrong!"});
})

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
