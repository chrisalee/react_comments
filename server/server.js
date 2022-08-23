const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//configure mongoose
// "mongodb://127.0.0.1:27017/commentsDB"  can use this if no dotenv
mongoose.connect(process.env.MONGODB_URL, {});
const db = mongoose.connection;
db.on("err", (err) => {
  console.log(err);
});
db.once("open", () => {
  console.log("connected to the database");
});

const CommentSchema = mongoose.Schema({
  user: String,
  message: String,
  likes: Number,
  editable: Boolean,
  replies: [
    {
      user: String,
      message: String,
      likes: Number,
    },
  ],
});

const CommentsModel = mongoose.model("Comment", CommentSchema);

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//handle routes

//get document from the collection, limited by the data sent in the POST req
app.post("/get-data", (req, res) => {
  CommentsModel.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  }).limit(req.body.limitNum);
});

//user create a new comment from top comments box
app.post("/new-comment", (req, res) => {
  let messageData = req.body.messageData;
  const newMessage = new CommentsModel({
    user: "Default User",
    message: messageData,
    likes: 0,
    editable: true,
    replies: [],
  }).save();

  //send back empty data so we can use promise
  res.send("");
});

//intersection observer wants more data
app.post("/get-more-data", (req, res) => {
  let commentIncrement = req.body.commentIncrement;
  CommentsModel.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.send(data);
    }
  })
    .skip(commentIncrement)
    .limit(10);
});

//user creates a new comment from sub comment
app.post("/new-sub-comment", (req, res) => {
  let messageData = req.body.messageData;
  let messageId = req.body.messageId;
  //create new subdata based on data POSTED
  const newSubMessage = {
    user: "Default User",
    message: messageData,
    likes: 0,
  };
  CommentsModel.updateOne(
    {_id: messageId},
    {$push: {replies: newSubMessage}},
    (err, data) => {
        if (err) {
          console.log(err);
        } 
        //send back empty data so we can use promise
        res.send('');
        console.log(data, 'new sub');
    }
  );
});

//user wants to update comment
app.post("/update-comment", (req, res) => {
  let commentId = req.body.commentId;
  CommentsModel.findOne({_id: commentId}, (err, data) => {
    if(!err) {
      res.send()
    }
  })
});

//user wants to delete message
app.post("/delete-comment", (req, res) => {
  let messageId = req.body.messageId;
  CommentsModel.deleteOne({_id: messageId}, (err, data) => {
    if(err) {
      console.log(err)
    } 
    //send back empty data so we can use promise
    res.send('');
  })
});

//user wants to delete a sub message
app.post("/delete-sub-comment", (req, res) => {
  let messageId = req.body.messageId;
  let subId = req.body.subId;
  CommentsModel.updateOne(
    {_id: messageId}, 
    {$pull: {replies: {_id: subId}}},
    (err, data) => {
      if (err) {
        console.log(err);
      } 
      //send back empty data so we can use promise
      res.send('');
      console.log(data)
    }
  )
});

//user has liked/unliked message
app.post("/update-like", (req, res) => {
  let messageId = req.body.messageId;
  let likes = req.body.likes;
  CommentsModel.updateOne(
    {_id: messageId}, 
    {likes: likes}, 
    (err, data) => {
      if (err) {
        console.log(err);
      } 
  })
});

//user has liked/unliked sub message
app.post("/update-sub-like", (req, res) => {
  let messageId = req.body.messageId;
  let subId = req.body.subId;
  let likes = req.body.likes;
  CommentsModel.updateOne(
    {_id: messageId, "replies._id": subId}, 
    {$set: {"replies.$.likes": likes}}, 
    (err, data) => {
      if (err) {
        console.log(err);
      } 
  })
  console.log("sub-comment like updated")
});

const port = process.env.PORT || 5000;
app.listen(port || process.env.PORT, () =>
  console.log(`Server has started on port ${port}.  BOOM SHACKALAKA!!`)
);
