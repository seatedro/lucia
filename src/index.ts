// Write a basic express server
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { env, zParse } from "./env.js";
import { z } from "zod";
import { auth } from "./auth.js";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.get("/user", async (req, res) => {
  try {
    const schema = z.object({
      query: z.object({
        userId: z.string(),
      }),
    });

    const parse = zParse(schema, req);
    if (!parse.success) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const { userId } = parse.data.query;

    const user = await auth.getUser(userId);
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/user", async (req, res) => {
  try {
    const schema = z.object({
      body: z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(8),
      }),
    });

    const parse = zParse(schema, req);
    if (!parse.success) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const { email, name, password } = parse.data.body;

    const user = await auth.createUser({
      primaryKey: {
        providerId: "username",
        providerUserId: email,
        password,
      },
      attributes: {
        name,
        email,
      },
    });
    return res.json(user);
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
