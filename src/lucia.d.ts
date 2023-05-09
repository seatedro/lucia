import type { Response } from "express";
import type { Auth, AuthRequest } from "lucia-auth";

// app.d.ts
/// <reference types="lucia-auth" />
declare namespace Lucia {
  // ...
  interface UserAttributes {
    name: string;
    email: string;
  }
}

// declare global {
//   namespace Express {
//     interface Response {
//       locals: {
//         auth: AuthRequest;
//       };
//     }
//   }
// }
export type ResponseWithAuth = {
  locals: {
    auth: AuthRequest<Auth>;
  };
} & Response;
