import express from 'express'
import config from '../config/index.js';
import authRouter from '../routes/auth.js'
const router = express.Router();

router.get('/', (req, res, next) => 
{
  res.json({ Message: 'Hoşgeldiniz...' });
});

router.get('/config-test',(req, res, next)=>
  {
    res.json({success: true, data: config})
  })

  router.use('/auth', authRouter)

export default router
