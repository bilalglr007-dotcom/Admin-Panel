import mongoose from "mongoose";
const categoriesSchema = new mongoose.Schema
({
    name:{
        type: String,
        required: true
    },

    is_active:{
        type: Boolean,
        default: true
    },
    created_by:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
    }
   }, {
    timestamps: true,
    versionKey: false 
})
const Categories = mongoose.model('Categories',categoriesSchema)
export default Categories