const { connectToDatabase } = require("../db/connectToDatabase");

const postContent = async (req, res) => {
  const client = await connectToDatabase();
  const { username, content } = req.body;

  try {
    // Check if the user exists
    const userCheckQuery = "SELECT * FROM users WHERE username = $1";
    const userCheckResult = await client.query(userCheckQuery, [username]);
    if (userCheckResult.rows.length === 0) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // check is username and token is same or not
    if(username != req.user.username){
      return res.status(400).json({message:"Unauthorized username"});
    } 

    // Insert new post into the posts table
    const insertPostQuery = `
      INSERT INTO posts (username, content)
      VALUES ($1, $2)
      RETURNING *
    `;
    const insertPostResult = await client.query(insertPostQuery, [
      username,
      content,
    ]);

    // Respond with the newly created post
    const newPost = insertPostResult.rows[0];
    return res.status(201).json({ post: newPost });
  } catch (error) {
    console.error("Error posting content:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = postContent;
