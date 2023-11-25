import mongoose, { Schema, model } from "mongoose"

const schema = Schema({
	name: String,
    location: String,
    type: String,
    owner: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

export default model("Restaurant", schema)
