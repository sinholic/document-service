import mongoose, { Schema } from 'mongoose'
import { Long } from 'mongodb'

var current_millies = new Date().getTime();

var FolderSchema = new mongoose.Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    type: {
        type: String,
        default: `folder`
    },
    timestamps: {
        type: String
    },
    owner_id: {
        type: String
    },
    company_id: {
        type: String
    },
    content: {
        type: Object
    }
})


var Folder = mongoose.model('Folder', FolderSchema)

export default Folder