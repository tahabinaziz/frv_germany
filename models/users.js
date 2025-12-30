import { generatePasswordHash, hashPassword } from "../utility/crypt.js";
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
export async function getUser(email) {
  return await sql`
    SELECT *
    FROM users
    WHERE email = ${email}
  `;
}

export async function resetPassword(email, plainText) {
  const temPwd = await generatePasswordHash(plainText);
  await sql`
  UPDATE users SET password_hash = ${temPwd.hashPwd}
  WHERE email = ${email}
  RETURNING id
  `;
}
