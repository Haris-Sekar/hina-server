import express from "express";

import { testConnection, syncDatabase } from "./config/db.js";
import configurePassport from "./config/passport.js"; 
import dotenv from "dotenv";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
dotenv.config(); 

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
