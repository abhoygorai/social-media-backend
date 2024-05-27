const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/authorization")

const register = require("./register");
const login = require("./login");
const findByName = require("./findByName")
const follow = require("./follow");

// Authentication endpoints
router.post("/register", register);
router.post("/login", login);

router.get("/findByName", authorization, findByName);
router.post("/follow", authorization, follow);
// follow people

// post content
// 




module.exports = router;
