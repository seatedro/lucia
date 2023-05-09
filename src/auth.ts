import adapter from "@lucia-auth/adapter-mongoose";
import lucia from "lucia-auth";
import { express } from "lucia-auth/middleware";
import "lucia-auth/polyfill/node";
import mongoose from "mongoose";

const User = mongoose.model(
  "auth_user",
  new mongoose.Schema(
    {
      _id: {
        type: String,
      },
      // here you can add custom fields for your user
      // e.g. name, email, username, roles, etc.
      name: String,
      email: {
        type: String,
        unique: true,
      },
    },
    { _id: false }
  )
);

const Session = mongoose.model(
  "auth_session",
  new mongoose.Schema(
    {
      _id: {
        type: String,
      },
      user_id: {
        type: String,
        required: true,
      },
      active_expires: {
        type: Number,
        required: true,
      },
      idle_expires: {
        type: Number,
        required: true,
      },
    },
    { _id: false }
  )
);

const Key = mongoose.model(
  "auth_key",
  new mongoose.Schema(
    {
      _id: {
        type: String,
      },
      user_id: {
        type: String,
        required: true,
      },
      hashed_password: String,
      primary_key: {
        type: Boolean,
        required: true,
      },
      expires: Number,
    },
    { _id: false }
  )
);

export const auth = lucia({
  // ,,,
  adapter: adapter(mongoose),
  env: "DEV",
  middleware: express(),
  origin: ["https://airecruiter.us"],
  transformDatabaseUser: (user) => {
    return {
      userId: user.id,
      email: user.email,
      name: user.name,
    };
  },
});
export type Auth = typeof auth;
