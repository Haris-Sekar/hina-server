import express from "express";

import {
    testConnection,
    syncDatabase
} from "./config/db.js";
import configurePassport from "./config/passport.js";
import dotenv from "dotenv";
import cors from "cors";
import itemRoutes from "./routes/item.js";

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
import customers from "./routes/customer.js";
import modules from "./routes/modules.js";
import {
    seedDataForAllOrgs
} from "./utils/seedNewCompanyDBValues.js";

app.use("/api/v1/users", user);
app.use("/api/v1/company", company);
app.use("/api/v1/customers", customers);
app.use("/api/v1/modules", modules);
app.use("/api/v1/items", itemRoutes);

const startApp = async () => {
    await testConnection();
    await syncDatabase();
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });

    const isSeedNeeded = process.env.IS_SEED_NEEDED;

    if (isSeedNeeded === "true") {
        await seedDataForAllOrgs();
    }

};

startApp();