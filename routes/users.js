import express from 'express'
const router = express.Router();


router.get('/', (req, res, next) => {
  res.json({message: 'respond with a resource'});
});

export default router;
