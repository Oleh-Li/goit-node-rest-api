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
import { sendEmail } from "../helpers/sendEmail.js"
import { nanoid } from "nanoid"

const { SECRET_KEY, BASE_URL } = process.env

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
    const verificationCode = nanoid()

    const newUser = await User.create({ ...req.body, password: hashPassword, avatarURL, verificationCode })

    const verifyEmail = {
        to: email,
        from: "mangenda@meta.ua",
        subject: "Test  Verify Email",
        text: "Verify Email",
        // html: `<a target="_blank" href="${BASE_URL}/auth/verify/${verificationCode}">TEST email</a>`
        html: `<p><strong>Test email</strong> Test my email from localhost:3000 ${verificationCode}</p>`
    }

    await sendEmail(verifyEmail)

    res.status(201).json({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        subscription: newUser.subscription
    })
}

const verifyEmail = async (req, res) => {
    const { verificationCode } = req.params
    const user = await User.findOne({ verificationCode })
    if (!user) {
        throw HttpError(401, "Email not found")
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationCode: "" })

    res.json({
        message: "Email verify success"
    })

}

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw HttpError(401, "Email not found")
    }

    if (user.verify) {
        throw HttpError(401, "Email already verifyed")
    }

    const verifyEmail = {
        to: email,
        from: "mangenda@meta.ua",
        subject: "Test  Verify Email",
        text: "Verify Email",
        // html: `<a target="_blank" href="${BASE_URL}/auth/verify/${verificationCode}">TEST email</a>`
        html: `<p><strong>Test email</strong> Test my email from localhost:3000 resend verify email code ${user.verificationCode}</p>`
    }

    await sendEmail(verifyEmail)

    res.json({
        message: "Verify email send success"
    })
}

const login = async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        throw HttpError(401, "Email or password invalid")
    }

    if (!user.verify) {
        throw HttpError(401, "Email not verify")
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
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar)
}