import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Journal from "./models/JournalEntry.js";


dotenv.config(); // ✅ Load .env file

const data = JSON.parse(fs.readFileSync("./journalData.json", "utf-8"));


await mongoose.connect(process.env.MONGO_URI);
await Journal.deleteMany({});
await Journal.insertMany(data);

console.log("✅ Mock Journal Data inserted successfully!");
mongoose.connection.close();
