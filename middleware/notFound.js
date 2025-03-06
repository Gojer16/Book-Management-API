const notFound = (req, res, next) => {
    console.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    
    res.status(404).json({
      success: false,
      error: `Route ${req.originalUrl} not found`
    });
  };
  
  module.exports = notFound;
  