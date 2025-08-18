/*vote logic - 3 endpoints -
1. post like - post_id, user_id
2. comment like - comment_id, user_id
3. reply like - comment_id, user_id,  */
const vote = require('../models/vote.model');

exports.votePosts = async (req,res)=>{
    try{
    const userID = req.user._id;
    const postID = req.params.id;
    const existingUser = await User.findById(userID);
    if(!existingUser){
        return res.status(404).json("user_id not found")
    }

    const existingVote = await vote.findById(userID);
    if(existingVote){
        vote.deleteOne(existingVote);
        return res.status(200).json(`Post like removed for ${User.username}`);
    }
    
    const newPostVote = new vote({
        userID:userID,
        type_of_vote:"post",
        type_id:postID
    });
    await newPostVote.save();
    return res.status(200).json(`Post Liked by ${User.username}`);
    
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.voteComments = async (req,res)=>{
    try{
    const userID = req.user._id;
    const commentID = req.params.id;
    const existingUser = await User.findById(userID);
    if(!existingUser){
        return res.status(404).json("user_id not found")
    }

    const existingVote = await vote.findById(userID);
    if(existingVote){
        vote.deleteOne(existingVote);
        return res.status(200).json(`Post like removed for ${User.username}`);
    }
    
    const newCommentVote = new vote({
        userID:userID,
        type_of_vote:"Comment",
        type_id:commentID
    });
    await newCommentVote.save();
    return res.status(200).json(`Post Liked by ${User.username}`);
    
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.voteReply = async (req,res)=>{
    try{
    const userID = req.user._id;
    const ReplyID = req.params.id;
    const existingUser = await User.findById(userID);
    if(!existingUser){
        return res.status(404).json("user_id not found")
    }

    const existingVote = await vote.findById(userID);
    if(existingVote){
        vote.deleteOne(existingVote);
        return res.status(200).json(`Post like removed for ${User.username}`);
    }
    
    const newReplyVote = new vote({
        userID:userID,
        type_of_vote:"Reply",
        type_id:ReplyID
    });
    await newReplyVote.save();
    return res.status(200).json(`Post Liked by ${User.username}`);
    
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
};

