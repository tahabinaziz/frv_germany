import { hashPassword } from "../utility/crypt.js";
import sql from "./db.js";

export async function registerUser(name, email, password) {
  const passwordHash = await hashPassword(password);

  const newUser = await sql`
    INSERT INTO users (name, email, password_hash, created_at)
    VALUES (${name}, ${email}, ${passwordHash}, NOW())
    RETURNING id
  `;

  return newUser[0];
}

export async function getUserAndRoles(email) {
  return await sql`
  SELECT users.id, users.name, users.email FROM users
  WHERE users.email = ${email}
  `;
}
