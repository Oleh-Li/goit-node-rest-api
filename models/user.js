import { Schema, model } from "mongoose"
import Joi from "joi"

import handleMongooseError from "../helpers/handleMongooseError.js"

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const subscriptionList = ["starter", "pro", "business"]

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String,
        required: true
    },
    verify: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        default: ""
    }
}, { versionKey: false, timestamps: true })

export const registerSchema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().pattern(emailRegexp).required(),
    subscription: Joi.string().valid(...subscriptionList)
})

export const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
})


userSchema.post("save", handleMongooseError)

export const User = model("user", userSchema)
