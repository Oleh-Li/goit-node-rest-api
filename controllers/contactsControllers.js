import { Contact } from "../models/contact.js"
import { ctrlWrapper } from "../helpers/ctrlsWrapper.js"
import { HttpError } from "../helpers/HttpError.js";

const getAllContacts = async (req, res) => {
    const result = await Contact.find()
    res.json(result)
};

const getOneContact = async (req, res) => {
    const result = await Contact.findById(req.params.id)
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
    const result = await Contact.create(req.body)
    res.status(201).json(result)
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
    updateContactFavorite: ctrlWrapper(updateContact),
}
