import { listContacts, getContactById, addContact, removeContact, updateById } from "../services/contactsServices.js";
import { ctrlWrapper } from "../helpers/ctrlsWrapper.js"
import HttpError from "../helpers/HttpError.js";

const getAllContacts = async (req, res) => {
    const result = await listContacts()
    res.json(result)
};

const getOneContact = async (req, res) => {
    const result = await getContactById(req.params.id)
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result)

};

const deleteContact = async (req, res) => {
    const { id } = req.params
    const result = await removeContact(id)
    if (!result) {
        throw HttpError(404, "Not found")
    }
    res.json(result)
};

const createContact = async (req, res) => {
    const result = await addContact(req.body)
    res.status(201).json(result)
};

const updateContact = async (req, res) => {
    const result = await updateById(req.params.id, req.body)
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
}
