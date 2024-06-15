const { connectToDatabase } = require("../db/connectToDatabase");

const unlikePost = async (req, res) => {
  const client = await connectToDatabase();
  const { username, postId } = req.body;

  // Check if all data are present
  if (!username || !postId) {
    return res
      .status(400)
      .json({ message: "Username and postId are required" });
  }

  // Check if the user is authorized
  if (req.user.username !== username) {
    return res.status(404).json({ message: "Unauthorized user" });
  }

  try {
    const checkLikeQuery = `
      SELECT * FROM likes WHERE postid = $1 AND username = $2
    `;
    const checkLikeResult = await client.query(checkLikeQuery, [
      postId,
      username,
    ]);

    if (checkLikeResult.rows.length === 0) {
      return res
        .status(400)
        .json({ message: "Like does not exist for this user on this post" });
    }

    const deleteLikeQuery = `
      DELETE FROM likes WHERE postid = $1 AND username = $2
      RETURNING *
    `;
    const deleteLikeResult = await client.query(deleteLikeQuery, [
      postId,
      username,
    ]);

    return res.status(200).json({
      message: "Like removed successfully",
      like: deleteLikeResult.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = unlikePost;
