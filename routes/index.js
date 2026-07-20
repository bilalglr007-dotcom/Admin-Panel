import express from 'express'
import config from '../config/index.js';
const router = express.Router();



router.get('/', (req, res, next) => {
  res.json({ Message: 'Hoşgeldiniz...' });
});

router.get('/config-test',(req, res, next)=>
  {
    res.json({success: true, data: config})
  })

export default router
