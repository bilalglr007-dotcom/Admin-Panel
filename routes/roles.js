import Roles from '../db/models/roles.js'
import express from 'express'
const router = express.Router()

router.post('/', async (req, res, next) =>
{
  try {
    const addRole = await Roles.create(req.body)
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
    const roleUpdate = await Roles.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'})
    res.status(200).json({success: true, data: roleUpdate})
  } catch (err) {
    next(err)
  }
})
router.delete('/:id',async (req,res,next) =>
{
  try {
    const roleDelete = await Roles.findByIdAndDelete(req.params.id)
    res.status(200).json({success: true, message: 'Rol Verisi Başarıyla Silindi' })
  } catch (err) {
    next(err)
  }
})

export default router    