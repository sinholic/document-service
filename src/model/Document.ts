import mongoose, { Schema } from 'mongoose'
import { Long } from 'mongodb'

var current_millies = new Date().getTime();

var DocumentSchema = new mongoose.Schema({
    id: {
        type: String
    },
    name: {
        type: String
    },
    type: {
        type: String
    },
    folder_id: {
        type: String
    },
    content: {
        type: Object,
    },
    timestamps: {
        type: Number
    },
    owner_id: {
        type: String
    },
    share: {
        type: Array
    },
    company_id: {
        type: String
    }
})


var Document = mongoose.model('Document', DocumentSchema)

export default Document