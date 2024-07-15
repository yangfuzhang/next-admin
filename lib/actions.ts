"use server";
import { signOut } from "@/auth";
import bcrypt from "bcryptjs";

export async function logout() {
  await signOut();
}

export async function verifyPassword(password: string, dbPassword: string) {
  return bcrypt.compareSync(password as string, dbPassword);
}
