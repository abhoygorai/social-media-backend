const { connectToDatabase } = require("../db/connectToDatabase");

const commentPost = async (req, res) => {
  const client = await connectToDatabase();
  const { username, postId, content } = req.body;

  // check if all data are present
  if (!username || !postId || !content) {
    return res
      .status(400)
      .json({ message: "Username, postId, and content are required" });
  }

  // check if the user is authorized or not
  if (req.user.username != username) {
    return req.status(404).json({ message: "Unauthorized user" });
  }

  try {
    // Check if the user has already commented on the post with the same content
    const checkCommentQuery = `
      SELECT * FROM comments WHERE postid = $1 AND username = $2 AND content = $3
    `;
    const checkCommentResult = await client.query(checkCommentQuery, [
      postId,
      username,
      content,
    ]);

    if (checkCommentResult.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Duplicate comment by this user on the same post" });
    }

    // Insert a new comment into the comments table
    const insertCommentQuery = `
      INSERT INTO comments (postid, username, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const insertCommentResult = await client.query(insertCommentQuery, [
      postId,
      username,
      content,
    ]);

    return res.status(201).json({ comment: insertCommentResult.rows[0] });
  } catch (error) {
    console.error("Error adding comment to post:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = commentPost;
