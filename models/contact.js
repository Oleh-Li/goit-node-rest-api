import { Schema, model } from "mongoose"
import Joi from "joi";
import handleMongooseError from "../helpers/handleMongooseError.js";

const contactSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
}, { versionKey: false, timestamps: true })

contactSchema.post("save", handleMongooseError)

export const createContactSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean()
})

export const updateContactSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
    favorite: Joi.boolean()
}).min(1)

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
})

export const Contact = model("contact", contactSchema)