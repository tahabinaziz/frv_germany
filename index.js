import express from "express";
import { registerUser } from "./models/users.js";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from Bun + Express 🚀");
});

app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    await registerUser(name, email, password);
    console.log("New user has been created!");
    console.log(req.body, "body");
    return res.json({ message: "New user has been created!" });
  } catch (error) {
    console.log("err", error);

    return res.status(400).json({ error: error });
  }
});
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
