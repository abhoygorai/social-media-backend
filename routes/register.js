const bcrypt = require("bcrypt");
const { connectToDatabase } = require("../db/connectToDatabase");

const register = async (req, res) => {
  const { name, username, password } = req.body;
  const client = await connectToDatabase();

  try {
    // Check if user already exists
    const userCheckQuery = "SELECT * FROM users WHERE username = $1";
    const userCheckResult = await client.query(userCheckQuery, [username]);
    if (userCheckResult.rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Encrypt the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user into the users table
    const insertUserQuery = `
      INSERT INTO users (name, username, password)
      VALUES ($1, $2, $3) RETURNING *
    `;
    const insertUserResult = await client.query(insertUserQuery, [
      name,
      username,
      hashedPassword,
    ]);

    // Respond with the newly created user (excluding the password)
    const newUser = insertUserResult.rows[0];
    delete newUser.password; // Remove the password field before sending the response

    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = register;
