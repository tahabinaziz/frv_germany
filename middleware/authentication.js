import { getUserAndRoles } from "../models/users.js";
import jwt from "jsonwebtoken";
import { verifyPassword } from "../utility/crypt.js";

const authenticationMiddleware = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await getUserAndRoles(email);

    if (!user || user.length === 0) {
      return res.status(400).json({ error: "User not found" });
    } else if (user.length > 1) {
      return res.status(400).json({ error: "Multiple users with same email" });
    }

    const validate = await verifyPassword(password, user[0].password);

    if (validate !== true) {
      return res.status(400).json({ error: "Wrong password" });
    }

    req.user = user[0];

    const secretKey =
      process.env.JWT_SECRET_KEY || "sadnasdnasjdnasjkdnkjdnjkdnas";

    const token = jwt.sign(
      {
        id: req.user?.id,
        name: req.user?.name,
        email: req.user?.email,
      },
      secretKey,
      { expiresIn: 60 * 60 * 8 }
    );
    req.access_token = token;
    return next();
  } catch (error) {
    return res.status(400).json({ error: "Authentication failed" });
  }
};

export default authenticationMiddleware;
