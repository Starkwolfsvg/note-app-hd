import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// // Extend Request to include `user`
export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// Define JWT payload type
interface JwtPayload {
  user: {
    id: string;
  };
}

export const protect = (req: Request, res: Response, next: NextFunction): void => {
  let token: string | undefined;

  // Check token in the Authorization header
  const authHeader = req.header('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // No token
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
    return; // ✅ exit early
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Attach user info to request
    req.user = decoded.user;

    next(); // ✅ proceed to next middleware
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};