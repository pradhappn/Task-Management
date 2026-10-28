function errorHandler(err, _req, res, next) {
    console.log(err);

    if (res.headersSent) {
        return next(err);
    }

    //Invalid JSON sent by the client
    if(err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({success: false, message: "Invalid JSON sent by the client"});
    }   

    //Mongoose schema validation errors 
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((item) => item.message);
        return res.status(400).json({success: false, message: errors.join(", ")});  

    }

      // Invalid MongoDB ID cast
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid value supplied",
    });
  }

  // Duplicate key error, if a unique index is added later
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A record with that value already exists",
    });
  }

  return res.status(err.statusCode || 500).json({
    success: false,
    message:
      err.statusCode && err.statusCode < 500
        ? err.message
        : "Internal server error",
  });
}

module.exports = errorHandler;