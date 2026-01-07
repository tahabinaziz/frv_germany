import express from "express";
import { getUser, registerUser, resetPassword } from "./models/users.js";
import authenticationMiddleware from "./middleware/authentication.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();
const port = process.env.PORT || 3000;
import router from "./routes/api.js";
import authorizationMiddleware from "./middleware/authorization.js";
import { fileURLToPath } from "url";
import {
  addCurrentReferenceNumber,
  getCurrentReferenceNumber,
} from "./models/applications.js";
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, "dist"); // Adjust if build is elsewhere
console.log("buildPath: ", buildPath);

// ----------------- STATIC FILES -----------------
app.use(express.static(buildPath));

// app.get("/", (req, res) => {
//   res.send("Hello from Bun + Express 🚀");
// });

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
      secure: process.env.NODE_ENV === "production",
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

app.get("/logout", (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out 😏 🍀" });
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

app.post("/reference_number", async (req, res) => {
  try {
    const { current_reference_number } = req.body;
    await addCurrentReferenceNumber(current_reference_number);
    return res.status(200).json({ message: "Added successfully" });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
});

app.get("/reference_number", async (req, res) => {
  try {
    const _current_reference = await getCurrentReferenceNumber();

    return res.status(200).json({
      current_reference_number: _current_reference ?? 0, // default to 0 if null
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.use("/api", authorizationMiddleware, router);
// ----------------- SPA FALLBACK (Express 5 safe) -----------------
// Matches all routes not handled above, including /dashboard, /profile, etc.
// SPA fallback (Express 5)
// SPA fallback (for React routes)
app.get("/*splat", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ---------- Start Server ----------
if (process.env.NODE_ENV !== "production") {
  app.listen(port, () =>
    console.log(`Server running locally on http://localhost:${port}`)
  );
}

export default app; // For Vercel serverless function
