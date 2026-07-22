import JWT from 'jsonwebtoken'
import UserRoles from '../db/models/userRoles.js'
import Roles from '../db/models/roles.js'

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) 
    {
       return res.status(401).json({success: false, message: 'Token Bulunamadı, Giriş Yapın!'})    
    }
    try {
       const decoded = JWT.verify(token, process.env.JWT_SECRET || 'secret_key')
       const userRoles = await UserRoles.find({ user_id: decoded.id }).populate('role_id')
       req.user = {id: decoded.id, email: decoded.email, roles: userRoles.map(ur => ur.role_id ? ur.role_id.role_name : null).filter(Boolean)}
       next()
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Geçersiz veya süresi dolmuş token!' })
    }
}
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.roles) {
            return res.status(403).json({ success: false, message: 'Yetki bilgisi bulunamadı!' });
        }

        const hasRole = req.user.roles.some(role => allowedRoles.includes(role));

        if (!hasRole) {
            return res.status(403).json({ success: false, message: 'Bu işlemi gerçekleştirmek için yetkiniz yok!' });
        }

        next();
    };
};

export { authenticateToken, checkRole };