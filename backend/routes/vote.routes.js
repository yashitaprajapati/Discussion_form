const express = require('express');
const { votePosts, voteReply, voteComments } = require('../controllers/vote.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/posts' ,authMiddleware, votePosts);
router.post("/comments", authMiddleware, voteComments);
router.post("/reply", authMiddleware, voteReply);


module.exports = router;
