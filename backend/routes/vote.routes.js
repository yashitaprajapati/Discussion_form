const express = require('express');
const { votePosts } = require('../controllers/vote.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/Posts' ,authMiddleware, votePosts);

module.exports = router;
