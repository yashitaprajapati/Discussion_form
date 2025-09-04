
const vote = require('../models/vote.model');
const User = require('../models/userModel');

exports.votePosts = async (req,res)=>{
    try{
    const userID = req.user._id;
    const postID = req.params.id;
    const existingUser = await User.findById(userID);
    if(!existingUser){
        return res.status(404).json("user_id not found")
    }

     const existingVote = await vote.findOne({
            userID: userID,
            type_of_vote: "post",
            type_id: postID
        });

        if (existingVote) {
            await vote.findOneAndDelete({
                userID: userID,
                type_of_vote: "post",
                type_id: postID
            });
            return res.status(200).json(`Post like removed by ${existingUser.emailId}!`);
        }
    
    const newPostVote = new vote({
        userID:userID,
        type_of_vote:"post",
        type_id:postID
    });
    await newPostVote.save();
    return res.status(200).json(`Post Liked by ${existingUser.emailId}!`);
    
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
};

exports.voteComments = async (req, res) => {
    try {
        const userID = req.user._id;
        const commentID = req.params.id;
        const existingUser = await User.findById(userID);
        if (!existingUser) {
            return res.status(404).json("user_id not found");
        }

        const existingVote = await vote.findOne({
            userID: userID,
            type_of_vote: "comment",
            type_id: commentID
        });

        if (existingVote) {
            await vote.findOneAndDelete({
                userID: userID,
                type_of_vote: "comment",
                type_id: commentID
            });
            return res.status(200).json(`Comment like removed for ${existingUser.emailId}!`);
        }

        const newCommentVote = new vote({
            userID: userID,
            type_of_vote: "comment",
            type_id: commentID
        });
        await newCommentVote.save();
        return res.status(200).json(`Comment Liked by ${existingUser.username || existingUser.emailId}`);
    } catch (err) {
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

     const existingVote = await vote.findOne({
            userID: userID,
            type_of_vote: "reply",
            type_id: ReplyID
        });

        if (existingVote) {
            await vote.findOneAndDelete({
                userID: userID,
                type_of_vote: "reply",
                type_id: ReplyID
            });
            return res.status(200).json(`Reply like removed by ${existingUser.emailId}!`);
        }
    
    const newReplyVote = new vote({
        userID:userID,
        type_of_vote:"reply",
        type_id:ReplyID
    });
    await newReplyVote.save();
    return res.status(200).json(`Reply Liked by ${existingUser.emailId}`);
    
    }catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
};

