import Audit from '../lib/audit.js';
import Users from '../db/models/users.js'
import express from 'express'
import mongoose from 'mongoose';
const router = express.Router();

router.post('/', async (req, res, next) =>
{
  try {
    const addUser = await Users.create(req.body)
    await Audit.log({level:'INFO',email:addUser.email,location:'USERS',proc_type:'POST',log:`Yeni Kullanıcı Eklendi -> Ad Soyad: ${addUser.first_name} ${addUser.last_name}, E-posta: ${addUser.email}`})
    res.status(201).json({success: true, data: addUser})
  } catch (err) {
    next(err)
  }
})
router.get('/',async (req,res,next) =>
{
  try {
    const findUsers = await Users.find()
    res.status(200).json({success: true, data: findUsers})
  } catch (err) {
    next(err)
  }
})
router.get('/:id',async (req,res,next) =>
{
  try {
    const userByDetail = await Users.findById(req.params.id)
    res.status(200).json({success: true, data: userByDetail})
  } catch (err) {
    next(err)
  }
})
router.put('/:id',async (req,res,next) =>
{
  try {
    const currentUser = await Users.findById(req.params.id)
    const userUpdate = await Users.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'})
    const updatedFields = Object.keys(req.body).join(', ')
    await Audit.log({level:'INFO',email:currentUser.email,location:'USERS',proc_type:'PUT',log:`${currentUser.email} Kullanıcısının Şu Alanları Güncellendi: ${updatedFields}`})
    res.status(200).json({success: true, data: userUpdate})
  } catch (err) {
    next(err)
  }
})
router.delete('/:id',async (req,res,next) =>
{
  try {
    const userDelete = await Users.findByIdAndDelete(req.params.id)
    await Audit.log({level:'INFO', email:userDelete.email, location: 'USERS', proc_type: 'DELETE', log:`${userDelete.email} E-postalı (${userDelete.first_name} ${userDelete.last_name}) Kullanıcı Silindi!`})
    res.status(200).json({success: true, message: 'Kullanıcı Verisi Başarıyla Silindi' })
  } catch (err) {
    next(err)
  }
})

export default router;
