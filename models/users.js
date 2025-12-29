import { hashPassword } from "../utility/crypt.js";
import sql from "./db";

export async function registerUser(name, email, password) {
  const passwordHash = await hashPassword(password);

  const newUser = await sql`
    INSERT INTO users (name, email, password_hash, created_on)
    VALUES (${name}, ${email}, ${passwordHash}, NOW())
    RETURNING id
  `;

  return newUser[0];
}
