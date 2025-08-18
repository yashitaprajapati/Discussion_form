const Thread = require("../models/threadModel");

exports.createThread = async (req, res) => {
  try {
    const { title, description, tags, category, createdBy } = req.body; 


    if (!title || !description || !createdBy) {
      return res.status(400).json({ error: "Title, Description, and CreatedBy are required" });
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
    const threads = await Thread.find().sort({ createdAt: -1 }); 
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
