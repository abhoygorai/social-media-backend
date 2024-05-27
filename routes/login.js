const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connectToDatabase } = require("../db/connectToDatabase");

const generateToken = (username) => {
  const token = jwt.sign(
    {
      username: username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30m",
    }
  );

  return token.toString();
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const client = await connectToDatabase();

  try {
    
    // Check if user exists
    const userCheckQuery = "SELECT * FROM users WHERE username = $1";
    const userCheckResult = await client.query(userCheckQuery, [username]);
    if (userCheckResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = userCheckResult.rows[0];

    // Compare the provided password with the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Respond with the authenticated user (excluding the password) and a JWT token
    delete user.password;
    const token = generateToken(username);
    return res.status(200).json({ user, token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = login;
