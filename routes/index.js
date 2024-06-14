const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/authorization")

const register = require("./register");
const login = require("./login");
const findByName = require("./findByName")
const follow = require("./follow");
const postContent = require("./postContent")
const getFeed = require("./feed");
const getPost = require("./postById");

// Authentication endpoints
router.post("/register", register);
router.post("/login", login);

router.get("/findByName", authorization, findByName);
router.post("/follow", authorization, follow);
router.post("/postContent", authorization, postContent);
router.post("/feed", authorization, getFeed);
router.post("/getPost", authorization, getPost);



module.exports = router;
