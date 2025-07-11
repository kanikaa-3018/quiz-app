import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
      const admin = await Admin.findById(decoded.id).select('-password');

      if (!admin) {
        return res.status(401).json({ message: 'Unauthorized: Admin not found' });
      }

      req.user = admin;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

export default adminMiddleware;
