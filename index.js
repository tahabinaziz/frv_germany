import express from "express";
import { getUser, registerUser, resetPassword } from "./models/users.js";
import authenticationMiddleware from "./middleware/authentication.js";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
const port = process.env.PORT || 3000;
import router from "./routes/api.js";
import authorizationMiddleware from "./middleware/authorization.js";
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());

app.use("/api", authorizationMiddleware, router);

app.get("/", (req, res) => {
  res.send("Hello from Bun + Express 🚀");
});

app.post("/registration", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await getUser(email);
    if (user.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }
    await registerUser(name, email, password);
    return res.json({ message: "New user has been created!" });
  } catch (error) {
    console.log("err", error);

    return res.status(400).json({ error: error });
  }
});

app.post("/login", authenticationMiddleware, (req, res) => {
  return res
    .cookie("access_token", req.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      // secure: process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({
      message: "Logged in successfully 😊 👌",
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
      },
      access_token: req.access_token,
    });
});

app.post("/forget_password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await getUser(email);

    if (user.length > 0) {
      await resetPassword(email, newPassword);
      return res.status(200).json({ message: "Password reset successfully" });
    } else {
      return res
        .status(400)
        .json({ error: "No user found with this email address." });
    }
  } catch (error) {
    console.log("err", error);
    return res.status(400).json({ error: error });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
