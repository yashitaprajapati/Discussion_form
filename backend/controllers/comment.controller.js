const comment = require('../models/comment.model');
const thread = require('../models/Thread');

exports.addComment = async (req, res) => {
    try {
        const user = req.user.id; 
        const threadId = req.params.id; 
        const { comments } = req.body; 

        if (!comments || typeof comments !== 'string') {
            return res.status(400).json("Invalid comment format. 'comments' must be a string.");
        }

        const existingBlog = await thread.findById({threadId});  
        if (!existingBlog) {
            return res.status(404).json("Blog doesn't exist.");
        }

        const newComment = new Comment({
            threadID:threadId,
            UserID: user,
            text: comments,
            type_of_comment:"comment"
        })
        await newComment.save();
      
        return res.status(200).json({
            message:`Comment posted successfully for ${threadId}`,
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
    
        const existingComment = await Comment.findById(commentId);
        if (!existingComment) return res.status(400).json("comment doesn't exist. Please check");

    const reply = new Comment({
        threadID: existingComment.threadID,
        UserID:user,
        comments:existingComment.comments,
        parentCommentId:commentId,
        text:commentReply,
        type_of_comment:"reply"
    });

    await reply.save();
    

    return res.status(200).json({
        message:`replied successfully on ${existingComment.comments}`,
        reply:reply
    });
    }catch(err){
        return res.status(400).json(err);
    }
}

exports.getComments = async(req,res)=>{
    try{
        return res.status(200).json(comments);
    }catch(err){
        return res.status(500).json(err);
    }
}
