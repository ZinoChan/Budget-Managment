"use server";

import { cookies } from "next/headers";

export async function setAccessToken(access_token: string) {
  cookies().set("access_token", access_token, { secure: true });
}

export async function getAccessToken() {
  return cookies().get("access_token");
}
