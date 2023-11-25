import { Schema, model } from "mongoose"

const schema = Schema({
	uid: String,
    username: String,
    admin: Boolean,
    isRegistered: Boolean
})

export default model("User", schema)
