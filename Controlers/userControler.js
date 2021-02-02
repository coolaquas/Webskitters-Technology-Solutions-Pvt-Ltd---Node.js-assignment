var express = require("express");
const User = require("../Models/dbUser");
const jwt = require("jsonwebtoken");
const multer = require("multer");

//Helper functions ======================================================================================================================================
// Image stored in specific location
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

// Only jpeg and png file format allowed
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(console.error("Please select .jpeg/png"), false);
  }
};

//Maximum 5 mb can be uploaded
const upload = multer({
  fileFilter: fileFilter,
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});

//Checks for user authentication
let isAuthenticated = (req, res, next) => {
  const token = req.headers["authorization"];
  if (token == null || token === "")
    return res.status(401).send({ msg: "Please Sign In first" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) return res.status(401).send({ msg: "Unauthorize User" });
    req.user = user;
    next();
  });
};

//checks for Admin priviledge
let isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin") {
    return res.status(401).send({ msg: "Unauthorize Access" });
  }
  next();
};
//==========================================================================================================================================================

//Users controlers ======================================================================================================================================
const registration = async (req, res) => {
  const new_user = req.body;
  if (req.file == null) res.status(400).json({ msg: "Please upload a image" });
  else {
    new_user.image = req.file.path;
    await User.create(req.body)
      .then((user) =>
        res
          .status(200)
          .json({ msg: `User created successfully. Username : ${user.name}` })
      )
      .catch((err) => res.status(400).json({ msg: err.message }));
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ email, password })
    .select("name email phone image role")
    .then((user) => {
      if (!user)
        return res.status(401).send({
          msg: "Please check email id and password properly, and try again.",
        });
      else {
        const { name, email, phone, image, role } = user;
        const accessToken = jwt.sign(
          { name, email, phone, image, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );
        res.status(200).json({
          msg: `${name} is successfully loged in.`,
          Token: accessToken,
        });
      }
    })
    .catch((err) => console.log(err));
};

const oneUser = async (req, res) => {
  const { user_id } = req.params;
  User.findById(user_id)
    .select("-password -role -_id -__v")
    .exec()
    .then((data) => {
      res.send(data);
    })
    .catch((err) =>
      res
        .status(500)
        .json({ msg: "The requested user Id details is not avalible" })
    );
};
//==========================================================================================================================================================

exports.registration = registration;
exports.login = login;
exports.oneUser = oneUser;
exports.isAuthenticated = isAuthenticated;
exports.isAdmin = isAdmin;
exports.upload = upload;
