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
});

usersRolesSchema.index({ user_id: 1, role_id: 1 });
usersRolesSchema.index({ user_id: 1 });

const User_Roles = mongoose.model('UserRoles', usersRolesSchema);
export default User_Roles;
