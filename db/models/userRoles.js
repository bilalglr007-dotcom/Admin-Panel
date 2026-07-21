import mongoose from "mongoose";
const usersRolesSchema = new mongoose.Schema
({
    role_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles'
    },
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
   }, {
    timestamps: true,
    versionKey: false  
})
const User_Roles = mongoose.model('UserRoles',usersRolesSchema)
export default User_Roles

