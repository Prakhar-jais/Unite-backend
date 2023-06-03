import mongoose from 'mongoose'

const UniteAppSchema = mongoose.Schema({
    message:String,
    name:String,
    timestamp:String,
    received:Boolean,
})

export default mongoose.model('messagecontents',UniteAppSchema)