import UserRoles from '../db/models/userRoles.js'
import express from 'express'
const router = express.Router()

router.post('/', async (req, res, next) =>
{
  try {
    const addUserRoles = await UserRoles.create(req.body)
    res.status(201).json({success: true, data: addUserRoles})
  } catch (err) {
    next(err)
  }
})
router.get('/',async (req,res,next) =>
{
  try {
    const findUserRoles = await UserRoles.find()
    res.status(200).json({success: true, data: findUserRoles})
  } catch (err) {
    next(err)
  }
})
router.get('/:id',async (req,res,next) =>
{
  try {
    const userRolesByDetail = await UserRoles.findById(req.params.id)
    res.status(200).json({success: true, data: userRolesByDetail})
  } catch (err) {
    next(err)
  }
})
router.put('/:id',async (req,res,next) =>
{
  try {
    const userRolesUpdate = await UserRoles.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'})
    res.status(200).json({success: true, data: userRolesUpdate})
  } catch (err) {
    next(err)
  }
})
router.delete('/:id',async (req,res,next) =>
{
  try {
    const userRolesDelete = await UserRoles.findByIdAndDelete(req.params.id)
    res.status(200).json({success: true, message: 'Kullanıcı Rol İlişkisi Başarıyla Silindi' })
  } catch (err) {
    next(err)
  }
})
export default router;    