const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");

let threads = [];

// GET all threads with search, filter, sort & pagination
router.get("/", authMiddleware, (req, res) => {
  const searchTerm = req.query.search || "";
  const selectedTag = req.query.tag || "";
  const selectedCategory = req.query.category || "";
  const sortBy = req.query.sort || "upvotes";
  const limit = parseInt(req.query.limit) || threads.length;
  const offset = parseInt(req.query.offset) || 0;

  let filtered = threads
    .filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.content.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(t => selectedTag ? t.tags.includes(selectedTag) : true)
    .filter(t => selectedCategory ? t.category === selectedCategory : true)
    .sort((a, b) =>
      sortBy === "recent" ? new Date(b.createdAt) - new Date(a.createdAt) : b.upvotes - a.upvotes
    );

  const paginated = filtered.slice(offset, offset + limit);
  res.json({ total: filtered.length, threads: paginated });
});

// GET thread by id and title
router.get("/:id/:title", authMiddleware, (req, res) => {
  const { id, title } = req.params;
  const thread = threads.find(t => t.id == id && t.title === title);
  if (!thread) return res.status(404).json({ message: "Thread not found" });
  res.json(thread);
});

// POST new thread
router.post("/", authMiddleware, (req, res) => {
  const { title, content, category, tags } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Title and Content are required" });

  const newThread = {
    id: threads.length + 1,
    title,
    content,
    category: category || "General",
    tags: tags || [],
    upvotes: 0,
    createdAt: new Date().toISOString()
  };

  threads.push(newThread);
  res.status(201).json(newThread);
});

// PUT update thread
router.put("/:id", authMiddleware, (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags } = req.body;

  const threadIndex = threads.findIndex(t => t.id === parseInt(id));
  if (threadIndex === -1)
    return res.status(404).json({ message: "Thread not found" });

  threads[threadIndex] = {
    ...threads[threadIndex],
    title: title || threads[threadIndex].title,
    content: content || threads[threadIndex].content,
    category: category || threads[threadIndex].category,
    tags: tags || threads[threadIndex].tags,
    updatedAt: new Date().toISOString(),
  };

  res.json({ message: "Thread updated", thread: threads[threadIndex] });
});

// DELETE thread
router.delete("/:id", authMiddleware, (req, res) => {
  const index = threads.findIndex(t => t.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Thread not found" });

  const deleted = threads.splice(index, 1);
  res.json({ message: "Thread deleted", thread: deleted[0] });
});

// POST upvote
router.post("/:id/upvote", authMiddleware, (req, res) => {
  const thread = threads.find(t => t.id === parseInt(req.params.id));
  if (!thread) return res.status(404).json({ message: "Thread not found" });

  thread.upvotes += 1;
  res.json({ message: "Thread upvoted", thread });
});

// POST downvote
router.post("/:id/downvote", authMiddleware, (req, res) => {
  const thread = threads.find(t => t.id === parseInt(req.params.id));
  if (!thread) return res.status(404).json({ message: "Thread not found" });

  thread.upvotes = Math.max(0, thread.upvotes - 1);
  res.json({ message: "Thread downvoted", thread });
});

module.exports = router;
