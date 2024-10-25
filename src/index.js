import dotenv from 'dotenv';

dotenv.config({path: './.env'});

import connectDB from "../db/index.js";
import { app } from "./app.js";

connectDB()
.then( () => {
    app.listen(process.env.PORT, () => {
        console.log('SERVER is runnig on 8000')
    })
})
.catch( (error) => {
    console.log("Mongo DB connection fail.", error)
})

// app.listen(process.env.PORT, () => {
//     console.log('SERVER is runnig on 8000')
// })

