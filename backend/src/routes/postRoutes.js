const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { createPost, getAllPosts, likePost, commentPost, editPost, deletePost, editComment, deleteComment, getMyPosts } = require("../controllers/postController");

const router = express.Router();

router.post("/", authMiddleware, createPost);
router.get("/", authMiddleware, getAllPosts);
router.get("/mine", authMiddleware, getMyPosts);

router.put("/:id/like", authMiddleware, likePost);
router.post("/:id/comment", authMiddleware, commentPost);

router.put("/:id", authMiddleware, editPost);
router.delete("/:id", authMiddleware, deletePost);

router.put("/:id/comment/:commentId", authMiddleware, editComment);
router.delete("/:id/comment/:commentId", authMiddleware, deleteComment);

module.exports = router;
