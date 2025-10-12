const Thread = require("../models/threadModel");
const comment = require("../models/comment.model");
const vote = require("../models/vote.model");

exports.createThread = async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;
    const createdBy = req.user._id;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and Description are required" });
    }

    const newThread = new Thread({
      title,
      description,
      tags,
      category,
      createdBy
    });

    await newThread.save();

    res.status(201).json({ message: "Thread created successfully", thread: newThread });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getThreads = async (req, res) => {
  try {
    const userId = req.user._id;
    const threads = await Thread.find().populate('createdBy', 'name emailId').sort({ createdAt: -1 });

    const threadsWithMeta = await Promise.all(threads.map(async (thread) => {
      const likeCount = thread.upvotes;
      const commentCount = await comment.countDocuments({ threadID: thread._id, type_of_comment: 'comment' });
      const isLiked = await vote.findOne({ userID: userId, type_of_vote: 'post', type_id: thread._id }) ? true : false;
      return {
        ...thread.toObject(),
        likeCount,
        commentCount,
        isLiked
      };
    }));

    res.json(threadsWithMeta);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getThreadById = async (req, res) => {
  try {
    const userId = req.user._id;
    const thread = await Thread.findById(req.params.id).populate('createdBy', 'name emailId');
    if (!thread) return res.status(404).json({ message: 'Thread not found' });

    const likeCount = thread.upvotes;
    const commentCount = await comment.countDocuments({ threadID: thread._id, type_of_comment: 'comment' });
    const isLiked = await vote.findOne({ userID: userId, type_of_vote: 'post', type_id: thread._id }) ? true : false;

    res.json({
      ...thread.toObject(),
      likeCount,
      commentCount,
      isLiked
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
