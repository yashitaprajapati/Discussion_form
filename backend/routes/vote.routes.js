const express = require('express');
const { votePosts, voteReply, voteComments } = require('../controllers/vote.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/posts/:id' ,authMiddleware, votePosts);
router.post("/comments/:id", authMiddleware, voteComments);
router.post("/reply/:id", authMiddleware, voteReply);


module.exports = router;
