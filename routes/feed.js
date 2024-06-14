const { connectToDatabase } = require("../db/connectToDatabase");

const getFeed = async (req, res) => {
  const { username } = req.body;
  const client = await connectToDatabase();

  try {
    // check the username with the token identity
    if (username != req.user.username) {
      return res.status(404).json({ message: "Unauthorized user" });
    }
    // Fetch the list of users the person follows
    const followingQuery = `
        SELECT following FROM followtable WHERE followedby = $1
      `;
    const followingResult = await client.query(followingQuery, [username]);
    const followingUsers = followingResult.rows.map((row) => row.following);

    if (followingUsers.length === 0) {
      return res.status(200).json({ feed: [] });
    }

    // Fetch the posts from the users the person follows
    const postsQuery = `
        SELECT * FROM posts WHERE username = ANY($1::text[]) ORDER BY created_at DESC
      `;
    const postsResult = await client.query(postsQuery, [followingUsers]);

    return res.status(200).json({ feed: postsResult.rows });
  } catch (error) {
    console.error("Error fetching feed:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getFeed;
