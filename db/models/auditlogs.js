import mongoose from "mongoose";
const auditlogs = new mongoose.Schema
({
    level:{
        type: String
    },
    email:{
        type: String,
    },
    location:{
        type: String
    },
    proc_type:{
        type: String
    },
    log:{
        type: String
    },
   }, {
    timestamps: true
})
const Audit_Logs = mongoose.model('Audit_Logs',auditlogs)
export default Audit_Logs