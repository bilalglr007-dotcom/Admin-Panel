import AuditLogs from "../db/models/auditlogs.js";

class Audit 
{
    static async log({level = 'INFO', email = 'admin@info.com', location, proc_type, log})
    {
        try {
            await AuditLogs.create({
                level,
                email,
                location, 
                proc_type,
                log
            })
        } catch (err) {
            console.error('Log Oluşturulurken Hata Oluştu', err.message);
            
        }
    }  
}
export default Audit