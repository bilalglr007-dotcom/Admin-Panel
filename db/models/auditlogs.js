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
    timestamps: true,
    versionKey: false
});

auditlogs.index({ createdAt: -1 });
auditlogs.index({ location: 1, proc_type: 1 });

const Audit_Logs = mongoose.model('Audit_Logs', auditlogs);
export default Audit_Logs;