const { connectToDatabase } = require("../db/connectToDatabase");

const findByName = async (req, res) => {
  const { name } = req.body;

  try {
    // Query to find users by name
    const client = await connectToDatabase();
    const searchQuery = "SELECT * FROM users WHERE name ILIKE $1";
    const searchResult = await client.query(searchQuery, [`%${name}%`]);

    const users = searchResult.rows.map((user) => {
      const { name, username } = user;
      return { name, username };
    });

    // Respond with the found users
    return res.status(200).json({ users: users });
  } catch (error) {
    console.error("Error finding users by name:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = findByName;
