import mongoose from "mongoose"

import app from "./app.js"

import dotenv from 'dotenv';
dotenv.config();


const { DB_HOST, PORT } = process.env

mongoose.set('strictQuery', true)

mongoose.connect(DB_HOST)
    .then(() => {
        app.listen(PORT)
        console.log("server running")
    })
    .catch(error => {
        console.log("ERRR")
        console.log(error.message)
        process.exit(1)
    })



