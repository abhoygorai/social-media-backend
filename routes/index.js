const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/authorization")

const register = require("./register");
const login = require("./login");
const findByName = require("./findByName")
const follow = require("./follow");
const postContent = require("./postContent")

// Authentication endpoints
router.post("/register", register);
router.post("/login", login);

router.get("/findByName", authorization, findByName);
router.post("/follow", authorization, follow);
router.post("/postContent", authorization, postContent);



module.exports = router;
