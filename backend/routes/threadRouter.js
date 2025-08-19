const express = require("express");
const router = express.Router();
const { createThread, getThreads } = require("../controllers/threadController");
const { authMiddleware, adminMiddleware } = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, createThread);
router.get("/", authMiddleware, getThreads);

module.exports = router;
