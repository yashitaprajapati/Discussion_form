const Thread = require("../models/threadModel");

const createThread = async (req, res, next) => {
  try {
    const { title, description, tags, category } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and Description are required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const thread = await Thread.create({
      title,
      description,
      tags,
      category,
      createdBy: req.user._id,
    });

    res.status(201).json(thread);
  } catch (error) {
    console.error("Error in createThread:", error.message);
    next(error); 
  }
};

const getThreads = async (req, res, next) => {
  try {
    const { search, tag, category, sort } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (tag) query.tags = tag;
    if (category) query.category = category;

    let threadsQuery = Thread.find(query).populate("createdBy", "firstName lastName emailId");

    if (sort === "most_recent") {
      threadsQuery = threadsQuery.sort({ createdAt: -1 });
    } else if (sort === "most_upvoted") {
      threadsQuery = threadsQuery.sort({ upvotes: -1 });
    }

    const threads = await threadsQuery;
    res.status(200).json(threads);
  } catch (error) {
    console.error("Error in getThreads:", error.message);
    next(error);
  }
};

module.exports = { createThread, getThreads };
