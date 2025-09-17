
const mongoose = require("mongoose");

const { Schema }=  mongoose;

const UserSchema = new Schema({
    firstName: { type: String, required: true},
    lastName: { type: String},
    emailId: { type: String, unique: true,required: true},
    password: { type: String, required: true},
    role: { type: String, enum: ["user", "admin"], default: "user" }
}, {
    timestamps: true
});

module.exports = mongoose.model("User",UserSchema);