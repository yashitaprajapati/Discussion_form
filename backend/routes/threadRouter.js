const express = require("express");
const router = express.Router();
const { createThread, getThreads } = require("../controllers/threadController");

router.post("/", createThread);
router.get("/", getThreads);

module.exports = router;
