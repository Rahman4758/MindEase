import jwt from 'jsonwebtoken';
import User from '../models/User.js';

 const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token
  console.log('Token from headers:', token)
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded jwt",decoded)
    req.user = await User.findById(decoded.userId).select('-password');
     console.log("User from DB:", req.user);

      if (!req.user) {
      return res.status(404).json({ message: 'User not found' });
    }

    next();
  } catch (err) {
    console.error("Token verification error:", err);
     if (err.name === 'TokenExpiredError') {
     return res.status(401).json({ message: 'Toekn expired. Please login again.' });
  }
  res.status(401).json({ message: 'Invalid token' });

}
};

export default  protect;
