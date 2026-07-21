import express from 'express'
const router = express.Router()

router.get('/',(req, res, next) =>
    {
        res.json({success: true, message: 'Role Privileges Route Başarıyla Çalışıyor'})
    })

export default router;    