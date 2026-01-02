import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
import PocketBase from "pocketbase";
import type { TypedPocketBase } from "./pocketbase-types";

export function createInstance() {
  return new PocketBase(PUBLIC_POCKETBASE_URL) as TypedPocketBase;
}

export const pb = createInstance();
