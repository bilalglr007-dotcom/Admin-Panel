import Audit from '../lib/audit.js';
import Roles from '../db/models/roles.js';
import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

router.post('/', async (req, res, next) =>
{
  try {
    const addRole = await Roles.create(req.body)
    await Audit.log({level:'INFO',email:'admin@info.com',location:'ROLES',proc_type:'POST',log:`Yeni Rol Eklendi -> Rol Adı: ${addRole.role_name}`})
    res.status(201).json({success: true, data: addRole})
  } catch (err) {
    next(err)
  }
})
router.get('/',async (req,res,next) =>
{
  try {
    const findRoles = await Roles.find()
    res.status(200).json({success: true, data: findRoles})
  } catch (err) {
    next(err)
  }
})
router.get('/:id',async (req,res,next) =>
{
  try {
    const roleByDetail = await Roles.findById(req.params.id)
    res.status(200).json({success: true, data: roleByDetail})
  } catch (err) {
    next(err)
  }
})
router.put('/:id',async (req,res,next) =>
{
  try {
    const currentRole = await Roles.findById(req.params.id)
    const roleUpdate = await Roles.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'})
    const updatedFields = Object.keys(req.body).join(', ')
    await Audit.log({level:'INFO',email:'admin@info.com',location:'ROLES',proc_type:'PUT',log:`${currentRole.role_name} Rolünün Şu Alanları Güncellendi: ${updatedFields}`})
    res.status(200).json({success: true, data: roleUpdate})
  } catch (err) {
    next(err)
  }
})
router.delete('/:id',async (req,res,next) =>
{
  try {
    const roleDelete = await Roles.findByIdAndDelete(req.params.id)
    await Audit.log({level:'INFO', email:'admin@info.com', location: 'ROLES', proc_type: 'DELETE', log:`${roleDelete.role_name} İsimli Rol Silindi!`})
    res.status(200).json({success: true, message: 'Rol Verisi Başarıyla Silindi' })
  } catch (err) {
    next(err)
  }
})

export default router;