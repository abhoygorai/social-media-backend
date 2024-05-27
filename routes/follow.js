const { connectToDatabase } = require("../db/connectToDatabase");

const follow = async (req, res) => {
  const client = await connectToDatabase();
  const { following, followedby } = req.body;

  try {
    // Check if the users exist
    const userCheckQuery =
      "SELECT * FROM users WHERE username = $1 OR username = $2";
    const userCheckResult = await client.query(userCheckQuery, [
      following,
      followedby,
    ]);

    if (userCheckResult.rows.length < 2) {
      return res
        .status(400)
        .json({ message: "One or both users do not exist" });
    }

    // Check if user is correct or not
    console.log("username", req.user);
    if (req.user.username != followedby) {
      return res.status(400).json({ message: "Autorization failed" });
    }

    // Insert follow relationship into followtable
    const insertFollowQuery = `
    INSERT INTO followtable (following, followedby)
    VALUES ($1, $2)
    RETURNING *
  `;
    const insertFollowResult = await client.query(insertFollowQuery, [
      following,
      followedby,
    ]);

    // Respond with the follow relationship
    return res.status(201).json({ follow: insertFollowResult.rows[0] });
  } catch (error) {
    console.error("Error following user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = follow;
