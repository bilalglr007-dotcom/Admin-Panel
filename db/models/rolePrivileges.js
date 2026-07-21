import mongoose from 'mongoose';
const rolePrivilegesSchema = new mongoose.Schema
({
    role_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roles'        
    },
    permission:{
        type: String
    }, 
    created_by:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }
   }, {
    timestamps: true,
    versionKey: false
})
const Role_Privileges = mongoose.model('RolePrivileges',rolePrivilegesSchema)
export default Role_Privileges
