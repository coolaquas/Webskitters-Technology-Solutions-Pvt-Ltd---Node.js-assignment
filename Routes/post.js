var express = require("express");
var router = express.Router();
const { isAuthenticated } = require("../Controlers/userControler");
const { addPost, allPosts } = require("../Controlers/postsControler");

router.get("/", (req, res) =>
  res.status(200).json({ msg: "Post routes working fine" })
);
router.get("/allPosts", isAuthenticated, allPosts);
router.post("/addPost/:user_id", isAuthenticated, addPost);

module.exports = router;
