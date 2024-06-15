const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/authorization");

const register = require("./register");
const login = require("./login");
const findByName = require("./findByName");
const follow = require("./follow");
const postContent = require("./postContent");
const getFeed = require("./feed");
const getPost = require("./postById");
const likePost = require("./likePost");
const unlikePost = require("./unlikePost");
const commentPost = require("./commentPost");
const removeComment = require("./unCommentPost")
const editCommentPost = require("./editCommentPost");

// Authentication endpoints
router.post("/register", register);
router.post("/login", login);

router.get("/findByName", authorization, findByName);
router.post("/follow", authorization, follow);

router.post("/postContent", authorization, postContent);
router.post("/feed", authorization, getFeed);
router.post("/getPost", authorization, getPost);

router.post("/addLike", authorization, likePost);
router.post("/removeLike", authorization, unlikePost);

router.post("/addComment", authorization, commentPost);
router.post("/removeComment", authorization, removeComment);
router.post("/editComment", authorization, editCommentPost);

module.exports = router;
