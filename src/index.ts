// Write a basic express server
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { env, zParse } from "./env.js";
import { z } from "zod";
import { auth } from "./auth.js";
import type { ResponseWithAuth } from "./app.js";

const app = express();
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello world!");
});

app.use((req, res: ResponseWithAuth, next) => {
  res.locals.auth = auth.handleRequest(req, res);
  next();
});

app.get("/user", async (req, res: ResponseWithAuth) => {
  try {
    const { user } = await res.locals.auth.validateUser();
    if (!user) {
      res.header("location", "/login");
      return res.status(302).send();
    }
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/register", async (req, res: ResponseWithAuth) => {
  try {
    const authRequest = auth.handleRequest(req, res);
    console.log(`Request origin: ${req.headers.origin}`);

    const schema = z.object({
      // headers: z.object({
      //   origin: z.string(),
      // }),
      body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        name: z.string(),
      }),
    });

    const parse = zParse(schema, req);
    if (!parse.success) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // CSRF Check
    // const { origin } = parse.data.headers;
    // const url = req.url;
    // const isValidRequest = !!origin && origin == url;

    // if (!isValidRequest) {
    //   return res.status(403).send();
    // }

    const { email, password, name } = parse.data.body;

    const user = await auth.createUser({
      primaryKey: {
        providerId: "username",
        providerUserId: email,
        password,
      },
      attributes: {
        email,
        name,
      },
    });

    const session = await auth.createSession(user.userId);
    authRequest.setSession(session);

    return res.status(302).send({
      message: "User created successfully!",
    });
  } catch (err) {
    console.error(err);
    return res.status(400).send();
  }
});

app.post("/login", async (req, res: ResponseWithAuth) => {
  try {
    const authRequest = auth.handleRequest(req, res);
    const session = await authRequest.validate();
    console.log(`Session already exists: ${session}`);
    if (session) {
      // if (session.fresh) {
      //   authRequest.setSession(session);
      // }
      return res.status(302).json({
        session,
      });
    }
    const schema = z.object({
      // headers: z.object({
      //   origin: z.string(),
      // }),
      body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
      }),
    });

    const parse = zParse(schema, req);
    if (!parse.success) {
      return res.status(400).json({ error: "Invalid request" });
    }

    // CSRF Check
    // const { origin } = parse.data.headers;
    // const isValidRequest = !!origin && origin == "https://airecruiter.us";

    // if (!isValidRequest) {
    //   return res.status(403).send();
    // }
    const { email, password } = parse.data.body;

    const { userId, providerUserId } = await auth.useKey(
      "username",
      email,
      password
    );
    const newSession = await auth.createSession(userId);
    authRequest.setSession(newSession);

    return res.status(302).json({
      session: newSession,
      email: providerUserId,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Connect to mongoose
await mongoose.connect(env.DB_URL);
console.log("Connected to MongoDB");
// Create a server
http.createServer(app).listen(env.PORT);
console.log(`Server listening on port ${env.PORT}...`);
