import { Schema, model } from "mongoose"

const schema = Schema({
	uid: String,
    username: String,
    admin: Boolean,
    isRegistered: Boolean,
    profilePicture: String
})

export default model("User", schema)
