import express from 'express'
const app = express()
app.get('/api',(req,res)=>
    {
        res.json({Message:'Admin Panel API Çalışıyor!'})
    })
app.listen(8080,()=>
    {
        console.log('Sunucu Ayaklandı!')
    })    