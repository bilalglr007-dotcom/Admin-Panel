import mongoose from "mongoose";
const usersSchema = new mongoose.Schema
({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    is_active:{
        type: Boolean,
        default: true
    },
    first_name:{
        type: String,
        required: true
    },
    last_name:{
        type: String,
        required: true
    },
    phone_number:{
        type: String,
        unique: true,
        sparse: true
    }
   }, {
    timestamps: true     
})
const Users = mongoose.model('Users',usersSchema)
export default Users