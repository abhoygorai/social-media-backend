const { connectToDatabase } = require("../db/connectToDatabase");

const editCommentPost = async (req, res) => {
  const client = await connectToDatabase();
  const { username, postId, commentId, content } = req.body;

  // Check if all data are present
  if (!username || !postId || !commentId || !content) {
    return res
      .status(400)
      .json({
        message: "Username, postId, commentId, and content are required",
      });
  }

  // Check if the user is authorized
  if (req.user.username !== username) {
    return res.status(404).json({ message: "Unauthorized user" });
  }

  try {
    // Check if the comment exists
    const checkCommentQuery = `
        SELECT * FROM comments WHERE postid = $1 AND username = $2 AND commentid = $3
      `;
    const checkCommentResult = await client.query(checkCommentQuery, [
      postId,
      username,
      commentId,
    ]);

    if (checkCommentResult.rows.length === 0) {
      return res
        .status(400)
        .json({
          message: "Comment does not exist or does not belong to this user",
        });
    }

    // Update the comment
    const updateCommentQuery = `
        UPDATE comments 
        SET content = $4 
        WHERE postid = $1 AND username = $2 AND commentid = $3
        RETURNING *
      `;
    const updateCommentResult = await client.query(updateCommentQuery, [
      postId,
      username,
      commentId,
      content,
    ]);

    return res
      .status(200)
      .json({
        message: "Comment updated successfully",
        comment: updateCommentResult.rows[0],
      });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = editCommentPost;
