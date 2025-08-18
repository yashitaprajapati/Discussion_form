const mongoose = require('mongoose');
const voteSchema = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    type_of_vote:{
        type:String,
        enum:["post","reply","comemnt"],
        required:true
    },
    type_id:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    }
},{timestamps:true},)

module.exports = mongoose.model("vote", voteSchema);