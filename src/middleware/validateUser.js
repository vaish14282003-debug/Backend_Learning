const validateUser = (req, res, next) => {
  const { name } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      message: "Name is required and must be a string",
    });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({
      message: "Name must be at least 2 characters",
    });
  }

  next();
};

module.exports = validateUser;
