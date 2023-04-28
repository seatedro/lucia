// Write a basic express server
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { env } from "./env.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

// Connect to mongoose
await mongoose.connect(env.DB_URL);

// Create a server
http.createServer(app).listen(env.PORT);
console.log(`Server listening on port ${env.PORT}...`);
