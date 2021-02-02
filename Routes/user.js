var express = require("express");
var router = express.Router();
const {
  registration,
  login,
  oneUser,
  isAuthenticated,
  isAdmin,
  upload,
} = require("../Controlers/userControler");

router.get("/", (req, res) =>
  res.status(200).json({ msg: "User routes working fine" })
);
router.post("/registration", upload.single("image"), registration);
router.post("/login", login);
router.get("/viewUser/:user_id", isAuthenticated, isAdmin, oneUser);

module.exports = router;
