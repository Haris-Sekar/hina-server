import express from "express";

import { testConnection, syncDatabase } from "./config/db.js";
import configurePassport from "./config/passport.js";
import { redisStore } from "./config/redis.js"; // Import Redis config
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

app.use(
	session({
		store: redisStore, // Use custom Redis store created with ioredis
		secret: process.env.SESSION_SECRET || "default_secret",
		resave: false, // Avoid resaving session if unmodified
		saveUninitialized: false, // Don't save empty sessions
		cookie: {
			httpOnly: true, // Restrict cookie access to HTTP requests
			secure: process.env.NODE_ENV === "production", // Only send cookies over HTTPS in production
			maxAge: 24 * 60 * 60 * 1000, // Set cookie expiration to 1 day
		},
	})
);

configurePassport();

app.get("/server-status", (req, res) => {
	res.status(200).json({
		message: "Server started at port 3000",
	});
});

import user from "./routes/user.js";
import company from "./routes/company.js";

app.use("/api/v1/users", user);
app.use("/api/v1/company", company);

const startApp = async () => {
	await testConnection();
	await syncDatabase();
	// await seed();
	app.listen(3000, () => {
		console.log("Server is running on port 3000");
	});
};

startApp();
