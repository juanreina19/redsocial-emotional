const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const { getProfile, updateProfile, getMood, updateMood, getMoodById, getProfileById, followUser, unfollowUser, getUserSuggestions } = require("../controllers/userController");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

router.get("/mood", authMiddleware, getMood);
router.put("/mood", authMiddleware, updateMood);

router.get("/profile/:id", authMiddleware, getProfileById);
router.get("/mood/:id", authMiddleware, getMoodById);

router.post("/:id/follow", authMiddleware, followUser);
router.post("/:id/unfollow", authMiddleware, unfollowUser);

router.get("/suggestions", authMiddleware, getUserSuggestions);

module.exports = router;
