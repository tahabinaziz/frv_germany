import jwt from "jsonwebtoken";

const authorizationMiddleware = (req, res, next) => {
  const token = req.cookies?.access_token;
  const secretKey =
    process.env.JWT_SECRET_KEY || "sadnasdnasjdnasjkdnkjdnjkdnas";

  if (!token) {
    return res.status(400).json({ message: "No token" });
  }
  if (!secretKey) {
    return res.status(400).json({ message: "No token" });
  }

  try {
    const data = jwt.verify(token, secretKey);
    req.user = data;

    return next();
  } catch (error) {
    console.error("JWT error:", err);
    return res.status(400).json({ error });
  }
};

export default authorizationMiddleware;
