import mongoose from "mongoose"

import app from "./app.js"


const { DB_HOST, PORT } = process.env

mongoose.set('strictQuery', true)

mongoose.connect(DB_HOST)
    .then(() => console.log("Database connect siccess"))
    .then(() => {
        app.listen(PORT)
    })
    .catch(error => {
        console.log("ERRR")
        console.log(error.message)
        process.exit(1)
    })



