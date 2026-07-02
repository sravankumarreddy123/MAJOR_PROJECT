const express = require("express");
const routes = express.Router({mergeParams:true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {Loggedin,isReviewAuthor,DeleteAuthorize} = require("../middleware.js");
const reviewControllers = require("../controllers/review.js")

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
         throw new ExpressError(404,error);
    }
    next();
}
// reivew
// post route
routes.post("/",Loggedin,validateReview,wrapAsync( reviewControllers.createReview));


routes.delete("/:reviewId",DeleteAuthorize,isReviewAuthor,wrapAsync(reviewControllers.destroyReview));

module.exports = routes;