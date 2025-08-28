const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: "Not authenticated" 
      });
    }

    const userRole = req.user.role;
    const normalizedRole = userRole?.toLowerCase();

    const normalizedAllowed = allowedRoles.map(r => r.toLowerCase());
        console.log("req.user:", req.user);
  console.log("Allowed roles:", normalizedAllowed);
    if (!normalizedAllowed.includes(normalizedRole)) {
      return res.status(403).json({ 
        message: "Access denied: insufficient permissions" 
      });
    }

    next();
  };
};

module.exports = authorizeRole;