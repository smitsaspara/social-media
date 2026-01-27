import express from "express";

import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  searchUsersByFirstName,
} from "../controllers/users.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


router.get("/search/first-name", verifyToken, searchUsersByFirstName);
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);


router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;