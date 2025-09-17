const express = require('express');
require("dotenv").config();
//const dbConnect = require("./config/db");
const app = express();
const port =  3000;
const authMiddleware = require("./middlewares/authMiddleware");
const roleMiddleware = require("./middlewares/roleMiddleware");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
