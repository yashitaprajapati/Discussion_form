const comment = require('../models/comment.model');
const Thread = require('../models/threadModel');

exports.addComment = async (req, res) => {
    try {
        const userID = req.user._id; 
        const threadId = req.params.id; 
        console.log('threadId:', threadId);
        const { comments } = req.body; 

        if (!comments || typeof comments != 'string') {
            return res.status(400).json("Invalid comment format. 'comments' must be a string.");
        }

        const existingThread = await Thread.findById(threadId);
        if (!existingThread) {
            return res.status(404).json(`Thread doesn't exist.`);
        }

        const newComment = new comment({
            threadID:threadId,
            UserID: userID,
            text: comments,
            type_of_comment:"comment"
        })
        await newComment.save();
      
        return res.status(200).json({
            message:`Comment posted successfully for ${existingThread.createdBy}`,
            comment:newComment
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};

exports.replyComment = async (req, res) => {
    try{
    const user = req.user.id;
    const commentId = req.params.id;
    const {commentReply} = req.body;
    
        const existingComment = await comment.findById(commentId);
        if (!existingComment) return res.status(400).json("comment doesn't exist. Please check");

    const reply = new comment({
        threadID: existingComment.threadID,
        UserID:user,
        comments:existingComment.comments,
        parentCommentId:commentId,
        text:commentReply,
        type_of_comment:"reply"
    });

    await reply.save();
    

    return res.status(200).json({
        message:`replied successfully on ${existingComment.text}`,
        reply:reply
    });
    }catch(err){
        console.log(err)
        return res.status(400).json(err);
    }
}

exports.getComments = async(req,res)=>{
    const comments = await comment.find({type_of_comment:'comment'});
    try{
        return res.status(200).json(comments);
    }catch(err){
        console.log(err);
        return res.status(500).json(err);
    }
}
