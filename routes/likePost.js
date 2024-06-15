const { connectToDatabase } = require("../db/connectToDatabase");

const likePost = async (req, res) => {
    
  const client = await connectToDatabase();
  const { username, postId } = req.body;

  // check if all data are present
  if (!username || !postId) {
    return res
      .status(400)
      .json({ message: "Username and postId are required" });
  }
  // check the user is authorized or not
  if (req.user.username != username) {
    return req.status(404).json({ message: "Unauthorized user" });
  }

  try {
    const checkLikeQuery = `
      SELECT * FROM likes WHERE postid = $1 AND username = $2
    `;
    const checkLikeResult = await client.query(checkLikeQuery, [
      postId,
      username,
    ]);

    if (checkLikeResult.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Post already liked by this user" });
    }

    const insertLikeQuery = `
      INSERT INTO likes (postid, username) 
        VALUES ($1, $2)
      RETURNING *
    `;
    const insertLikeResult = await client.query(insertLikeQuery, [
      postId,
      username,
    ]);

    return res.status(201).json({ like: insertLikeResult.rows[0] });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = likePost;
