// src/lucia.d.ts
/// <reference types="lucia-auth" />
declare namespace Lucia {
  // ...
  type Auth = import("./auth.js").Auth;
  type UserAttributes = {
    name: string;
    email: string;
  }
}