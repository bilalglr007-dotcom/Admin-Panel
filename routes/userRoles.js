import Audit from '../lib/audit.js';
import UserRoles from '../db/models/userRoles.js';
import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

router.post('/', async (req, res, next) =>
{
  try {
    const addUserRoles = await UserRoles.create(req.body)
    await Audit.log({level:'INFO',email:'admin@info.com',location:'USER_ROLES',proc_type:'POST',log:`Yeni Kullanıcı-Rol İlişkisi Tanımlandı -> User ID: ${addUserRoles.user_id}, Role ID: ${addUserRoles.role_id}`})
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
    const currentUserRoles = await UserRoles.findById(req.params.id)
    const userRolesUpdate = await UserRoles.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'})
    const updatedFields = Object.keys(req.body).join(', ')
    await Audit.log({level:'INFO',email:'admin@info.com',location:'USER_ROLES',proc_type:'PUT',log:`Kullanıcı-Rol İlişkisinin Şu Alanları Güncellendi: ${updatedFields}`})
    res.status(200).json({success: true, data: userRolesUpdate})
  } catch (err) {
    next(err)
  }
})
router.delete('/:id',async (req,res,next) =>
{
  try {
    const userRolesDelete = await UserRoles.findByIdAndDelete(req.params.id)
    await Audit.log({level:'INFO', email:'admin@info.com', location: 'USER_ROLES', proc_type: 'DELETE', log:`Kullanıcı-Rol İlişkisi Silindi! (User ID: ${userRolesDelete.user_id})`})
    res.status(200).json({success: true, message: 'Kullanıcı Rol İlişkisi Başarıyla Silindi' })
  } catch (err) {
    next(err)
  }
})

export default router;