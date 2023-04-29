// app.d.ts
/// <reference types="lucia-auth" />
declare namespace Lucia {
  // ...
  interface UserAttributes {
    name: string;
    email: string;
  }
}
