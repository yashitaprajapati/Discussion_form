const express = require('express');
const { addComment, replyComment, getComments } = require('../controllers/comment.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/:id",authMiddleware, addComment);
router.post("/reply/:id", authMiddleware,replyComment);
router.get("/", getComments);

module.exports = router;