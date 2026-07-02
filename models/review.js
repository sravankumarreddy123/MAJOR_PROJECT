const mongoose = require("mongoose");
const schema = mongoose.Schema;

const reviewSchema = new schema({
    comment : String,
    rating:{
        type:String,
        min:1,
        max:5
    },
    created_at:{
        type:Date,
        default: Date.now,
    },
    author:{
        type:schema.Types.ObjectId,
        ref:"User"
    }
})

const Review = mongoose.model("Review",reviewSchema);
module.exports = Review;