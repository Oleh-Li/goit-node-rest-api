import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../models/user.js"
import { HttpError } from "../helpers/HttpError.js"
import { ctrlWrapper } from "../helpers/ctrlsWrapper.js"
import dotenv from 'dotenv';
dotenv.config();
import gravatar from "gravatar"
import path from "path"
import { dirname } from 'path';
import fs from "fs/promises"
import { fileURLToPath } from 'url';
import Jimp from "jimp"

const { SECRET_KEY } = process.env

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const avatarDir = path.join(__dirname, "../", "public", "avatars")

const register = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user) {
        throw HttpError(409, "Email already in use")
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const avatarURL = gravatar.url(email)

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL })

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        subscription: newUser.subscription
    })
}

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw HttpError(401, "Email or password invalid")
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid")
    }

    const payload = {
        id: user._id
    }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" })
    await User.findByIdAndUpdate(user._id, { token })

    res.json({
        token
    })
}

const getCurrent = async (req, res) => {
    const { email, name } = req.user;

    res.json({
        email,
        name,
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({
        message: "Logout success"
    })
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user
    const { path: tempUpload, originalname } = req.file

    //with resize
    const filename = `${_id}_${originalname}`
    Jimp.read(tempUpload)
        .then((image) => {
            return image
                .resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale() // set greyscale
                .write(path.join(avatarDir, filename)); // save
        })
        .catch((err) => {
            console.error(err);
        });

    //without resize
    // const filename = `${_id}_${originalname}`
    // console.log("tempUpload==>", tempUpload)
    // const resultUpload = path.join(avatarDir, filename)
    // await fs.rename(tempUpload, resultUpload)
    const avatarURL = path.join("avatars", filename)
    await User.findByIdAndUpdate(_id, { avatarURL })

    res.json({
        avatarURL
    })
}


export default {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar)
}