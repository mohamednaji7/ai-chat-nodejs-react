import jwt from 'jsonwebtoken'

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (!token) {
      console.log('No token provided');
      return res.status(400).json({ error: 'No token provided' });
    }
  
    jwt.verify(token, process.env.SUPABASE_JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      req.user = decoded
      // console.log(decoded)
      next();
    });
  };
export default authenticateToken