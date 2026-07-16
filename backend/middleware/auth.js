const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const rawHeader = req.headers.authorization;
  const token = rawHeader && rawHeader.startsWith('Bearer ')
    ? rawHeader.slice(7)
    : rawHeader;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
}

module.exports = verifyToken;
