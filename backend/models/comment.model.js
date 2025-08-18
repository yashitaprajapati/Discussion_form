const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    threadID:{
        type: mongoose.Schema.ObjectId,
        required: true
    },
    UserID:{
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    text:{
        type:String,
        required:true
    },
    parentCommentId:{
        type:mongoose.Schema.ObjectId,
        default:null
    },
    type_of_comment:{
        type:String,
        enum: ["comment","reply"],
        required:true
    }
}, {timestamps:true});
module.exports = mongoose.model('comment', commentSchema);


