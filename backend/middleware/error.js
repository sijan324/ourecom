// Error handler middleware
export default (err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
};
