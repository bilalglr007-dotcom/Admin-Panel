import Users from '../db/models/users.js'
import express from 'express'
import mongoose from 'mongoose';
const router = express.Router();

router.post('/', async (req, res, next) =>
{
  try {
    const addUser = await Users.create(req.body)
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
    const userUpdate = await Users.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'})
    res.status(200).json({success: true, data: userUpdate})
  } catch (err) {
    next(err)
  }
})
router.delete('/:id',async (req,res,next) =>
{
  try {
    const userDelete = await Users.findByIdAndDelete(req.params.id)
    res.status(200).json({success: true, message: 'Kullanıcı Verisi Başarıyla Silindi' })
  } catch (err) {
    next(err)
  }
})

export default router;
