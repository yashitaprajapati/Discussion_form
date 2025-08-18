const express = require('express');
const { addComment, replyComment } = require('../controllers/comment.controller');
const router = express.Router();

router.post("/", addComment);
router.post("/reply", replyComment);

module.exports = router;