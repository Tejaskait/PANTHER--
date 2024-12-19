export const verifyAdmin = (req, res, next) => {
    try {
      const { isAdmin } = req.user; // Assuming req.user contains the user object from authentication middleware
      if (!isAdmin) {
        return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
      }
      next();
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error verifying admin status.' });
    }
  };
  