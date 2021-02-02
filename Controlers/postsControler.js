var express = require("express");
const User = require("../Models/dbUser");
const Post = require("../Models/dbPost");

//Posts controlers ======================================================================================================================================
const allPosts = async (req, res) => {
  await User.find()
    .select("-password -__v -role")
    .populate("posts")
    .then((data) => res.status(200).json(data))
    .catch((err) => console.log(err));
};

const addPost = async (req, res) => {
  const { user_id } = req.params;
  const { title, description } = req.body;
  await Post.create({ title, description })
    .then((post) => {
      User.findByIdAndUpdate(
        user_id,
        {
          $push: {
            posts: post._id,
          },
        },
        {
          new: true,
          useFindAndModify: false,
        }
      )
        .select("-password -__v -_id -role")
        .exec()
        .then((data) => {
          res
            .status(200)
            .json({ msg: `${data.name} has added a post successfully.` });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => res.status(500).json({ msg: err.errors.title.message }));
};
//==========================================================================================================================================================

exports.allPosts = allPosts;
exports.addPost = addPost;
