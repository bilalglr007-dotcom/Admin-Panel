import mongoose from "mongoose";
const rolesSchema = new mongoose.Schema
({
    role_name:{
        type: String,
        required: true,
        unique: true
    },
    is_active:{
        type: Boolean,
        default: true
    },
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
}, {
    timestamps: true, 
    versionKey: false
})
const Roles = mongoose.model('Roles',rolesSchema)
export default Roles