import fs from "fs/promises"
import path from "path"
import { nanoid } from "nanoid";

const contactsPath = path.join("db", "contacts.json");

async function listContacts() {
    const contactsList = await fs.readFile(contactsPath)
    return JSON.parse(contactsList)
}

async function getContactById(contactId) {
    const list = await listContacts()
    const result = list.find(item => item.id === contactId)
    return result || null
}

async function removeContact(contactId) {
    const list = await listContacts()
    const index = list.findIndex(item => item.id === contactId)
    if (index === -1) {
        return null
    }
    const [result] = list.splice(index, 1)
    fs.writeFile(contactsPath, JSON.stringify(list, null, 2))
    return result
}

async function addContact(name, email, phone) {
    const list = await listContacts()
    const newContact = {
        id: nanoid(),
        name,
        email,
        phone
    }
    list.push(newContact)
    fs.writeFile(contactsPath, JSON.stringify(list, null, 2))
    return newContact
}

export default { listContacts, getContactById, removeContact, addContact }
