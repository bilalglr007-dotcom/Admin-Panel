import mongoose from 'mongoose';
import config from '../config/index.js';
const connectDB = async()=>
    {
        try {
            await mongoose.connect(config.CONNECTION_STRING)
            console.log('MongoDB Bağlantısı Başarıyla Kuruldu!');
        } catch (error) {
            console.log('MongoDB Bağlantısı Sağlanamadı',error.message);
            process.exit(1)
        }
    }
    export default connectDB