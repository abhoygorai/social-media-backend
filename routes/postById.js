const { connectToDatabase } = require("../db/connectToDatabase");

const getPost = async (req, res) => {
    const { postId } = req.body;
    const client = await connectToDatabase();
  
    try {
      // Fetch the post from the posts table by postId
      const postQuery = 'SELECT * FROM posts WHERE postid = $1';
      const postResult = await client.query(postQuery, [postId]);
  
      if (postResult.rows.length === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      return res.status(200).json({ post: postResult.rows[0] });
    } catch (error) {
      console.error('Error fetching post:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  

module.exports = getPost;
