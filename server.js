import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import userRouter from "./routes/userRoute.js"
import authRouter from "./routes/taskRoute.js";


dotenv.config();
const app =express();
const port =process.env.PORT ||8000;

//middelware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//DB CONNECT
connectDB();

//Route
app.use("/api/user",userRouter);
app.use("/api/task",authRouter);

app.get("/",(req,res)=>{
    res.send('API Working');
})

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
});

