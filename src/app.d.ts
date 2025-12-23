// See https://kit.svelte.dev/docs/types#app

import type { isAdmin } from "$lib/auth";

// for information about these types
declare global {
  namespace App {
    interface Locals {
      user: {
        id: string;
        email: string;
        name?: string;
        isAdmin?: boolean;
      } | null;
      userId: string | null;
    }
    interface PageData {
      user?: {
        id: string;
        email: string;
        name?: string;
        isAdmin?: boolean;
      } | null;
    }
    // interface Error {}
    // interface PageData {}
    // interface Platform {}
  }
}

export {};
