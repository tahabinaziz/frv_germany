import { getUser } from "../models/users.js";
import { verifyPassword } from "../utility/crypt.js";

const basicAuthorizationMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).send("Authorization header missing or invalid.");
  }

  // Decode base64 credentials
  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  const [email, password] = credentials.split(":");
  // const email = req.body.email;
  // const password = req.body.password;
  try {
    const user = await getUser(email);

    if (!user || user.length === 0) {
      return res.status(400).json({ error: "User not found" });
    } else if (user.length > 1) {
      return res.status(400).json({ error: "Multiple users with same email" });
    }

    const validate = await verifyPassword(password, user[0].password_hash);

    if (validate !== true) {
      return res.status(400).json({ error: "Wrong password" });
    }

    req.user = user[0];

    return next();
  } catch (error) {
    return res.status(400).json({ error: "Authentication failed" });
  }
};

export default basicAuthorizationMiddleware;
