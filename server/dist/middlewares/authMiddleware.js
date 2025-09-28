import jwt from 'jsonwebtoken';
export const protect = (req, res, next) => {
    let token;
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user info to request
        req.user = decoded.user;
        next(); // ✅ proceed to next middleware
    }
    catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
