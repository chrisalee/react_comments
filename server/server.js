const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

//configure mongoose   
// "mongodb://127.0.0.1:27017/commentsDB"  can use this if no dotenv
mongoose.connect(process.env.MONGODB_URL, {});
const db = mongoose.connection;
db.on("error", error => {
    console.log(error);
});
db.once("open", () => {
    console.log("connected to the database");
});

const CommentSchema = mongoose.Schema({
    user: String,
    message: String,
    likes: Number,
    editable: Boolean,
    replies: [{
        user: String,
        message: String,
        likes: Number
    }]
});

const CommentsModel = mongoose.model("Comment", CommentSchema);



const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
//handle routes

//get document from the collection, limited by the data sent in the POST request
app.post("/get-data", (request, response) => {
    CommentsModel.find({}, (error, data) => {
        if(error) {
            console.log(error)
        } else {
            response.send(data)
        }
    }).limit(request.body.limitNum)
});

const port = process.env.PORT || 5000;
app.listen(port || process.env.PORT, () => console.log(`Server has started on port ${port}.  BOOM SHACKALAKA!!`));