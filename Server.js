var express = require("express");
require("dotenv").config();
var cors = require("cors");
const mongoose = require("mongoose");
var path = require("path");
var logger = require("morgan");
const bodyParser = require("body-parser");
var userRouter = require("./Routes/user");
var postRouter = require("./Routes/post");

//API configuration
//=========================================================================================================================================
const app = express();
const port = process.env.PORT || 8001;
//=========================================================================================================================================

//middleWare
//=========================================================================================================================================
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", userRouter);
app.use("/posts", postRouter);

//=========================================================================================================================================

//Db Configuration
//=========================================================================================================================================
const connection_url = `mongodb+srv://${process.env.USER_Name}:${process.env.Password}@cluster0.zhy9a.mongodb.net/assignment?retryWrites=true&w=majority`;
mongoose.Promise = global.Promise;
mongoose
  .connect(connection_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DataBase Connection successful"))
  .catch((err) => console.log(err));
//=========================================================================================================================================

// API Endpoint
// =========================================================================================================================================
app.get("/", (req, res) => {
  res.status(200).send("Sanity Check ok!!!");
});
// =========================================================================================================================================

//Listner
//=========================================================================================================================================
app.listen(port, () => {
  console.log(`Listning on Port No. : ${port}`);
});
//=========================================================================================================================================
