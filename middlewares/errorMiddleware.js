export const errorMiddleware = (err, req, res, next) => {
  err.stausCode = err.stausCode || 500;
  err.message = err.message || "Internal server Error";
  res.status(err.stausCode).json({
    success: false,
    errMessage: err.message,
  });
};
