import { Contact } from "../models/contact.js"
import { ctrlWrapper } from "../helpers/ctrlsWrapper.js"
import { HttpError } from "../helpers/HttpError.js";

const getAllContacts = async (req, res) => {
    const { _id: owner } = req.user
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner }, "-createdAt -updatedAt", { skip, limit }).populate("owner", "email password");
    res.json(result)
};

// const getOneContact = async (req, res) => {
//     const result = await Contact.findById(req.params.id)
//     if (!result) {
//         throw HttpError(404, "Not found")
//     }
//     res.json(result)

// };

//to find contact wich belong owner
const getOneContact = async (req, res) => {
    const { _id: owner } = req.user;
    const contactId = req.params.id;
    const result = await await Contact.findOne({ _id: contactId, owner })
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result)

};

const deleteContact = async (req, res) => {
    const { id } = req.params
    const result = await Contact.findByIdAndDelete(id)
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result)
};

const createContact = async (req, res) => {
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const result = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result)
};

const updateContactFavorite = async (req, res) => {
    const result = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result)
};

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
    updateContactFavorite: ctrlWrapper(updateContactFavorite),
}
