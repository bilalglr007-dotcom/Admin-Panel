import RolePrivileges from '../db/models/rolePrivileges.js'
import express from 'express'
const router = express.Router()

router.post('/', async (req, res, next) =>
{
  try {
    const addRolePrivileges = await RolePrivileges.create(req.body)
    res.status(201).json({success: true, data: addRolePrivileges})
  } catch (err) {
    next(err)
  }
})
router.get('/',async (req,res,next) =>
{
  try {
    const findRolePrivileges = await RolePrivileges.find()
    res.status(200).json({success: true, data: findRolePrivileges})
  } catch (err) {
    next(err)
  }
})
router.get('/:id',async (req,res,next) =>
{
  try {
    const RolePrivilegesByDetail = await RolePrivileges.findById(req.params.id)
    res.status(200).json({success: true, data: RolePrivilegesByDetail})
  } catch (err) {
    next(err)
  }
})
router.put('/:id',async (req,res,next) =>
{
  try {
    const RolePrivilegesUpdate = await RolePrivileges.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'})
    res.status(200).json({success: true, data: RolePrivilegesUpdate})
  } catch (err) {
    next(err)
  }
})
router.delete('/:id',async (req,res,next) =>
{
  try {
    const  RolePrivilegesDelete = await RolePrivileges.findByIdAndDelete(req.params.id)
    res.status(200).json({success: true, message: 'Rol-Yetki İlişkisi Başarıyla Silindi' })
  } catch (err) {
    next(err)
  }
})
export default router;    