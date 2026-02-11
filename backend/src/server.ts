import express from "express"
import { config } from "dotenv";
import { connectDB } from "./config/db";

const app = express();

config();
connectDB();


app.use(express.json())
app.use(express.urlencoded({ extended: true }))



const PORT = 5001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})