import AuditLogs from '../db/models/auditlogs.js';
import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

router.post('/', async (req, res, next) =>
{
  try {
    const addAuditLog = await AuditLogs.create(req.body)
    res.status(201).json({success: true, data: addAuditLog})
  } catch (err) {
    next(err)
  }
})
router.get('/',async (req,res,next) =>
{
  try {
    const findAuditLogs = await AuditLogs.find()
    res.status(200).json({success: true, data: findAuditLogs})
  } catch (err) {
    next(err)
  }
})
router.get('/:id',async (req,res,next) =>
{
  try {
    const auditLogByDetail = await AuditLogs.findById(req.params.id)
    res.status(200).json({success: true, data: auditLogByDetail})
  } catch (err) {
    next(err)
  }
})
router.put('/:id',async (req,res,next) =>
{
  try {
    const auditLogUpdate = await AuditLogs.findByIdAndUpdate(req.params.id, req.body, {returnDocument: 'after'})
    res.status(200).json({success: true, data: auditLogUpdate})
  } catch (err) {
    next(err)
  }
})
router.delete('/:id',async (req,res,next) =>
{
  try {
    const auditLogDelete = await AuditLogs.findByIdAndDelete(req.params.id)
    res.status(200).json({success: true, message: 'Sistem Günlüğü Başarıyla Silindi' })
  } catch (err) {
    next(err)
  }
})

export default router;