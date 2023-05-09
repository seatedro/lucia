import type { Response } from "express";
import type { Auth, AuthRequest } from "lucia-auth";

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
