const { connectToDatabase } = require("../db/connectToDatabase");

const unCommentPost = async (req, res) => {
  const client = await connectToDatabase();
  const { username, postId, commentId } = req.body;

  // Check if all data are present
  if (!username || !postId || !commentId) {
    return res
      .status(400)
      .json({ message: "Username, postId, and commentId are required" });
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

    // Delete the comment
    const deleteCommentQuery = `
        DELETE FROM comments WHERE postid = $1 AND username = $2 AND commentid = $3
        RETURNING *
      `;
    const deleteCommentResult = await client.query(deleteCommentQuery, [
      postId,
      username,
      commentId,
    ]);

    return res
      .status(200)
      .json({
        message: "Comment removed successfully",
        comment: deleteCommentResult.rows[0],
      });
  } catch (error) {
    console.error("Error removing comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = unCommentPost;
