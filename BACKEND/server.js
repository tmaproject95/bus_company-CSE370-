import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import loginsystem from "./routes/loginsystem.js"
import busnroute from "./routes/busnroute.js"
import seats from "./routes/seats.js"
import bookmanage from "./routes/bookmanage.js"
import admin from "./routes/admin.js";



dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/user",loginsystem);
app.use("/api/routes",busnroute);
app.use("/api/seats",seats);
app.use("/api/initbooking",bookmanage);
app.use("/api/admin", admin);





app.get("/",(req,res)=>{
    res.send('WELCOME ADMINSSS!')
});
app.listen(process.env.PORT,()=>{
    console.log(`Server is running on 'http://localhost:${process.env.PORT}'`)
})



