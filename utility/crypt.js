import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

export async function generatePasswordHash(plainText) {
  const hashPwd = await hashPassword(plainText);

  return { plainText: plainText, hashPwd: hashPwd };
}
