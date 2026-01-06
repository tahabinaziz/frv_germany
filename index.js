// import express from "express";
// import { getUser, registerUser, resetPassword } from "./models/users.js";
// import authenticationMiddleware from "./middleware/authentication.js";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import path from "path";
// const app = express();
// const port = process.env.PORT || 3000;
// import router from "./routes/api.js";
// import authorizationMiddleware from "./middleware/authorization.js";
// import { fileURLToPath } from "url";
// app.use(cors({ credentials: true, origin: true }));
// app.use(cookieParser());
// app.use(express.json());

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// /* -------------------- API ROUTES FIRST -------------------- */

// app.post("/registration", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const user = await getUser(email);
//     if (user.length > 0) {
//       return res.status(400).json({ error: "User already exists" });
//     }
//     await registerUser(name, email, password);
//     return res.json({ message: "New user has been created!" });
//   } catch (error) {
//     console.log("err", error);

//     return res.status(400).json({ error: error });
//   }
// });

// app.post("/login", authenticationMiddleware, (req, res) => {
//   return res
//     .cookie("access_token", req.access_token, {
//       httpOnly: true,
//       secure: true,
//       sameSite: "none",
//       // secure: process.env.NODE_ENV === "production",
//     })
//     .status(200)
//     .json({
//       message: "Logged in successfully 😊 👌",
//       user: {
//         id: req.user.id,
//         email: req.user.email,
//         name: req.user.name,
//       },
//       access_token: req.access_token,
//     });
// });

// app.get("/logout", (req, res) => {
//   return res
//     .clearCookie("access_token")
//     .status(200)
//     .json({ message: "Successfully logged out 😏 🍀" });
// });

// app.post("/forget_password", async (req, res) => {
//   try {
//     const { email, newPassword } = req.body;
//     const user = await getUser(email);

//     if (user.length > 0) {
//       await resetPassword(email, newPassword);
//       return res.status(200).json({ message: "Password reset successfully" });
//     } else {
//       return res
//         .status(400)
//         .json({ error: "No user found with this email address." });
//     }
//   } catch (error) {
//     console.log("err", error);
//     return res.status(400).json({ error: error });
//   }
// });

// app.use("/api", authorizationMiddleware, router);
// // Handle React routing, return index.html for any unknown route

// /* -------------------- STATIC FRONTEND -------------------- */

// const buildPath = path.join(__dirname, "./dist");
// app.use(express.static(buildPath));

// /* -------------------- SPA FALLBACK (LAST) -------------------- */

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(buildPath, "index.html"));
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./routes/api.js"; // your API routes
import authorizationMiddleware from "./middleware/authorization.js";
import authenticationMiddleware from "./middleware/authentication.js";
import { getUser, registerUser, resetPassword } from "./models/users.js";

const app = express();
const port = process.env.PORT || 3000;

// ----------- CORE MIDDLEWARE -----------
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json());

// ----------- HELPER FOR __dirname -----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------- API ROUTES -----------
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
    console.error(error);
    return res.status(400).json({ error: error });
  }
});

app.post("/login", authenticationMiddleware, (req, res) => {
  return res
    .cookie("access_token", req.access_token, {
      httpOnly: true,
      secure: false, // <- set true in production with HTTPS
      sameSite: "lax", // <- set "none" in production with HTTPS
    })
    .status(200)
    .json({
      message: "Logged in successfully",
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
    .json({ message: "Logged out successfully" });
});

app.post("/forget_password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await getUser(email);
    if (user.length > 0) {
      await resetPassword(email, newPassword);
      return res.json({ message: "Password reset successfully" });
    } else {
      return res.status(400).json({ error: "No user found with this email" });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error });
  }
});

// Protected API routes
app.use("/api", authorizationMiddleware, router);

// ----------- SERVE FRONTEND STATIC FILES -----------
const buildPath = path.join(__dirname, "./dist");
app.use(express.static(buildPath));

// ----------- SPA FALLBACK ROUTE (Express 5 compliant) -----------
app.get("/*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// ----------- START SERVER -----------
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
